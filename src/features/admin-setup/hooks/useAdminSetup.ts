import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { setupService } from '../services/setup.service';
import { UpdateSetupProgressDTO } from '../types/setup';

export const useAdminSetup = () => {
    const queryClient = useQueryClient();

    const statusQuery = useQuery({
        queryKey: ['admin-setup-status'],
        queryFn: () => setupService.getStatus(),
    });

    const updateStep = useMutation({
        mutationFn: (payload: UpdateSetupProgressDTO) => setupService.updateStep(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-setup-status'] });
        }
    });

    const completeSetup = useMutation({
        mutationFn: () => setupService.completeWizard(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-setup-status'] });
        }
    });

    return {
        setupState: statusQuery.data,
        isLoading: statusQuery.isLoading,
        updateStep,
        completeSetup
    };
};
