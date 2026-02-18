import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import '@/styles/tokens-hs.css';
import { resolveHunterSitesData, HunterSitesOutletContext } from './data/demo';
import { Sidebar, defaultSidebarItems } from './components/Sidebar';
import AppLayout from '@/layouts/AppLayout';

export function HunterSitesLayout() {
  const context = useMemo<HunterSitesOutletContext>(() => resolveHunterSitesData(), []);

  return (
    <AppLayout initialActiveTab="huntersites">
      <div className="flex min-h-full">
        <Sidebar items={defaultSidebarItems} />
        <main className="flex-1 space-y-8 bg-background px-6 py-8">
          <Outlet context={context} />
        </main>
      </div>
    </AppLayout>
  );
}

export default HunterSitesLayout;
