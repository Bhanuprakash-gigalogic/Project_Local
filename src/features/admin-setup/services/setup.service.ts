import { SetupState, SetupStatus, SetupStep, SetupStepPayload } from '../types/setup';

// Mock initial state
const INITIAL_STATE: SetupState = {
    currentStep: SetupStep.ZONES,
    status: SetupStatus.NOT_STARTED,
    lastUpdated: new Date().toISOString(),
    completedSteps: [],
    data: {
        zones: false,
        stores: false,
        sellers: false,
        categories: false,
        banners: false
    }
};

// Simulate backend persistence
let mockDbState: SetupState = { ...INITIAL_STATE };

export const setupService = {
    async getStatus(): Promise<SetupState> {
        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 500));
        return { ...mockDbState };
    },

    async updateStep(payload: SetupStepPayload): Promise<SetupState> {
        await new Promise(resolve => setTimeout(resolve, 800));

        // Update completion status
        if (!mockDbState.completedSteps.includes(payload.step)) {
            mockDbState.completedSteps.push(payload.step);
        }

        mockDbState.status = SetupStatus.IN_PROGRESS;
        mockDbState.lastUpdated = new Date().toISOString();

        // Determine next step
        switch (payload.step) {
            case SetupStep.ZONES:
                mockDbState.currentStep = SetupStep.STORES;
                mockDbState.data.zones = true;
                break;
            case SetupStep.STORES:
                mockDbState.currentStep = SetupStep.SELLERS;
                mockDbState.data.stores = true;
                break;
            case SetupStep.SELLERS:
                mockDbState.currentStep = SetupStep.CATEGORIES;
                mockDbState.data.sellers = true;
                break;
            case SetupStep.CATEGORIES:
                mockDbState.currentStep = SetupStep.BANNERS;
                mockDbState.data.categories = true;
                break;
            case SetupStep.BANNERS:
                mockDbState.currentStep = SetupStep.COMPLETE;
                mockDbState.data.banners = true;
                break;
        }

        return { ...mockDbState };
    },

    async completeWizard(): Promise<SetupState> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        mockDbState.status = SetupStatus.COMPLETED;
        mockDbState.currentStep = SetupStep.COMPLETE;
        return { ...mockDbState };
    },

    // For manual debugging/reset
    reset() {
        mockDbState = { ...INITIAL_STATE };
    }
};
