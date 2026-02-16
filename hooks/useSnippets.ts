
import { useState, useEffect } from 'react';
import { getSnippets, addSnippet, deleteSnippet } from '../repositories/snippetRepository';
import { Snippet } from '../models/Snippet';
import type { User } from '@supabase/supabase-js';

export const useSnippets = (user: User | null) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  useEffect(() => {
    if (user) {
      getSnippets(user.id).then(setSnippets);
    } else {
      setSnippets([]);
    }
  }, [user]);

  const saveSnippet = async (title: string, content: string) => {
    if (!user) return;
    const newSnippet = await addSnippet(user.id, { title, content });
    if (newSnippet) {
        setSnippets(prev => [newSnippet, ...prev]);
    }
  };

  const removeSnippet = async (snippetId: string) => {
    if (!user) return;
    await deleteSnippet(user.id, snippetId);
    setSnippets(prev => prev.filter(s => s.id !== snippetId));
  };

  return {
      snippets,
      saveSnippet,
      removeSnippet
  };
};
