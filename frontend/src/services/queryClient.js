import { QueryClient } from '@tanstack/react-query'

// Instance unique du QueryClient — le "cache central" de TanStack Query
// On le crée en dehors des composants pour qu'il ne soit jamais recréé
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // les données sont "fraîches" pendant 5 minutes
      retry: 1,                  // en cas d'erreur, on réessaie 1 fois maximum
    },
  },
})

export default queryClient
