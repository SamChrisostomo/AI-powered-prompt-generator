
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSnippets, addSnippet, deleteSnippet } from '../repositories/snippetRepository';
import { useAuth } from './useAuth';

export const useSnippets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const snippetsQuery = useQuery({
    queryKey: ['snippets', user?.id],
    queryFn: () => getSnippets(user!.id),
    enabled: !!user,
    initialData: []
  });

  const addMutation = useMutation({
    mutationFn: (data: { title: string, content: string }) => 
        addSnippet(user!.id, data),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['snippets', user?.id] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (snippetId: string) => deleteSnippet(user!.id, snippetId),
    onSuccess: (_, snippetId) => {
        queryClient.setQueryData(['snippets', user?.id], (old: any[]) => 
            old ? old.filter(s => s.id !== snippetId) : []
        );
    }
  });

  return {
      snippets: snippetsQuery.data,
      isLoading: snippetsQuery.isLoading,
      saveSnippet: (title: string, content: string) => addMutation.mutateAsync({ title, content }),
      removeSnippet: (id: string) => deleteMutation.mutateAsync(id)
  };
};
