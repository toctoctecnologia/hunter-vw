import { useNavigate } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout';
import { NovaAcaoWizard } from '@/features/distribuicao/acoes/components/NovaAcaoWizard';

export default function AcaoCheckinNovaPage() {
  const navigate = useNavigate();

  const handleMainTabChange = (tab: string) => {
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'vendas':
        navigate('/vendas');
        break;
      case 'agenda':
        navigate('/agenda');
        break;
      case 'imoveis':
        navigate('/imoveis');
        break;
      case 'usuarios':
        navigate('/usuarios');
        break;
      case 'distribuicao':
        navigate('/distribuicao');
        break;
      default:
        break;
    }
  };

  return (
    <ResponsiveLayout activeTab="distribuicao" setActiveTab={handleMainTabChange}>
      <div className="mx-auto w-full max-w-5xl p-4">
        <NovaAcaoWizard onCancel={() => navigate('/distribuicao/acoes')} onCompleted={acaoId => navigate(`/distribuicao/acoes/${acaoId}`)} />
      </div>
    </ResponsiveLayout>
  );
}
