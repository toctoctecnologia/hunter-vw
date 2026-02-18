
import React from 'react';
import { MobileLayout } from '@/components/shell/MobileLayout';
import MobilePage from '@/components/shell/MobilePage';
import DashboardModular from '@/components/dashboard-modular/DashboardModular';
import { HOME_ALUGUEIS_UNIFIED_WIDGETS } from '@/components/dashboard-modular/widgets';

export default function Home() {
  return (
    <MobilePage>
      <MobileLayout
        activeTab="home"
        setActiveTab={() => {}}
        onAddClick={() => {}}
        title="Home de Gestão de Aluguéis"
      >
        <div className="p-6">
          <DashboardModular
            context="alugueis"
            title="Home de Gestão de Aluguéis"
            widgets={HOME_ALUGUEIS_UNIFIED_WIDGETS}
          />
        </div>
      </MobileLayout>
    </MobilePage>
  );
}
