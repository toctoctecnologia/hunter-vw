import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { errorEmitter } from '@/shared/lib/errorEmitter';
import { AppError } from '@/shared/lib/api';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any) => {
      errorEmitter.emit(error as AppError);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      errorEmitter.emit(error as AppError);
    },
  }),
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
