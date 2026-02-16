
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHistory, addHistoryItem, deleteHistoryItems, clearAllHistory } from '../repositories/historyRepository';
import { PromptMode } from '../models/Prompt';
import { useAuth } from './useAuth';

export const useHistory = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedHistoryIds, setSelectedHistoryIds] = useState<string[]>([]);

  const historyQuery = useQuery({
    queryKey: ['history', user?.id],
    queryFn: () => getHistory(user!.id),
    enabled: !!user,
    initialData: [],
  });

  const addMutation = useMutation({
    mutationFn: (data: { userInput: string, structuredPrompt: string, mode: PromptMode }) => 
      addHistoryItem(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history', user?.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => deleteHistoryItems(user!.id, ids),
    onSuccess: (_, ids) => {
      queryClient.setQueryData(['history', user?.id], (old: any[]) => 
        old ? old.filter(item => !ids.includes(item.id)) : []
      );
      setSelectedHistoryIds(prev => prev.filter(id => !ids.includes(id)));
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: () => clearAllHistory(user!.id),
    onSuccess: () => {
      queryClient.setQueryData(['history', user?.id], []);
      setSelectedHistoryIds([]);
    },
  });

  const toggleHistorySelection = (id: string) => {
    setSelectedHistoryIds(prev => 
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const getCombinedHistoryText = () => {
    if (selectedHistoryIds.length === 0 || !historyQuery.data) return '';
    const selectedItems = historyQuery.data
      .filter(item => selectedHistoryIds.includes(item.id))
      .sort((a, b) => a.timestamp - b.timestamp);
    
    return selectedItems.map(item => item.userInput).join('\n\n---\n\n');
  };

  const clearSelection = () => setSelectedHistoryIds([]);

  return {
      history: historyQuery.data,
      isLoading: historyQuery.isLoading,
      selectedHistoryIds,
      addToHistory: (userInput: string, structuredPrompt: string, mode: PromptMode) => 
        addMutation.mutateAsync({ userInput, structuredPrompt, mode }),
      clearHistory: () => clearAllMutation.mutateAsync(),
      deleteHistoryItem: (id: string) => deleteMutation.mutateAsync([id]),
      deleteSelectedHistory: () => deleteMutation.mutateAsync(selectedHistoryIds),
      toggleHistorySelection,
      getCombinedHistoryText,
      clearSelection
  };
};
