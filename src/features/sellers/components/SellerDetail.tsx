import React, { useState } from 'react';
import { SellerApplication } from '../types/seller';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from '@/components/ui/Modal';
import { ChevronLeft, FileText, CheckCircle, XCircle, Building, User, Info } from 'lucide-react';
import { useApproveSeller, useRejectSeller } from '../hooks/useSellerApprovals';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/ui/Input';

interface SellerDetailProps {
    application: SellerApplication;
    onBack: () => void;
}

export const SellerDetail = ({ application, onBack }: SellerDetailProps) => {
    const { mutate: approve, isPending: isApproving } = useApproveSeller();
    const { mutate: reject, isPending: isRejecting } = useRejectSeller();
    const { addToast } = useToast();

    // Confirm Modals
    const [confirmApproveOpen, setConfirmApproveOpen] = useState(false);
    const [confirmRejectOpen, setConfirmRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const handleApprove = () => {
        approve(application.id, {
            onSuccess: () => {
                addToast({ title: 'Application Approved', type: 'success', description: 'Seller is now active on the platform.' });
                setConfirmApproveOpen(false);
                onBack(); // Go back to list
            }
        });
    };

    const handleReject = () => {
        reject({ id: application.id, reason: rejectReason }, {
            onSuccess: () => {
                addToast({ title: 'Application Rejected', type: 'destructive', description: 'Seller has been notified.' });
                setConfirmRejectOpen(false);
                onBack();
            }
        });
    };

    const statusVariant =
        application.status === 'approved' ? 'success' :
            application.status === 'rejected' ? 'destructive' : 'warning';

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header / Nav */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{application.businessName}</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Application ID: {application.id}</span>
                        <span>•</span>
                        <span>Submitted: {new Date(application.submittedAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="ml-auto">
                    <Badge variant={statusVariant} className="text-sm px-3 py-1 capitalize">
                        {application.status}
                    </Badge>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Business Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5 text-primary" />
                                Business Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="min-w-0">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">Business Name</label>
                                    <p className="font-medium truncate">{application.businessName}</p>
                                </div>
                                <div className="min-w-0">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">Business Type</label>
                                    <p className="font-medium truncate">{application.businessType}</p>
                                </div>
                                <div className="min-w-0">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">Tax ID / Reg No</label>
                                    <p className="font-medium">XX-XXXXXXX</p>
                                </div>
                                <div className="min-w-0">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">Address</label>
                                    <p className="font-medium text-sm">
                                        {application.address.street}, {application.address.city}<br />
                                        {application.address.state}, {application.address.zip}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Applicant Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Applicant Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="min-w-0">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">Full Name</label>
                                    <p className="font-medium truncate">{application.applicantName}</p>
                                </div>
                                <div className="min-w-0">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">Email Address</label>
                                    <p className="font-medium truncate text-sm">{application.email}</p>
                                </div>
                                <div className="min-w-0">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">Phone Number</label>
                                    <p className="font-medium">{application.phone}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Documents & Actions */}
                <div className="space-y-6">
                    {/* Documents List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Documents
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {application.documents.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-secondary/50 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                                            <FileText size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{doc.name}</p>
                                            <p className="text-xs text-muted-foreground uppercase">{doc.type}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-xs h-7">View</Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Action Buttons (Only for Pending) */}
                    {application.status === 'pending' && (
                        <Card className="border-primary/20 bg-primary/5">
                            <CardContent className="p-6 space-y-3">
                                <h3 className="font-semibold text-center mb-4">Review Action</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant="outline"
                                        className="w-full border-destructive text-destructive hover:bg-destructive hover:text-white"
                                        onClick={() => setConfirmRejectOpen(true)}
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject
                                    </Button>
                                    <Button
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        onClick={() => setConfirmApproveOpen(true)}
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Approve
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {application.status === 'rejected' && (
                        <Card className="bg-destructive/10 border-destructive/20">
                            <CardContent className="p-4">
                                <h4 className="font-semibold text-destructive mb-1 flex items-center gap-2">
                                    <Info size={16} /> Rejection Reason
                                </h4>
                                <p className="text-sm text-destructive/80">
                                    {application.rejectionReason || "No reason provided."}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Confirmation Modals */}
            <Modal open={confirmApproveOpen} onOpenChange={setConfirmApproveOpen}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Approve Application?</ModalTitle>
                        <ModalDescription>
                            This will onboard <strong>{application.businessName}</strong> as a seller. They will receive an email to set up their shop.
                        </ModalDescription>
                    </ModalHeader>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setConfirmApproveOpen(false)}>Cancel</Button>
                        <Button onClick={handleApprove} isLoading={isApproving} className="bg-green-600 hover:bg-green-700">Confirm Approval</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal open={confirmRejectOpen} onOpenChange={setConfirmRejectOpen}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Reject Application</ModalTitle>
                        <ModalDescription>
                            Please provide a reason for rejecting this application. This will be sent to the applicant.
                        </ModalDescription>
                    </ModalHeader>
                    <div className="py-4">
                        <Input
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Reason for rejection..."
                        />
                    </div>
                    <ModalFooter>
                        <Button variant="outline" onClick={() => setConfirmRejectOpen(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            isLoading={isRejecting}
                            disabled={!rejectReason.trim()}
                        >
                            Reject Application
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </div>
    );
};
