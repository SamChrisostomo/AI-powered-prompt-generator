
import { supabase } from '../config/supabase';
import { Snippet } from '../models/Snippet';

type SnippetData = Omit<Snippet, 'id'>;

export const getSnippets = async (userId: string): Promise<Snippet[]> => {
    if (!userId) return [];
    try {
        const { data, error } = await supabase
            .from('UserSnippets')
            .select('*')
            .eq('userId', userId)
            .order('createdAt', { ascending: false });

        if (error) throw error;

        return data.map(item => ({
            id: item.id,
            title: item.title,
            content: item.content,
        }));
    } catch (error) {
        console.error("Falha ao carregar snippets do Supabase", error);
        return [];
    }
};

export const addSnippet = async (userId: string, snippet: SnippetData): Promise<Snippet | null> => {
    if (!userId) return null;
    try {
        const { data, error } = await supabase
            .from('UserSnippets')
            .insert({ userId, ...snippet })
            .select()
            .single();

        if (error) throw error;
        
        return {
            id: data.id,
            title: data.title,
            content: data.content,
        };
    } catch (error) {
        console.error("Falha ao salvar snippet no Supabase", error);
        return null;
    }
};

export const deleteSnippet = async (userId: string, snippetId: string): Promise<void> => {
    if (!userId || !snippetId) return;
    try {
        const { error } = await supabase
            .from('UserSnippets')
            .delete()
            .eq('userId', userId)
            .eq('id', snippetId);

        if (error) throw error;
    } catch (error) {
        console.error("Falha ao deletar snippet no Supabase", error);
    }
};
