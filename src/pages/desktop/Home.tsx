import { useNavigate } from 'react-router-dom';
import { HomeTab } from '@/components/home/HomeTab';
import DesktopLayout from '@/components/shell/DesktopLayout';
import DesktopHeader from '@/components/shell/DesktopHeader';

export default function DesktopHome() {
  const navigate = useNavigate();

  const handleNavigateToTab = (tab: string) => {
    switch (tab) {
      case 'gestao':
        navigate('/indicadores');
        break;
      case 'agenda':
        navigate('/agenda');
        break;
      case 'imoveis':
        navigate('/imoveis');
        break;
      case 'vendas':
        navigate('/vendas');
        break;
      case 'servicos':
        navigate('/servicos');
        break;
      default:
        break;
    }
  };

  return (
    <DesktopLayout activeTab="home">
      <DesktopHeader />
      <HomeTab onNavigateToTab={handleNavigateToTab} />
    </DesktopLayout>
  );
}
