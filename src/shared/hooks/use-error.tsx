import { createContext, useContext, useEffect, useState } from 'react';

import { errorEmitter } from '@/shared/lib/errorEmitter';
import { AppError } from '@/shared/lib/api';

import { ErrorModal } from '@/shared/components/modal/error-modal';

interface ErrorContextData {
  showError: (error: AppError) => void;
}

const ErrorContext = createContext({} as ErrorContextData);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<AppError | null>(null);

  function showError(error: AppError) {
    const isProposal = error.messages.some((message) => message.includes('proposal'));
    console.log('isProposal', isProposal);
    if (!isProposal) {
      setError(error);
    }
  }

  useEffect(() => {
    errorEmitter.on(showError);
  }, []);

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}

      {error && <ErrorModal open title={error.title} messages={error.messages} onClose={() => setError(null)} />}
    </ErrorContext.Provider>
  );
}

export function useError() {
  return useContext(ErrorContext);
}
