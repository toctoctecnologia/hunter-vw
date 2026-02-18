import { useNavigate } from 'react-router-dom';
import { GestaoTab } from '@/components/home/GestaoTab';
import DesktopLayout from '@/components/shell/DesktopLayout';
import DesktopHeader from '@/components/shell/DesktopHeader';

export default function DesktopGestao() {
  const navigate = useNavigate();

  const handleNavigateToTab = (tab: string) => {
    if (tab === 'captacoes') navigate('/captacoes');
    else if (tab === 'vendas') navigate('/vendas');
  };

  return (
    <DesktopLayout activeTab="gestao">
      <DesktopHeader />
      <GestaoTab onNavigateToTab={handleNavigateToTab} />
    </DesktopLayout>
  );
}
