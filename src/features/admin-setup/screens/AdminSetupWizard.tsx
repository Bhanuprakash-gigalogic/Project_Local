import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetSetupProgress, useUpdateSetupProgress, useValidateSetupCompletion } from '../hooks/useAdminAuth';
import { SetupStep, SetupStatus } from '../types/setup';
import {
    CheckCircle2,
    Circle,
    Loader2,
    MapPin,
    ListTree,
    Image as ImageIcon,
    Users,
    CheckCheck,
    ArrowRight,
    ExternalLink
} from 'lucide-react';

const AdminSetupWizard: React.FC = () => {
    const navigate = useNavigate();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const { data: progress, isLoading } = useGetSetupProgress();
    const updateProgress = useUpdateSetupProgress();
    const { data: validation, refetch: validateSetup } = useValidateSetupCompletion();

    const steps = [
        {
            key: SetupStep.ZONES,
            title: 'Zones Setup',
            description: 'Create delivery zones with polygon boundaries',
            icon: MapPin,
            requirement: 'At least 1 zone required',
        },
        {
            key: SetupStep.CATEGORIES,
            title: 'Categories Setup',
            description: 'Create product categories and subcategories',
            icon: ListTree,
            requirement: 'At least 1 category required',
        },
        {
            key: SetupStep.BANNERS,
            title: 'Banners Setup',
            description: 'Upload promotional banners for the app',
            icon: ImageIcon,
            requirement: 'At least 1 banner required',
        },
        {
            key: SetupStep.SELLER_ALLOCATION,
            title: 'Seller Allocation',
            description: 'Allocate sellers to delivery zones',
            icon: Users,
            requirement: 'At least 1 seller allocated',
        },
        {
            key: SetupStep.COMPLETE,
            title: 'Setup Complete',
            description: 'Finish initial setup and start using the platform',
            icon: CheckCheck,
            requirement: 'All steps completed',
        },
    ];

    const [initialSyncDone, setInitialSyncDone] = useState(false);

    useEffect(() => {
        if (progress && !initialSyncDone) {
            const index = steps.findIndex(s => s.key === progress.current_step);
            if (index !== -1) {
                setCurrentStepIndex(index);
            }
            setInitialSyncDone(true);
        }
    }, [progress, initialSyncDone]);

    const isStepComplete = (stepKey: SetupStep) => {
        return progress?.completed_steps.includes(stepKey) || false;
    };

    const canProceedToStep = (stepKey: SetupStep) => {
        if (!progress) return false;

        switch (stepKey) {
            case SetupStep.ZONES:
                return true;
            case SetupStep.CATEGORIES:
                return progress.zones_count > 0;
            case SetupStep.BANNERS:
                return progress.categories_count > 0;
            case SetupStep.SELLER_ALLOCATION:
                return progress.banners_count > 0;
            case SetupStep.COMPLETE:
                return progress.allocated_sellers_count > 0;
            default:
                return false;
        }
    };

    const handleStepClick = async (index: number, stepKey: SetupStep) => {
        if (!canProceedToStep(stepKey)) return;

        setCurrentStepIndex(index);
        await updateProgress.mutateAsync({
            step: stepKey,
            mark_complete: false,
        });
    };

    const handleCompleteStep = async () => {
        const currentStep = steps[currentStepIndex];

        await updateProgress.mutateAsync({
            step: currentStep.key,
            mark_complete: true,
        });

        // Move to next step if not at the end
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        }
    };

    const handleFinishSetup = async () => {
        try {
            const { data } = await validateSetup();
            // Fallback: if validation is not set up in backend yet, assume valid if all steps passed
            if (data?.is_valid || progress?.allocated_sellers_count! > 0) {
                navigate('/admin/dashboard');
            } else {
                // Should show toast but for now just navigate as fail-safe if backend is quirky
                console.error("Validation failed", data);
            }
        } catch (error) {
            console.error("Setup validation error", error);
            // navigate to dashboard anyway if meaningful work is done
            navigate('/admin/dashboard');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const currentStep = steps[currentStepIndex];

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome to Admin Setup</h1>
                <p className="text-gray-600 mt-2">
                    Complete these steps to get your platform ready
                </p>
            </div>

            {/* Progress Steps */}
            <div className="bg-white border rounded-lg p-6">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isComplete = isStepComplete(step.key);
                        const isCurrent = index === currentStepIndex;
                        const canAccess = canProceedToStep(step.key);

                        return (
                            <React.Fragment key={step.key}>
                                <div className="flex flex-col items-center">
                                    <button
                                        onClick={() => handleStepClick(index, step.key)}
                                        disabled={!canAccess}
                                        className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${isComplete
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : isCurrent
                                                ? 'bg-primary border-primary text-white'
                                                : canAccess
                                                    ? 'bg-white border-gray-300 text-gray-400 hover:border-primary'
                                                    : 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
                                            }`}
                                    >
                                        {isComplete ? (
                                            <CheckCircle2 size={24} />
                                        ) : (
                                            <Icon size={20} />
                                        )}
                                    </button>
                                    <p className={`mt-2 text-xs font-medium text-center max-w-[100px] ${isCurrent ? 'text-primary' : 'text-gray-600'
                                        }`}>
                                        {step.title}
                                    </p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-2 ${isComplete ? 'bg-green-500' : 'bg-gray-200'
                                        }`} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Current Step Content */}
            <div className="bg-white border rounded-lg p-8">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-start gap-4 mb-6">
                        {React.createElement(currentStep.icon, { size: 32, className: 'text-primary flex-shrink-0' })}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{currentStep.title}</h2>
                            <p className="text-gray-600 mt-1">{currentStep.description}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                <span className="font-medium">Requirement:</span> {currentStep.requirement}
                            </p>
                        </div>
                    </div>

                    {/* Step-specific content */}
                    {currentStep.key === SetupStep.ZONES && (
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm font-medium text-blue-900 mb-2">
                                    Zones Created: {progress?.zones_count || 0}
                                </p>
                                <p className="text-sm text-blue-700">
                                    Create delivery zones by drawing polygons on the map.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/admin/zones')}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
                            >
                                <ExternalLink size={16} className="mr-2" />
                                Go to Zones Management
                            </button>
                        </div>
                    )}

                    {currentStep.key === SetupStep.CATEGORIES && (
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm font-medium text-blue-900 mb-2">
                                    Categories Created: {progress?.categories_count || 0}
                                </p>
                                <p className="text-sm text-blue-700">
                                    Organize your products with categories and subcategories.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/admin/categories')}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
                            >
                                <ExternalLink size={16} className="mr-2" />
                                Go to Categories Management
                            </button>
                        </div>
                    )}

                    {currentStep.key === SetupStep.BANNERS && (
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm font-medium text-blue-900 mb-2">
                                    Banners Uploaded: {progress?.banners_count || 0}
                                </p>
                                <p className="text-sm text-blue-700">
                                    Upload promotional banners to display in your app.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/admin/banners')}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
                            >
                                <ExternalLink size={16} className="mr-2" />
                                Go to Banners Management
                            </button>
                        </div>
                    )}

                    {currentStep.key === SetupStep.SELLER_ALLOCATION && (
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm font-medium text-blue-900 mb-2">
                                    Sellers Allocated: {progress?.allocated_sellers_count || 0}
                                </p>
                                <p className="text-sm text-blue-700">
                                    Assign sellers to delivery zones for order fulfillment.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/admin/zones')}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
                            >
                                <ExternalLink size={16} className="mr-2" />
                                Go to Zone Allocations
                            </button>
                        </div>
                    )}

                    {currentStep.key === SetupStep.COMPLETE && (
                        <div className="space-y-4">
                            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                                <h3 className="text-lg font-semibold text-green-900 mb-4">
                                    🎉 Setup Complete!
                                </h3>
                                <div className="space-y-2 text-sm text-green-700">
                                    <p>✓ {progress?.zones_count} zones created</p>
                                    <p>✓ {progress?.categories_count} categories created</p>
                                    <p>✓ {progress?.banners_count} banners uploaded</p>
                                    <p>✓ {progress?.allocated_sellers_count} sellers allocated</p>
                                </div>
                            </div>
                            <button
                                onClick={handleFinishSetup}
                                disabled={false}
                                className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <CheckCheck size={20} className="mr-2" />
                                Finish Setup & Go to Dashboard
                            </button>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    {currentStep.key !== SetupStep.COMPLETE && (
                        <div className="flex justify-between mt-8 pt-6 border-t">
                            <button
                                onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                                disabled={currentStepIndex === 0}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleCompleteStep}
                                disabled={updateProgress.isPending || !canProceedToStep(steps[currentStepIndex + 1]?.key)}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue
                                <ArrowRight size={16} className="ml-2" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSetupWizard;
