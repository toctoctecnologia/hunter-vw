import React from 'react';
import { Button } from '@/components/ui/button';

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
}

export class RouteErrorBoundary extends React.Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  state: RouteErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RouteErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('RouteErrorBoundary caught an error', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center p-6">
          <div className="max-w-md space-y-3 rounded-2xl border border-[var(--ui-stroke)] bg-[var(--ui-card)] p-6 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--ui-text)]">{this.props.title ?? 'Algo saiu do esperado'}</h2>
            <p className="text-sm text-[var(--ui-text-subtle)]">
              {this.props.description ?? 'Não foi possível carregar esta seção. Tente novamente.'}
            </p>
            <Button className="rounded-xl" onClick={this.handleRetry}>Tentar novamente</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;
