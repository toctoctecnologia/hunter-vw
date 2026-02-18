import { Outlet } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import { Sidebar } from './components/Sidebar';

export function HunterFinancasLayout() {
  return (
    <AppLayout initialActiveTab="financas">
      <div className="flex min-h-full">
        <Sidebar />
        <main className="flex-1 space-y-8 bg-background px-6 py-8">
          <Outlet />
        </main>
      </div>
    </AppLayout>
  );
}

export default HunterFinancasLayout;
