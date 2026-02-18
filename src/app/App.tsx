import React, { Suspense, lazy } from 'react';
import { debugLog } from '@/utils/debug';
import { useViewportMode } from '@/app/shared/hooks/useViewportMode';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const MobileApp = lazy(() => import('./mobile/MobileApp'));
const WebApp = lazy(() => import('./web/WebApp'));

function App() {
  const mode = useViewportMode();
  const Component = mode === 'mobile' ? MobileApp : WebApp;

  debugLog('App rendering, mode:', mode);

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">Loading...</div>
        }
      >
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
