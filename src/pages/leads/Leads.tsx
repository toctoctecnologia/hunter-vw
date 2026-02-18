
import React from 'react';
import { debugLog } from '@/utils/debug';
import { MobileLayout } from '@/components/shell/MobileLayout';
import { LeadsTab } from '@/components/vendas/LeadsTab';

export default function Leads() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full md:max-w-2xl" style={{ height: '640px' }}>
        <MobileLayout 
          activeTab="leads" 
          setActiveTab={() => {}} // Navigation handled by router
          onAddClick={() => debugLog('Add clicked')}
        >
          <LeadsTab />
        </MobileLayout>
      </div>
    </div>
  );
}
