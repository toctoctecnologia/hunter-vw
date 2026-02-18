import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import MobilePage from '@/components/shell/MobilePage';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MediaUploadSection } from '@/components/imoveis/atualizar-imovel/MediaUploadSection';
import { StatusSituacaoSection } from '@/components/imoveis/atualizar-imovel/StatusSituacaoSection';
import { UpdatesTimelineSection } from '@/components/imoveis/atualizar-imovel/UpdatesTimelineSection';
import { ValoresSection } from '@/components/imoveis/atualizar-imovel/ValoresSection';
import { DadosImovelSection } from '@/components/imoveis/atualizar-imovel/DadosImovelSection';
import { ConteudoSeoSection } from '@/components/imoveis/atualizar-imovel/ConteudoSeoSection';
import { ProprietariosCaptadoresSection } from '@/components/imoveis/atualizar-imovel/ProprietariosCaptadoresSection';
import { PortaisSection } from '@/components/imoveis/atualizar-imovel/PortaisSection';
import { ChaveirosSection } from '@/components/imoveis/atualizar-imovel/ChaveirosSection';
import { CaracteristicasSection } from '@/components/imoveis/atualizar-imovel/CaracteristicasSection';
import { HorariosVisitaSection } from '@/components/imoveis/atualizar-imovel/HorariosVisitaSection';
import { Skeleton } from '@/components/ui/skeleton';
import { LogoOverlayPanel } from '@/features/imoveis/components/LogoOverlayPanel';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { cn } from '@/lib/utils';
import type { ImovelMedia, ImovelUpdate } from '@/types/imovel';

type EntityType = 'imovel' | 'condominio';
type EditorMode = 'create' | 'edit';

type EntitySection =
  | 'media'
  | 'logoOverlay'
  | 'status'
  | 'updates'
  | 'values'
  | 'propertyData'
  | 'seo'
  | 'people'
  | 'portals'
  | 'keys'
  | 'features'
  | 'visitation';

interface EntityFormValues {
  status: string;
  valores: {
    venda?: string;
    valorAnterior?: string;
    condominio?: string;
    iptuMensal?: string;
    iptuAnual?: string;
    rentabilidade?: string;
    comissaoVenda?: string;
    valorSobConsulta?: boolean;
  };
  dados: {
    codigo?: string;
    codigoAuxiliar?: string;
    destinacao?: string;
    situacao?: string;
    finalidade?: string;
    tipoImovel?: string;
    segundoTipo?: string;
    localChaves?: string;
    identificadorChaves?: string;
    numChaves?: string;
    numControles?: string;
    construtora?: string;
    edificio?: string;
    condominio?: string;
    idade?: string;
    horarioVisita?: string;
    identificadorImovel?: string;
    placaFaixa?: string;
  };
  conteudoSeo: {
    tituloAnuncio?: string;
    descricao?: string;
    metaDescription?: string;
  };
  pessoas: {
    proprietarios: Array<{ nome: string; porcentagem: number }>;
    captadores: Array<{
      captador: string;
      porcentagem: number;
      indicadoPor?: string;
      principal?: boolean;
    }>;
  };
  medias: ImovelMedia[];
  updates: ImovelUpdate[];
  situacao?: {
    tipo?: 'vago' | 'indisponivel';
    dataLiberacao?: string;
    observacao?: string;
    motivo?: 'vendido' | 'alugado' | 'manutencao' | 'bloqueado' | 'outro';
    prazoEstimado?: string;
  };
}

interface EntityConfig {
  label: string;
  badge: {
    label: string;
    code: string;
    labelClassName: string;
    codeClassName: string;
  };
  apiBase: string;
  listPath: string;
  sections: EntitySection[];
  showLogoOverlay?: boolean;
}

const entityConfigs: Record<EntityType, EntityConfig> = {
  imovel: {
    label: 'Imóvel',
    badge: {
      label: 'Imóvel',
      code: 'IMV',
      labelClassName: 'border-orange-200 bg-orange-50 text-orange-600',
      codeClassName: 'border-orange-500 bg-orange-500 text-white',
    },
    apiBase: '/api/imoveis',
    listPath: '/imoveis',
    sections: [
      'media',
      'logoOverlay',
      'status',
      'updates',
      'values',
      'propertyData',
      'seo',
      'people',
      'portals',
      'keys',
      'features',
      'visitation',
    ],
    showLogoOverlay: true,
  },
  condominio: {
    label: 'Condomínio',
    badge: {
      label: 'Condomínio',
      code: 'COND',
      labelClassName: 'border-blue-200 bg-blue-50 text-blue-600',
      codeClassName: 'border-blue-500 bg-blue-500 text-white',
    },
    apiBase: '/api/condominios',
    listPath: '/gestao-imoveis',
    sections: ['media', 'status', 'updates', 'values', 'seo', 'propertyData'],
  },
};

const TABS: Array<{ value: string; label: string; sections: EntitySection[] }> = [
  {
    value: 'geral',
    label: 'Geral',
    sections: ['media', 'logoOverlay', 'status', 'updates', 'values', 'propertyData'],
  },
  {
    value: 'conteudo',
    label: 'Conteúdo',
    sections: ['seo', 'people', 'portals', 'keys', 'features', 'visitation'],
  },
];

const createDefaultValues = (): EntityFormValues => ({
  status: '',
  valores: {
    venda: '',
    valorAnterior: '',
    condominio: '',
    iptuMensal: '',
    iptuAnual: '',
    rentabilidade: '',
    comissaoVenda: '',
    valorSobConsulta: false,
  },
  dados: {
    codigo: '',
    codigoAuxiliar: '',
    destinacao: '',
    situacao: '',
    finalidade: '',
    tipoImovel: '',
    segundoTipo: '',
    localChaves: '',
    identificadorChaves: '',
    numChaves: '',
    numControles: '',
    construtora: '',
    edificio: '',
    condominio: '',
    idade: '',
    horarioVisita: '',
    identificadorImovel: '',
    placaFaixa: '',
  },
  conteudoSeo: {
    tituloAnuncio: '',
    descricao: '',
    metaDescription: '',
  },
  pessoas: {
    proprietarios: [],
    captadores: [],
  },
  medias: [],
  updates: [],
  situacao: {
    tipo: 'vago',
    dataLiberacao: '',
    observacao: '',
    motivo: 'outro',
    prazoEstimado: '',
  },
});

const mergeFormValues = (base: EntityFormValues, incoming: Partial<EntityFormValues>): EntityFormValues => ({
  ...base,
  ...incoming,
  valores: {
    ...base.valores,
    ...(incoming.valores ?? {}),
  },
  dados: {
    ...base.dados,
    ...(incoming.dados ?? {}),
  },
  conteudoSeo: {
    ...base.conteudoSeo,
    ...(incoming.conteudoSeo ?? {}),
  },
  pessoas: {
    proprietarios: incoming.pessoas?.proprietarios ?? base.pessoas.proprietarios,
    captadores: incoming.pessoas?.captadores ?? base.pessoas.captadores,
  },
  situacao: {
    ...base.situacao,
    ...(incoming.situacao ?? {}),
  },
  medias: incoming.medias ?? base.medias,
  updates: incoming.updates ?? base.updates,
});

export interface EntityEditorProps {
  entity: EntityType;
  mode: EditorMode;
}

export function EntityEditor({ entity, mode }: EntityEditorProps) {
  const config = entityConfigs[entity];
  const defaultValues = useMemo(() => createDefaultValues(), [entity]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();

  const [initialValues, setInitialValues] = useState<EntityFormValues>(defaultValues);
  const [medias, setMedias] = useState<ImovelMedia[]>(defaultValues.medias ?? []);
  const [updates, setUpdates] = useState<ImovelUpdate[]>(defaultValues.updates ?? []);
  const [activeTab, setActiveTab] = useState<string>(() => searchParams.get('tab') ?? 'geral');
  const [isLoading, setIsLoading] = useState<boolean>(mode === 'edit');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<EntityFormValues>({
    defaultValues,
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [initialValues, form]);

  useEffect(() => {
    setInitialValues(defaultValues);
    setMedias(defaultValues.medias ?? []);
    setUpdates(defaultValues.updates ?? []);
  }, [defaultValues]);

  useEffect(() => {
    if (mode !== 'edit') {
      setIsLoading(false);
      return;
    }

    if (!id) {
      setLoadError('Identificador do registro não encontrado.');
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchEntity = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await fetch(`${config.apiBase}/${id}`);
        if (!response.ok) {
          throw new Error(`Falha ao carregar ${config.label.toLowerCase()}.`);
        }

        const data = (await response.json()) as Partial<EntityFormValues> | undefined;
        if (!isMounted) return;

        const merged = mergeFormValues(createDefaultValues(), data ?? {});
        setInitialValues(merged);
        setMedias(merged.medias ?? []);
        setUpdates(merged.updates ?? []);
      } catch (error) {
        if (!isMounted) return;
        console.error('[EntityEditor] Failed to load entity', error);
        setLoadError('Não foi possível carregar os dados. Tente novamente.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchEntity();

    return () => {
      isMounted = false;
    };
  }, [config.apiBase, config.label, id, mode]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const resolvedTabs = useMemo(() => {
    return TABS.map(tab => ({
      ...tab,
      sections: tab.sections.filter(section => config.sections.includes(section)),
    })).filter(tab => tab.sections.length > 0);
  }, [config.sections]);

  useEffect(() => {
    if (!resolvedTabs.length) {
      return;
    }

    const isActiveTabValid = resolvedTabs.some(tab => tab.value === activeTab);
    if (!isActiveTabValid) {
      setActiveTab(resolvedTabs[0]?.value ?? 'geral');
    }
  }, [activeTab, resolvedTabs]);

  const handleBack = () => {
    navigate(config.listPath);
  };

  const handleAddUpdate = (update: Omit<ImovelUpdate, 'id' | 'createdAt'>) => {
    const newUpdate: ImovelUpdate = {
      ...update,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setUpdates(prev => [newUpdate, ...prev]);
  };

  const handleEditUpdate = (updateId: string, updatedData: Partial<ImovelUpdate>) => {
    setUpdates(prev => prev.map(update => (update.id === updateId ? { ...update, ...updatedData } : update)));
  };

  const handleDeleteUpdate = (updateId: string) => {
    setUpdates(prev => prev.filter(update => update.id !== updateId));
  };

  const onSubmit = async (values: EntityFormValues) => {
    setSubmitError(null);

    const payload = {
      ...values,
      medias,
      updates,
    };

    try {
      const endpoint = mode === 'create' ? config.apiBase : `${config.apiBase}/${id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar os dados.');
      }

      alert(`${config.label} ${mode === 'create' ? 'criado' : 'atualizado'} com sucesso!`);

      if (mode === 'create') {
        navigate(config.listPath);
      }
    } catch (error) {
      console.error('[EntityEditor] Failed to submit form', error);
      setSubmitError('Não foi possível salvar os dados. Tente novamente.');
    }
  };

  const content = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="min-h-screen bg-gray-50">
        <div className="page-container mx-auto w-full max-w-[1200px] px-4 lg:px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="sticky top-0 z-30 -mx-4 border-b border-gray-100 bg-white/90 backdrop-blur lg:-mx-6">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      aria-label="Voltar"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-transparent bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--accent))]"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-xl font-bold text-black sm:text-2xl">
                          {mode === 'create' ? `Novo ${config.label}` : `Atualizar ${config.label}`}
                        </h1>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn('rounded-xl px-3 py-1 text-xs font-medium', config.badge.labelClassName)}>
                            {config.badge.label}
                          </Badge>
                          <Badge variant="secondary" className={cn('rounded-xl px-2.5 py-1 text-xs font-semibold', config.badge.codeClassName)}>
                            {config.badge.code}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Gerencie todos os dados do {config.label.toLowerCase()} em um só lugar.
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                    {submitError && (
                      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                        {submitError}
                      </div>
                    )}
                    <Button
                      type="submit"
                      className="h-11 min-h-[44px] rounded-xl bg-[hsl(var(--accent))] px-6 font-semibold text-white hover:bg-[hsl(var(--accentHover))] focus-visible:ring-[hsl(var(--accent))]"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? 'Salvando...' : 'Salvar alterações'}
                    </Button>
                  </div>
                </div>
              </div>
              {resolvedTabs.length > 1 && (
                <div className="border-t border-gray-100 bg-white/80">
                  <div className="px-4 pb-4 pt-2 sm:px-6">
                    <TabsList className="flex h-auto flex-wrap gap-2 rounded-2xl bg-gray-100 p-1">
                      {resolvedTabs.map(tab => (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className="rounded-xl px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900"
                        >
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                </div>
              )}
            </div>

            {loadError && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {loadError}
              </div>
            )}

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-6 pb-32 pt-6">
                {resolvedTabs.map(tab => (
                  <TabsContent key={tab.value} value={tab.value} className={cn(activeTab === tab.value ? 'block' : 'hidden')}>
                    <div className="space-y-6">
                      {tab.sections.includes('media') && (
                        <MediaUploadSection medias={medias} onMediasChange={setMedias} propertyId={id} />
                      )}

                      {tab.sections.includes('logoOverlay') && config.showLogoOverlay && (
                        <LogoOverlayPanel propertyId={id} />
                      )}

                      {tab.sections.includes('status') && (
                        <StatusSituacaoSection form={form} imovelId={id ?? ''} />
                      )}

                      {tab.sections.includes('updates') && (
                        <UpdatesTimelineSection
                          updates={updates}
                          onAddUpdate={handleAddUpdate}
                          onEditUpdate={handleEditUpdate}
                          onDeleteUpdate={handleDeleteUpdate}
                        />
                      )}

                      {tab.sections.includes('values') && <ValoresSection form={form} />}

                      {tab.sections.includes('propertyData') && <DadosImovelSection form={form} />}

                      {tab.sections.includes('seo') && <ConteudoSeoSection form={form} />}

                      {tab.sections.includes('people') && <ProprietariosCaptadoresSection form={form} />}

                      {tab.sections.includes('portals') && <PortaisSection />}

                      {tab.sections.includes('keys') && <ChaveirosSection />}

                      {tab.sections.includes('features') && <CaracteristicasSection />}

                      {tab.sections.includes('visitation') && <HorariosVisitaSection />}
                    </div>
                  </TabsContent>
                ))}
              </div>
            </motion.div>
          </Tabs>

          <div className="sticky bottom-0 z-30 -mx-4 lg:-mx-6">
            <div className="rounded-t-3xl border border-gray-200 bg-white/95 p-4 pb-safe-area-inset-bottom shadow-lg shadow-gray-900/5 backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-500">
                  Revise os dados antes de salvar.
                </div>
                <Button
                  type="submit"
                  className="h-12 min-h-[48px] rounded-xl bg-[hsl(var(--accent))] px-6 text-white font-semibold hover:bg-[hsl(var(--accentHover))] focus-visible:ring-[hsl(var(--accent))]"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Salvando...' : 'Salvar alterações'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );

  if (isLoading) {
    const skeleton = <Skeleton className="h-screen w-full" />;
    return isMobile ? <MobilePage className="bg-gray-50">{skeleton}</MobilePage> : skeleton;
  }

  if (isMobile) {
    return <MobilePage className="bg-gray-50">{content}</MobilePage>;
  }

  return <div className="flex-1 overflow-auto bg-gray-50">{content}</div>;
}

export default EntityEditor;

