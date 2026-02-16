
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPresets, addPreset, deletePreset } from '../repositories/presetRepository';
import { useAuth } from './useAuth';
import { PromptMode, DetailLevel, OutputFormat } from '../models/Prompt';

export const usePresets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const presetsQuery = useQuery({
    queryKey: ['presets', user?.id],
    queryFn: () => getPresets(user!.id),
    enabled: !!user,
    initialData: []
  });

  const addMutation = useMutation({
    mutationFn: (data: { name: string, settings: any }) => 
        addPreset(user!.id, { name: data.name, ...data.settings }),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['presets', user?.id] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (presetId: string) => deletePreset(user!.id, presetId),
    onSuccess: (_, presetId) => {
        queryClient.setQueryData(['presets', user?.id], (old: any[]) => 
            old ? old.filter(p => p.id !== presetId) : []
        );
    }
  });

  const savePreset = async (
      name: string, 
      settings: {
        promptMode: PromptMode;
        detailLevel: DetailLevel;
        outputFormat: OutputFormat;
        includeComments: boolean;
        isAdvancedMode: boolean;
        temperature: number;
        topK: number;
      }
  ) => {
    return addMutation.mutateAsync({ name, settings });
  };

  const removePreset = async (presetId: string) => {
    return deleteMutation.mutateAsync(presetId);
  };

  const getPresetById = (presetId: string) => {
      return presetsQuery.data.find(p => p.id === presetId);
  }

  return {
      presets: presetsQuery.data,
      isLoading: presetsQuery.isLoading,
      savePreset,
      removePreset,
      getPresetById
  };
};
