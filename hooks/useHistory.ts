
import { useState, useEffect } from 'react';
import { getHistory, addHistoryItem, deleteHistoryItems, clearAllHistory } from '../repositories/historyRepository';
import { HistoryItem } from '../models/History';
import { PromptMode } from '../models/Prompt';
import type { User } from '@supabase/supabase-js';

export const useHistory = (user: User | null) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryIds, setSelectedHistoryIds] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      getHistory(user.id).then(setHistory);
    } else {
      setHistory([]);
    }
  }, [user]);

  const addToHistory = async (userInput: string, structuredPrompt: string, mode: PromptMode) => {
      if (!user) return;
      const newItemData = { userInput, structuredPrompt, mode };
      const newHistoryItem = await addHistoryItem(user.id, newItemData);
      if (newHistoryItem) {
        setHistory(prev => [newHistoryItem, ...prev]);
      }
  };

  const clearHistory = async () => {
    if (!user) return;
    await clearAllHistory(user.id);
    setHistory([]);
    setSelectedHistoryIds([]);
  };
  
  const deleteHistoryItem = async (id: string) => {
    if (!user) return;
    await deleteHistoryItems(user.id, [id]);
    setHistory(prev => prev.filter(item => item.id !== id));
    setSelectedHistoryIds(prev => prev.filter(selectedId => selectedId !== id));
  };
  
  const deleteSelectedHistory = async () => {
    if (!user || selectedHistoryIds.length === 0) return;
    await deleteHistoryItems(user.id, selectedHistoryIds);
    setHistory(prev => prev.filter(item => !selectedHistoryIds.includes(item.id)));
    setSelectedHistoryIds([]);
  };

  const toggleHistorySelection = (id: string) => {
    setSelectedHistoryIds(prev => 
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const getCombinedHistoryText = () => {
    if (selectedHistoryIds.length === 0) return '';
    const selectedItems = history
      .filter(item => selectedHistoryIds.includes(item.id))
      .sort((a, b) => a.timestamp - b.timestamp);
    
    return selectedItems.map(item => item.userInput).join('\n\n---\n\n');
  };

  const clearSelection = () => setSelectedHistoryIds([]);

  return {
      history,
      selectedHistoryIds,
      addToHistory,
      clearHistory,
      deleteHistoryItem,
      deleteSelectedHistory,
      toggleHistorySelection,
      getCombinedHistoryText,
      clearSelection
  };
};
