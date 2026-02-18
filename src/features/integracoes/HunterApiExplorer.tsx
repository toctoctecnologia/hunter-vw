import { useMemo, useState } from 'react';
import { ArrowUpRight, Copy, ExternalLink, Lock, Shield, Zap } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { hunterApiMeta, hunterApiSections, type ApiHttpMethod } from '@/data/hunterApiDocs';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

const methodStyles: Record<ApiHttpMethod, string> = {
  GET: 'bg-sky-100 text-sky-900 border border-sky-200',
  POST: 'bg-emerald-100 text-emerald-900 border border-emerald-200',
  PUT: 'bg-amber-100 text-amber-900 border border-amber-200',
  PATCH: 'bg-indigo-100 text-indigo-900 border border-indigo-200',
  DELETE: 'bg-rose-100 text-rose-900 border border-rose-200',
};

function MethodBadge({ method }: { method: ApiHttpMethod }) {
  return (
    <span
      className={cn(
        'rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        methodStyles[method],
      )}
    >
      {method}
    </span>
  );
}

function EndpointRow({
  method,
  path,
  description,
  authRequired = true,
}: {
  method: ApiHttpMethod;
  path: string;
  description: string;
  authRequired?: boolean;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border bg-slate-50/70 px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
      <MethodBadge method={method} />
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <code className="text-sm font-semibold text-slate-800">{hunterApiMeta.basePath + path}</code>
          {authRequired && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-medium uppercase text-slate-700">
              <Lock className="h-3 w-3" /> HMAC-SHA256
            </span>
          )}
        </div>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-800">
        <ArrowUpRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function HunterApiExplorer() {
  const [serverUrl, setServerUrl] = useState(hunterApiMeta.servers[0].url);
  const [filter, setFilter] = useState('');
  const swaggerUrl = `${serverUrl}${hunterApiMeta.swaggerPath}`;

  const filteredSections = useMemo(() => {
    if (!filter) return hunterApiSections;
    const term = filter.toLowerCase();
    return hunterApiSections
      .map(section => ({
        ...section,
        operations: section.operations.filter(
          op =>
            section.title.toLowerCase().includes(term) ||
            op.path.toLowerCase().includes(term) ||
            op.description.toLowerCase().includes(term),
        ),
      }))
      .filter(section => section.operations.length > 0);
  }, [filter]);

  const totalOperations = useMemo(
    () => hunterApiSections.reduce((acc, section) => acc + section.operations.length, 0),
    [],
  );

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText('api_key_hunter_xxxxxxxxx');
      toast({
        title: 'Chave copiada',
        description: 'Cole a chave no header Authorization: Bearer {token}.',
      });
    } catch (error) {
      toast({
        title: 'Não foi possível copiar',
        description:
          error instanceof Error ? error.message : 'Copie manualmente a chave exibida no painel.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm">
        <div className="flex flex-col gap-4 p-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
              API · Gestão de API
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">{hunterApiMeta.title}</h2>
              <Badge variant="secondary" className="text-xs">
                v{hunterApiMeta.version}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {hunterApiMeta.spec}
              </Badge>
            </div>
            <p className="max-w-2xl text-sm text-slate-600">
              Todas as APIs oficiais do Hunter CRM, com autenticação HMAC-SHA256 e melhores
              práticas de versionamento. Use a base de produção ou sandbox e acompanhe logs em
              tempo real.
            </p>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Base path {serverUrl}
              {hunterApiMeta.basePath}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:w-80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-600">Ambiente (Prod / Sandbox)</label>
              <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                {serverUrl.includes('sandbox') ? 'Sandbox' : 'Produção'}
              </Badge>
            </div>
            <Select value={serverUrl} onValueChange={value => setServerUrl(value)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecione o ambiente" />
              </SelectTrigger>
              <SelectContent>
                {hunterApiMeta.servers.map(server => (
                  <SelectItem key={server.url} value={server.url}>
                    {server.name} · {server.url}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="justify-between"
              onClick={handleCopyKey}
              type="button"
            >
              Chave API Hunter
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="orange"
              className="justify-between"
              type="button"
              onClick={() => window.open(swaggerUrl, '_blank', 'noopener,noreferrer')}
            >
              Abrir swagger
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid gap-4 border-t border-slate-100 bg-slate-50 px-6 py-4 md:grid-cols-3">
          <div className="flex items-start gap-2">
            <Shield className="mt-0.5 h-4 w-4 text-orange-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Segurança pronta</p>
              <p className="text-xs text-slate-600">
                Autenticação por header <code>Authorization</code> + assinatura HMAC-SHA256 em cada
                requisição.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Zap className="mt-0.5 h-4 w-4 text-orange-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Monitoramento</p>
              <p className="text-xs text-slate-600">
                Logs em tempo real, testes de webhook e rotação automática de secrets.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <ArrowUpRight className="mt-0.5 h-4 w-4 text-orange-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Melhores práticas</p>
              <p className="text-xs text-slate-600">
                Versionamento estável, paginação padrão e idempotência para POST sensíveis.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-600">
              Catálogo
            </p>
            <h3 className="text-xl font-semibold text-slate-900">API Hunter · todas as abas</h3>
            <p className="text-sm text-slate-600">
              GET e POST completos para Home, Negociações, Agenda, Tarefas, Imóveis, Gestão de
              Imóveis, Aluguéis, Contratos, Faturas, Repasses, Análises, Regras de cobrança,
              Indicadores de Leads, Dashboard, Campanhas, Listas de Lead, Filtros, Usuários,
              Distribuição, Gestão de API, Gestão de roletão, Gestão de relatórios, Automação,
              Gestão de acesso e Pagamentos.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
              {filteredSections.length} seções
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
              {totalOperations} endpoints
            </Badge>
          </div>
        </div>
        <div className="border-t border-slate-100 bg-slate-50/60 p-4">
          <Input
            value={filter}
            onChange={event => setFilter(event.target.value)}
            placeholder="Buscar por rota, descrição ou módulo..."
            className="max-w-2xl"
          />
        </div>
        <Accordion type="multiple" className="divide-y divide-slate-100">
          {filteredSections.map(section => (
            <AccordionItem key={section.id} value={section.id} className="px-6">
              <AccordionTrigger className="py-5 hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    {section.title.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{section.title}</p>
                    <p className="text-xs text-slate-600">{section.description}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-3">
                  {section.operations.map(operation => (
                    <EndpointRow
                      key={`${section.id}-${operation.path}-${operation.method}`}
                      method={operation.method}
                      path={operation.path}
                      description={operation.description}
                      authRequired={operation.authRequired}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
}
