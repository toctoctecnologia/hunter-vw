import { useNavigate, useParams } from 'react-router-dom';
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout';
import { AcaoDetalheView } from '@/features/distribuicao/acoes/components/AcaoDetalheView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AcaoCheckinDetalhePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

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
      <div className="mx-auto w-full max-w-6xl space-y-6 p-4">
        {!id ? (
          <Card>
            <CardHeader>
              <CardTitle>Ação não encontrada</CardTitle>
              <CardDescription>Selecione uma ação válida para visualizar os detalhes.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => navigate('/distribuicao/acoes')}>
                Voltar para ações
              </Button>
            </CardContent>
          </Card>
        ) : (
          <AcaoDetalheView acaoId={id} onVoltar={() => navigate('/distribuicao/acoes')} />
        )}
      </div>
    </ResponsiveLayout>
  );
}
