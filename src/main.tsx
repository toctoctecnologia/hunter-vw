import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/theme-provider';
import { initializeAccessControl } from '@/data/accessControl';
import { scheduleDailyRecomputation } from '@/services/healthService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute - avoid unnecessary refetches
      refetchOnWindowFocus: false,
    },
  },
});

initializeAccessControl();

// Defer heavy computation to after UI loads
setTimeout(() => {
  scheduleDailyRecomputation();
}, 3000);

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error(
    'Unable to find the root element. React application failed to mount.',
  );
} else {
  createRoot(rootElement).render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>,
  );
}
