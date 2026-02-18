'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PaginationState } from '@tanstack/react-table';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, X } from 'lucide-react';
import { toast } from 'sonner';

import { getBuilders } from '@/features/dashboard/properties/api/builders';
import {
  changeMediaOrder,
  changePrincipalMedia,
  deleteCondominiumMedia,
  getCondominiumById,
  getCondominiumMedias,
  newCondominium,
  saveCondominiumMedias,
  updateCondominium,
} from '@/features/dashboard/properties/api/condominiums';
import { getCondominiumFeatures } from '@/features/dashboard/properties/api/condominium-feature';

import { withPermission } from '@/shared/hoc/with-permission';

import { propertyMediaArrayToMediaItems } from '@/features/dashboard/properties/components/property-gallery/utils';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { MediaCategory, MediaItem } from '@/features/dashboard/properties/components/property-gallery/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { CardHeader } from '@/features/dashboard/properties/components/form/property-form/card-header';
import { PropertyGallery } from '@/features/dashboard/properties/components/property-gallery';
import { CurrencyInput } from '@/shared/components/ui/currency-input';
import { Card, CardContent } from '@/shared/components/ui/card';
import { LoadingFull } from '@/shared/components/loading-full';
import { ErrorCard } from '@/shared/components/error-card';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { CondominiumFormData, condominiumSchema } from '@/features/dashboard/properties/components/form/condominium-form/schema';
import { removeNonNumeric } from '@/shared/lib/masks';
import { Textarea } from '@/shared/components/ui/textarea';
import { BackHeader } from '@/features/dashboard/components/back-header';

function Page() {
  const router = useRouter();
  const params = useParams();
  const uuid = params.uuid as string;
  const queryClient = useQueryClient();
  const isNewCondominium = uuid === 'new';

  const [pagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 100 });
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [mainPictureId, setMainPictureId] = useState('');

  const {
    data: condominium,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['condominium', uuid],
    queryFn: () => getCondominiumById(uuid),
    enabled: !isNewCondominium,
  });

  const { data: condominiumMedias } = useQuery({
    queryKey: ['condominium-medias', uuid],
    queryFn: () => getCondominiumMedias(uuid),
    enabled: !isNewCondominium,
  });

  const { data: builders = [] } = useQuery({
    queryKey: ['builders', pagination],
    queryFn: () => getBuilders(pagination),
  });

  const { data: condominiumFeatures = [] } = useQuery({
    queryKey: ['condominium-feature', pagination],
    queryFn: () => getCondominiumFeatures(pagination),
  });

  const form = useForm<CondominiumFormData>({
    resolver: zodResolver(condominiumSchema),
    defaultValues: {
      builderUuid: '',
      name: '',
      // edificeName: '',
      manager: '',
      description: '',
      price: '',
      years: '',
      featureUuids: [],
    },
  });

  useEffect(() => {
    if (condominium) {
      setTimeout(
        () =>
          form.reset({
            ...condominium,
            builderUuid: condominium.builder?.uuid || '',
            price: condominium.price ? String(condominium.price * 100) : '',
            years: String(condominium.years),
          }),
        250,
      );
    }
  }, [condominium, form]);

  useEffect(() => {
    if (condominiumMedias) {
      const convertedMedia = propertyMediaArrayToMediaItems(condominiumMedias);
      setMedia(convertedMedia);

      const principalMedia = condominiumMedias.find((m) => m.principalMedia);
      if (principalMedia) {
        const mainMediaItem = convertedMedia.find((m) => m.uri === principalMedia.url);
        if (mainMediaItem) {
          setMainPictureId(mainMediaItem.id);
        }
      }
    }
  }, [condominiumMedias]);

  const { mutate: mutateMedia, isPending: isPendingMedia } = useMutation({
    mutationFn: ({ uuid, media, mainPictureId }: { uuid: string; media: MediaItem[]; mainPictureId: string }) =>
      saveCondominiumMedias(uuid, media, mainPictureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['condominiums'] });
      queryClient.invalidateQueries({ queryKey: ['condominium', uuid] });
      queryClient.invalidateQueries({ queryKey: ['condominium-medias', uuid] });
      toast.success('Mídias atualizadas com sucesso!');
      // Limpar ObjectURLs de novos uploads
      media.forEach((item) => {
        if (item.file && item.uri.startsWith('blob:')) {
          URL.revokeObjectURL(item.uri);
        }
      });
    },
  });

  const { mutate: mutateCreate, isPending: isPendingCreate } = useMutation({
    mutationFn: (data: CondominiumFormData) => newCondominium(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['condominiums'] });
      toast.success('Condomínio criado com sucesso!');

      if (media.length > 0 && response.uuid) {
        mutateMedia({ uuid: response.uuid, media, mainPictureId });
      }
    },
  });

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: CondominiumFormData }) => updateCondominium(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['condominiums'] });
      queryClient.invalidateQueries({ queryKey: ['condominium', uuid] });
      toast.success('Condomínio atualizado com sucesso!');
      mutateMedia({ uuid, media, mainPictureId });
    },
  });

  const { mutate: mutateChangeMediaOrder } = useMutation({
    mutationFn: ({ uuid, from, to }: { uuid: string; from: number; to: number }) => changeMediaOrder(uuid, from, to),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['condominium-medias', uuid] });
      toast.success('Ordem das mídias alterada com sucesso!');
    },
  });

  const { mutate: mutateDeleteMedia, isPending: isPendingDeleteMedia } = useMutation({
    mutationFn: ({ uuid, mediaCategory, mediaFilename }: { uuid: string; mediaCategory: MediaCategory; mediaFilename: string }) =>
      deleteCondominiumMedia(uuid, mediaCategory, mediaFilename),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['condominiums'] });
      queryClient.invalidateQueries({ queryKey: ['condominium', uuid] });
      queryClient.invalidateQueries({ queryKey: ['condominium-medias', uuid] });
      toast.success('Mídia removida com sucesso!');
    },
  });

  const { mutate: mutateChangePrincipalMedia, isPending: isPendingChangePrincipalMedia } = useMutation({
    mutationFn: ({ uuid, mediaCategory, mediaFilename }: { uuid: string; mediaCategory: MediaCategory; mediaFilename: string }) =>
      changePrincipalMedia(uuid, mediaCategory, mediaFilename),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['condominiums'] });
      queryClient.invalidateQueries({ queryKey: ['condominium', uuid] });
      queryClient.invalidateQueries({ queryKey: ['condominium-medias', uuid] });
      toast.success('Mídia principal alterada com sucesso!');
    },
  });

  const handleAddMedia = (category: MediaCategory, files: File[]) => {
    const newItems: MediaItem[] = files.map((file) => {
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      const id = `${Date.now()}-${Math.random().toString(36).substring(7)}-new-media`;
      const uri = URL.createObjectURL(file);

      return {
        id,
        category,
        type,
        uri,
        file,
        description: '',
        order: media.length + 1,
      };
    });

    setMedia((prev) => [...prev, ...newItems]);

    // Auto-selecionar primeira imagem como principal se não houver
    if (!mainPictureId) {
      const firstImage = newItems.find((item) => item.type === 'image');
      if (firstImage) {
        setMainPictureId(firstImage.id);
      }
    }
  };

  const handleRemoveMedia = (id: string) => {
    if (!id.endsWith('-new-media')) {
      const mediaItem = media.find((m) => m.id === id);

      if (!mediaItem) {
        toast.error('Mídia não encontrada');
        return;
      }

      if (mediaItem.isMainPicture) {
        toast.error('Não é possível remover a mídia principal. Defina outra mídia como principal antes de remover.');
        return;
      }

      const parts = mediaItem?.uri.split(/[/\\]/);
      const filename = parts.pop();

      if (!filename) {
        toast.error(`A url da mídia está em um formato inválido: ${mediaItem.uri}`);
        return;
      }

      mutateDeleteMedia({ uuid, mediaCategory: mediaItem.category, mediaFilename: filename });
    } else {
      setMedia((prev) => {
        const item = prev.find((m) => m.id === id);
        if (item?.uri.startsWith('blob:')) {
          URL.revokeObjectURL(item.uri);
        }
        return prev.filter((m) => m.id !== id);
      });

      if (mainPictureId === id) {
        setMainPictureId('');
      }
    }
  };

  const handleSetMainPicture = (id: string) => {
    if (!id.endsWith('-new-media')) {
      const mediaItem = media.find((m) => m.id === id);

      if (!mediaItem) {
        toast.error('Mídia não encontrada');
        return;
      }

      const parts = mediaItem?.uri.split(/[/\\]/);
      const filename = parts.pop();

      if (!filename) {
        toast.error(`A url da mídia está em um formato inválido: ${mediaItem.uri}`);
        return;
      }

      mutateChangePrincipalMedia({ uuid, mediaCategory: mediaItem.category, mediaFilename: filename });
    } else {
      setMainPictureId(id);
    }
  };

  const onSubmit = (formData: CondominiumFormData) => {
    if (isNewCondominium) {
      mutateCreate({
        ...formData,
        price: formData.price ? (parseFloat(formData.price) / 100).toString() : '',
      });
    } else {
      mutateUpdate({
        uuid,
        data: {
          ...formData,
          price: formData.price ? (parseFloat(formData.price) / 100).toString() : '',
        },
      });
    }
  };

  const handleUpdateDescription = (id: string, description: string) => {
    setMedia((prev) => prev.map((item) => (item.id === id ? { ...item, description } : item)));
  };

  const handleReorderMedia = (from: number, to: number) => {
    mutateChangeMediaOrder({ uuid, from, to });
  };

  if (isLoading) return <Loading />;
  if (isError) return <ErrorCard error={error} title="Erro ao carregar condomínio" />;
  if (!isNewCondominium && !condominium) {
    return <ErrorCard error={new Error('Condomínio não encontrado')} title="Condomínio não encontrado" />;
  }

  const isPending = isPendingCreate || isPendingUpdate || isPendingMedia;

  return (
    <>
      {isPendingMedia && <LoadingFull title="Salvando mídias do condomínio..." />}
      {isPendingDeleteMedia && <LoadingFull title="Removendo mídia do condomínio..." />}
      {isPendingChangePrincipalMedia && <LoadingFull title="Alterando mídia principal do condomínio..." />}

      <div className="space-y-4">
        <BackHeader title={isNewCondominium ? 'Novo Condomínio' : 'Editar Condomínio'} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
            <PropertyGallery
              media={media}
              editMode
              mainPictureId={mainPictureId}
              onAddMedia={handleAddMedia}
              onRemoveMedia={handleRemoveMedia}
              onSetMainPicture={handleSetMainPicture}
              onUpdateDescription={handleUpdateDescription}
              onReorderMedia={handleReorderMedia}
              excludedCategories={['property']}
            />

            <Card>
              <CardHeader title="Informações Básicas" />
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Condomínio *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Residencial Park View" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="manager"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Síndico</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: João Silva" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição completa</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva detalhadamente o imóvel, suas características, localização, diferenciais..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="years"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Anos de Construção</FormLabel>
                        <FormControl>
                          <Input placeholder="0" {...field} onChange={(e) => field.onChange(removeNonNumeric(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="builderUuid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Construtora</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione uma construtora" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {builders.map((builder) => (
                              <SelectItem key={builder.uuid} value={builder.uuid}>
                                {builder.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="featureUuids"
                  render={({ field }) => {
                    const handleAddFeature = (featureUuid: string) => {
                      field.onChange([...field.value, featureUuid]);
                    };

                    const handleRemoveFeature = (featureUuid: string) => {
                      field.onChange(field.value.filter((uuid) => uuid !== featureUuid));
                    };

                    const availableFeatures = condominiumFeatures.filter((feature) => !field.value?.includes(feature.uuid));

                    return (
                      <FormItem>
                        <FormLabel>Características do Condomínio</FormLabel>
                        <div className="space-y-3">
                          {/* Características selecionadas */}
                          {field.value?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {field.value.map((featureUuid) => {
                                const feature = condominiumFeatures.find((f) => f.uuid === featureUuid);
                                if (!feature) return null;

                                return (
                                  <Badge key={feature.uuid} variant="secondary" className="gap-1">
                                    {feature.name}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveFeature(feature.uuid)}
                                      className="ml-1 hover:text-destructive"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                );
                              })}
                            </div>
                          )}

                          {/* Select para adicionar características */}
                          {availableFeatures.length > 0 && (
                            <Select onValueChange={handleAddFeature} value="">
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione característica" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableFeatures.map((feature) => (
                                  <SelectItem key={feature.uuid} value={feature.uuid}>
                                    {feature.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Valores" />
              <CardContent>
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor do Condomínio</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          placeholder="R$ 7.000,00"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" isLoading={isPending}>
                <Save className="h-4 w-4 mr-2" />
                {isNewCondominium ? 'Criar Condomínio' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}

export default withPermission(Page, ['2301']);
