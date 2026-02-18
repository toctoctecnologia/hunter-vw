import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AgendaErrorBoundaryProps {
  children: React.ReactNode;
}

interface AgendaErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface AgendaErrorBoundaryInnerProps extends AgendaErrorBoundaryProps {
  onBack: () => void;
  onRetry: () => void;
  resetKey: number;
}

class AgendaErrorBoundaryInner extends React.Component<
  AgendaErrorBoundaryInnerProps,
  AgendaErrorBoundaryState
> {
  state: AgendaErrorBoundaryState = {
    hasError: false,
    error: undefined
  };

  static getDerivedStateFromError(error: Error): AgendaErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[AgendaErrorBoundary] runtime error', error, info);
  }

  componentDidUpdate(prevProps: AgendaErrorBoundaryInnerProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ hasError: false, error: undefined });
    }
  }

  render() {
    const { hasError, error } = this.state;
    const { children, onBack, onRetry } = this.props;

    if (!hasError) {
      return children;
    }

    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-200">
            <span className="text-2xl">📅</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Não foi possível carregar a agenda.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tivemos um problema ao montar a sua agenda. Tente novamente ou volte para a home.
          </p>
          {import.meta.env.DEV && error && (
            <details className="mt-4 rounded-lg border border-dashed border-border bg-muted/40 p-4 text-left text-xs text-muted-foreground">
              <summary className="cursor-pointer text-sm font-medium text-foreground">
                Detalhes técnicos
              </summary>
              <pre className="mt-2 whitespace-pre-wrap break-words">
                {error.message}
              </pre>
            </details>
          )}
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-10 items-center justify-center rounded-full bg-orange-500 px-5 text-sm font-semibold text-white shadow transition hover:bg-orange-600"
            >
              Tentar novamente
            </button>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-transparent px-5 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Voltar para Home
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export const AgendaErrorBoundary = ({ children }: AgendaErrorBoundaryProps) => {
  const navigate = useNavigate();
  const [resetKey, setResetKey] = React.useState(0);

  const handleRetry = () => {
    setResetKey(prev => prev + 1);
  };

  return (
    <AgendaErrorBoundaryInner
      resetKey={resetKey}
      onRetry={handleRetry}
      onBack={() => navigate('/')}
    >
      <div key={resetKey}>{children}</div>
    </AgendaErrorBoundaryInner>
  );
};
