
import React from 'react';
import { debugLog } from '@/utils/debug';
import { MobileLayout } from '@/components/shell/MobileLayout';
import { GestaoTab } from '@/components/home/GestaoTab';
import MobilePage from '@/components/shell/MobilePage';

export default function Gestao() {
  const handleNavigateToTab = (tab: string, filter?: any) => {
    // Navigation will be handled by React Router
    debugLog('Navigate to:', tab, filter);
  };

  return (
    <MobilePage>
      <MobileLayout
        activeTab="gestao"
        setActiveTab={() => {}}
        onAddClick={() => debugLog('Add clicked')}
      >
        <GestaoTab onNavigateToTab={handleNavigateToTab} />
      </MobileLayout>
    </MobilePage>
  );
}
