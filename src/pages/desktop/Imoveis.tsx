import { ImoveisTab } from '@/components/imoveis/ImoveisTab';
import DesktopLayout from '@/components/shell/DesktopLayout';
import DesktopHeader from '@/components/shell/DesktopHeader';
import { useState } from 'react';

export default function DesktopImoveis() {
  const [activeTab, setActiveTab] = useState('imoveis');
  return (
    <DesktopLayout activeTab="imoveis">
      <DesktopHeader />
      <ImoveisTab activeTab={activeTab} onTabChange={setActiveTab} />
    </DesktopLayout>
  );
}
