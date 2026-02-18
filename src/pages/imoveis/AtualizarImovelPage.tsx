import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import MobilePage from '@/components/shell/MobilePage';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
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
import { getImovelById } from '@/services/imovel';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { ImovelMedia, ImovelUpdate } from '@/types/imovel';
import { LogoOverlayPanel } from '@/features/imoveis/components/LogoOverlayPanel';

// Schema for form validation
const imovelFormSchema = z.object({
  status: z.string().min(1, 'Status é obrigatório'),
  valores: z.object({
    venda: z.string().optional(),
    valorAnterior: z.string().optional(),
    condominio: z.string().optional(),
    iptuMensal: z.string().optional(),
    iptuAnual: z.string().optional(),
    rentabilidade: z.string().optional(),
    comissaoVenda: z.string().optional(),
    valorSobConsulta: z.boolean().default(false)
  }),
  dados: z.object({
    codigo: z.string().min(1, 'Código é obrigatório'),
    codigoAuxiliar: z.string().optional(),
    destinacao: z.string().optional(),
    situacao: z.string().optional(),
    finalidade: z.string().optional(),
    tipoImovel: z.string().optional(),
    segundoTipo: z.string().optional(),
    localChaves: z.string().optional(),
    identificadorChaves: z.string().optional(),
    numChaves: z.string().optional(),
    numControles: z.string().optional(),
    construtora: z.string().optional(),
    edificio: z.string().optional(),
    condominio: z.string().optional(),
    idade: z.string().optional(),
    horarioVisita: z.string().optional(),
    identificadorImovel: z.string().optional(),
    placaFaixa: z.string().optional()
  }),
  conteudoSeo: z.object({
    tituloAnuncio: z.string().max(60, 'Título deve ter no máximo 60 caracteres'),
    descricao: z.string().optional(),
    metaDescription: z.string().max(160, 'Meta descrição deve ter no máximo 160 caracteres')
  }),
  pessoas: z.object({
    proprietarios: z.array(z.object({
      nome: z.string().min(1),
      porcentagem: z.number().min(0).max(100)
    })),
    captadores: z.array(z.object({
      captador: z.string().min(1),
      porcentagem: z.number().min(0).max(100),
      indicadoPor: z.string().optional(),
      principal: z.boolean().default(false)
    }))
  }),
  medias: z.array(z.object({
    id: z.string(),
    url: z.string(),
    order: z.number(),
    descricao: z.string(),
    sigla: z.string(),
    isCover: z.boolean().optional(),
    type: z.enum(['imovel', 'lazer']),
    roomTag: z.string().min(1, 'Ambiente é obrigatório'),
    co: z.string().min(1, 'CO é obrigatório'),
    seo: z
      .object({
        title: z.string().min(1, 'Título SEO é obrigatório'),
        alt: z.string().min(1, 'Texto alternativo é obrigatório'),
        slug: z.string().min(1, 'Slug é obrigatório'),
        tags: z.array(z.string()).default([]),
      })
      .optional(),
  })),
  updates: z.array(z.object({
    id: z.string(),
    texto: z.string(),
    tag: z.enum(['verde', 'amarelo', 'vermelho', 'azul']),
    anexos: z.array(z.object({
      id: z.string(),
      name: z.string(),
      url: z.string()
    })).optional(),
    createdAt: z.string(),
    author: z.object({
      id: z.string(),
      name: z.string()
    }).optional()
  })),
  situacao: z.object({
    tipo: z.enum(['vago', 'indisponivel']).optional(),
    dataLiberacao: z.string().optional(),
    observacao: z.string().optional(),
    motivo: z.enum(['vendido', 'alugado', 'manutencao', 'bloqueado', 'outro']).optional(),
    prazoEstimado: z.string().optional()
  }).optional()
});
type ImovelFormValues = z.infer<typeof imovelFormSchema>;
export default function AtualizarImovelPage() {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [medias, setMedias] = useState<ImovelMedia[]>([]);
  const [updates, setUpdates] = useState<ImovelUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imovel, setImovel] = useState<ImovelFormValues | null>(null);
  const form = useForm<ImovelFormValues>({
    resolver: zodResolver(imovelFormSchema),
    defaultValues: imovel || undefined
  });
  useEffect(() => {
    const fetchImovel = async () => {
      setIsLoading(true);
      try {
        const data = await getImovelById(id || '');
        setImovel(data as ImovelFormValues);
        form.reset(data as ImovelFormValues);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchImovel();
    }
  }, [id, form]);
  const handleBack = () => {
    navigate('/imoveis');
  };
  const handleAddUpdate = (update: Omit<ImovelUpdate, 'id' | 'createdAt'>) => {
    const newUpdate: ImovelUpdate = {
      ...update,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setUpdates(prev => [newUpdate, ...prev]);
  };
  const handleEditUpdate = (id: string, updatedData: Partial<ImovelUpdate>) => {
    setUpdates(prev => prev.map(update => update.id === id ? {
      ...update,
      ...updatedData
    } : update));
  };
  const handleDeleteUpdate = (id: string) => {
    setUpdates(prev => prev.filter(update => update.id !== id));
  };
  const onSubmit = (data: ImovelFormValues) => {
    console.log('Saving property updates:', {
      ...data,
      photos: medias,
      updates,
    });
    // Aqui você implementaria a chamada para a API
    alert('Alterações salvas com sucesso!');
  };
  if (isLoading) {
    const skeleton = <Skeleton className="h-screen w-full" />;
    return isMobile ? <MobilePage className="bg-gray-50">{skeleton}</MobilePage> : skeleton;
  }
  const content = <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="min-h-screen bg-gray-50">
        <div className="page-container mx-auto w-full max-w-[1200px] px-4 lg:px-6">
          <div className="sticky top-0 z-30 -mx-4 border-b border-gray-100 bg-white/90 backdrop-blur lg:-mx-6">
            <div className="px-4 py-4 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <button type="button" onClick={handleBack} aria-label="Voltar" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-transparent bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--accent))]">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h1 className="text-xl font-bold text-black sm:text-2xl">Atualizar Imóvel</h1>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">


                </div>
              </div>
            </div>
          </div>

          <motion.div initial={{
        opacity: 0,
        y: 6
      }} animate={{
        opacity: 1,
        y: 0
      }}>
            <div className="pb-32 pt-6 space-y-6">
              {/* Media Upload Section */}
              <MediaUploadSection medias={medias} onMediasChange={setMedias} propertyId={id || undefined} />

              <LogoOverlayPanel propertyId={id || undefined} />

              {/* Status & Situação Section */}
              <StatusSituacaoSection form={form} imovelId={id || ''} />

              {/* Updates Timeline Section */}
              <UpdatesTimelineSection updates={updates} onAddUpdate={handleAddUpdate} onEditUpdate={handleEditUpdate} onDeleteUpdate={handleDeleteUpdate} />

              {/* Values Section */}
              <ValoresSection form={form} />

              {/* Property Data Section */}
              <DadosImovelSection form={form} />

              {/* Content & SEO Section */}
              <ConteudoSeoSection form={form} />

              {/* Owners & Capturers Section */}
              <ProprietariosCaptadoresSection form={form} />

              {/* Portals Section (Read-only) */}
              <PortaisSection />

              {/* Key Holders Section */}
              <ChaveirosSection />

              {/* Characteristics Section */}
              <CaracteristicasSection />

              {/* Visit Hours Section */}
              <HorariosVisitaSection />
            </div>
        </motion.div>
          <div className="sticky bottom-0 z-30 -mx-4 lg:-mx-6">
            <div className="rounded-t-3xl border border-gray-200 bg-white/95 p-4 pb-safe-area-inset-bottom shadow-lg shadow-gray-900/5 backdrop-blur">
              <div className="flex justify-end">
                <Button type="submit" className="h-12 min-h-[48px] rounded-xl bg-[hsl(var(--accent))] px-6 text-white font-semibold hover:bg-[hsl(var(--accentHover))] focus-visible:ring-[hsl(var(--accent))]">
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>;
  return isMobile ? <MobilePage className="bg-gray-50">{content}</MobilePage> : <div className="flex-1 overflow-auto bg-gray-50">
      {content}
    </div>;
}