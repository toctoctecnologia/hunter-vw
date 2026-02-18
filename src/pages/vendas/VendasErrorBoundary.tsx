import { ErrorBoundary } from 'react-error-boundary';
import type { ReactNode } from 'react';

interface VendasErrorBoundaryProps {
  children: ReactNode;
  fallback: (props: { reset: () => void }) => ReactNode;
}

export function VendasErrorBoundary({ children, fallback }: VendasErrorBoundaryProps) {
  return (
    <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => fallback({ reset: resetErrorBoundary })}>
      {children}
    </ErrorBoundary>
  );
}
