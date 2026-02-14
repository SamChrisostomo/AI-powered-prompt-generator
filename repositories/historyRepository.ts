
import { supabase } from '../config/supabase';
import { HistoryItem } from '../models/History';

export const getHistory = async (userId: string): Promise<HistoryItem[]> => {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('PromptHistory')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .limit(50);

    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      userInput: item.userInput,
      structuredPrompt: item.structuredPrompt,
      timestamp: new Date(item.createdAt).getTime(),
      mode: item.mode,
    }));

  } catch (error) {
    console.error("Falha ao carregar o histórico do Supabase", error);
    return [];
  }
};

export const addHistoryItem = async (userId: string, item: Omit<HistoryItem, 'id' | 'timestamp'>): Promise<HistoryItem | null> => {
    if (!userId) return null;
    try {
        const { data, error } = await supabase
            .from('PromptHistory')
            .insert({
                userId,
                userInput: item.userInput,
                structuredPrompt: item.structuredPrompt,
                mode: item.mode,
            })
            .select()
            .single();

        if (error) throw error;
        
        return {
          id: data.id,
          userInput: data.userInput,
          structuredPrompt: data.structuredPrompt,
          timestamp: new Date(data.createdAt).getTime(),
          mode: data.mode,
        };
    } catch (error) {
        console.error("Falha ao salvar item no histórico do Supabase", error);
        return null;
    }
};

export const deleteHistoryItems = async (userId: string, ids: string[]): Promise<void> => {
    if (!userId || ids.length === 0) return;
    try {
        const { error } = await supabase
            .from('PromptHistory')
            .delete()
            .eq('userId', userId)
            .in('id', ids);

        if (error) throw error;
    } catch (error) {
        console.error("Falha ao deletar itens do histórico no Supabase", error);
    }
};

export const clearAllHistory = async (userId: string): Promise<void> => {
    if (!userId) return;
    try {
        const { error } = await supabase
            .from('PromptHistory')
            .delete()
            .eq('userId', userId);

        if (error) throw error;
    } catch (error) {
        console.error("Falha ao limpar todo o histórico no Supabase", error);
    }
};
