'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { MetaLeadsClient, MetaLeadGenForm, MetaLead } from '@/shared/lib/meta-leads-client';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { AlertCircle, CheckCircle2, Download, RefreshCw } from 'lucide-react';

/**
 * Componente de exemplo para visualizar e sincronizar leads do Meta
 *
 * Como usar:
 * 1. Importe este componente em uma página
 * 2. Certifique-se que o usuário já conectou sua conta Meta
 * 3. Os formulários e leads serão exibidos automaticamente
 *
 * Exemplo:
 * import { MetaLeadsViewer } from '@/features/dashboard/components/meta-leads-viewer';
 *
 * <MetaLeadsViewer />
 */
export function MetaLeadsViewer() {
  const [selectedFormId, setSelectedFormId] = useState<string>('');
  const client = new MetaLeadsClient();

  // Query para buscar formulários
  const {
    data: forms,
    isLoading: isLoadingForms,
    error: formsError,
    refetch: refetchForms,
  } = useQuery({
    queryKey: ['meta-leadgen-forms'],
    queryFn: () => client.getLeadGenForms(),
    enabled: client.isConnected(),
    retry: 1,
  });

  // Query para buscar leads do formulário selecionado
  const {
    data: leads,
    isLoading: isLoadingLeads,
    error: leadsError,
    refetch: refetchLeads,
  } = useQuery({
    queryKey: ['meta-leads', selectedFormId],
    queryFn: () => client.getLeadsFromForm(selectedFormId),
    enabled: client.isConnected() && !!selectedFormId,
    retry: 1,
  });

  if (!client.isConnected()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meta Lead Ads</CardTitle>
          <CardDescription>Visualize e sincronize seus leads do Facebook/Instagram</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Você precisa conectar sua conta Meta Ads primeiro. Vá em Perfil {'>'} Sincronização {'>'} Meta Leads
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Card de Formulários */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Formulários de Lead</CardTitle>
              <CardDescription>Selecione um formulário para ver os leads</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetchForms()} disabled={isLoadingForms}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingForms ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {formsError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Erro ao carregar formulários: {(formsError as Error).message}</AlertDescription>
            </Alert>
          )}

          {isLoadingForms ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : forms && forms.length > 0 ? (
            <div className="space-y-2">
              {forms.map((form: MetaLeadGenForm) => (
                <button
                  key={form.id}
                  onClick={() => setSelectedFormId(form.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedFormId === form.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{form.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Status: {form.status} • {form.leads_count || 0} leads
                      </p>
                    </div>
                    {selectedFormId === form.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Nenhum formulário de lead encontrado.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Card de Leads */}
      {selectedFormId && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Leads do Formulário</CardTitle>
                <CardDescription>{leads ? `${leads.length} leads encontrados` : 'Carregando leads...'}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => refetchLeads()} disabled={isLoadingLeads}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingLeads ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    // TODO: Implementar sincronização com backend
                    alert('Funcionalidade de sincronização será implementada');
                  }}
                  disabled={!leads || leads.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Sincronizar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {leadsError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Erro ao carregar leads: {(leadsError as Error).message}</AlertDescription>
              </Alert>
            )}

            {isLoadingLeads ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : leads && leads.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {leads.map((lead: MetaLead) => {
                  const formattedLead = client.formatLeadForCRM(lead);
                  return (
                    <div key={lead.id} className="p-4 rounded-lg border border-border hover:bg-accent">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">{formattedLead.name || 'Nome não informado'}</p>
                          {formattedLead.email && (
                            <p className="text-sm text-muted-foreground">{formattedLead.email}</p>
                          )}
                          {formattedLead.phone && (
                            <p className="text-sm text-muted-foreground">{formattedLead.phone}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {new Date(lead.created_time).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Nenhum lead encontrado neste formulário.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
