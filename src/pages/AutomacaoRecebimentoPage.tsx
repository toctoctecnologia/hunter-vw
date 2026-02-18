import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Filter, ShieldCheck, Sparkles } from 'lucide-react';
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout';
import PageContainer from '@/components/ui/page-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

function AutomacaoRecebimentoPage() {
  const navigate = useNavigate();
  const [receberLeadsAtivo, setReceberLeadsAtivo] = useState(true);
  const [pegarRoletaoAtivo, setPegarRoletaoAtivo] = useState(true);
  const [priorizarFila, setPriorizarFila] = useState(true);

  const handleMainTabChange = (tab: string) => {
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'vendas':
        navigate('/vendas');
        break;
      case 'gestao-api':
        navigate('/gestao-api');
        break;
      case 'gestao-roletao':
        navigate('/gestao-roletao');
        break;
      case 'gestao-relatorios':
        navigate('/gestao-relatorios');
        break;
      case 'automacoes':
        navigate('/automacoes');
        break;
      case 'gestao-acessos':
        navigate('/gestao-acessos');
        break;
      default:
        break;
    }
  };

  return (
    <ResponsiveLayout activeTab="automacoes" setActiveTab={handleMainTabChange}>
      <PageContainer className="py-6 space-y-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Button variant="ghost" size="sm" className="-ml-2 text-orange-600" onClick={() => navigate('/automacoes')}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Voltar
            </Button>
            <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">
              Automação de recebimento
            </Badge>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurar automação de recebimento</h1>
            <p className="text-sm text-gray-600">
              Habilite o recebimento automático e defina como os leads serão distribuídos entre corretores e filas.
            </p>
          </div>
        </div>

        <Card className="border-orange-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
              <Sparkles className="h-5 w-5 text-orange-500" />
              Regras gerais
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Ative ou pause o fluxo. As alterações entram em vigor imediatamente para todos os usuários elegíveis.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">Receber leads automaticamente</p>
                    <p className="text-sm text-gray-600">Distribuição contínua para quem está apto a receber.</p>
                  </div>
                  <Switch
                    checked={receberLeadsAtivo}
                    onCheckedChange={setReceberLeadsAtivo}
                    aria-label="Alternar recebimento automático"
                  />
                </div>
                <Badge className="mt-3 w-fit bg-white text-orange-700" variant="outline">
                  {receberLeadsAtivo ? 'Fluxo ativo' : 'Fluxo pausado'}
                </Badge>
              </div>

              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">Pegar leads do roletão</p>
                    <p className="text-sm text-gray-600">Alimenta a fila com leads prontos para contato.</p>
                  </div>
                  <Switch
                    checked={pegarRoletaoAtivo}
                    onCheckedChange={setPegarRoletaoAtivo}
                    aria-label="Alternar captação do roletão"
                  />
                </div>
                <Badge className="mt-3 w-fit bg-white text-orange-700" variant="outline">
                  {pegarRoletaoAtivo ? 'Roletão sincronizado' : 'Roletão pausado'}
                </Badge>
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50/70 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-orange-800">
                <CheckCircle2 className="h-4 w-4" />
                Status geral
              </div>
              <p className="mt-1 text-sm text-orange-800">
                Com o recebimento ativo, os corretores recebem leads automaticamente respeitando fila, prioridade e próximos checkpoints.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Distribuição e filtros</CardTitle>
              <p className="text-sm text-muted-foreground">
                Ajuste prioridades, defina quem recebe primeiro e aplique filtros rápidos.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">Priorizar fila atual</p>
                  <p className="text-sm text-gray-600">Envie primeiro para quem está em espera antes do roletão.</p>
                </div>
                <Switch checked={priorizarFila} onCheckedChange={setPriorizarFila} aria-label="Priorizar fila atual" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="segmento">Segmento preferencial</Label>
                  <Input id="segmento" placeholder="Imóveis prontos ou em obra" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tamanho">Tamanho máximo da carteira</Label>
                  <Input id="tamanho" placeholder="Ex.: 50 leads por corretor" />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span>Filtros aplicados mantêm o funil alinhado com a estratégia atual.</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                <Filter className="h-5 w-5 text-orange-500" />
                Checkpoints e alertas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[{
                title: 'Próximo checkpoint',
                description: 'Validação em 30 de agosto às 10:00',
              },
              {
                title: 'Alerta de fila',
                description: 'Notificar quando houver mais de 50 leads aguardando',
              }].map(item => (
                <div key={item.title} className="rounded-lg border border-gray-100 p-3">
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
              <Button className="w-full bg-orange-600 text-white hover:bg-orange-700">Salvar alterações</Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </ResponsiveLayout>
  );
}

export default AutomacaoRecebimentoPage;
