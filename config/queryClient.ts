
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Dados considerados frescos por 5 minutos
      gcTime: 1000 * 60 * 30, // Cache mantido por 30 minutos
      refetchOnWindowFocus: false, // Evita refetch agressivo ao mudar de aba
      retry: 1,
    },
  },
});
