'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from '@/shims/next-navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { withPermission } from '@/shared/hoc/with-permission';
import {
  PropertySituation,
  PropertyDestination,
  PropertyPurpose,
  PropertyGarageType,
  PropertyReadinessStatus,
  PropertyType,
  PropertyConstructionStatus,
  PropertyLaunchType,
  PropertyPositionType,
  PropertyStatus,
} from '@/shared/types';

import {
  changePrincipalMedia,
  deletePropertyMedia,
  getPropertyById,
  getPropertyMedias,
  savePropertyMedias,
  updateProperty,
  changeMediaOrder,
  resyncPropertyIntegrations,
} from '@/features/dashboard/properties/api/properties';

import { AlertModal } from '@/shared/components/modal/alert-modal';

import { propertyMediaArrayToMediaItems } from '@/features/dashboard/properties/components/property-gallery/utils';
import { propertyToFormData } from '@/features/dashboard/properties/components/form/property-form/utils';

import { PropertyFormData, propertySchema } from '@/features/dashboard/properties/components/form/property-form/schema';
import { MediaItem, MediaCategory } from '@/features/dashboard/properties/components/property-gallery/types';

import { CatcherAssignmentCard } from '@/features/dashboard/properties/components/form/property-form/cards/catcher-assignment-card';
import { FeaturesInternalCard } from '@/features/dashboard/properties/components/form/property-form/cards/features-internal-card';
import { FeaturesExternalCard } from '@/features/dashboard/properties/components/form/property-form/cards/features-external-card';
import { FeaturesLeisureCard } from '@/features/dashboard/properties/components/form/property-form/cards/features-leisure-card';
import { OwnerAssignmentCard } from '@/features/dashboard/properties/components/form/property-form/cards/owner-assignment-card';
import { FeaturesExtraCard } from '@/features/dashboard/properties/components/form/property-form/cards/features-extra-card';
import { PropertyKeychainCard } from '@/features/dashboard/properties/components/form/property-form/cards/keychain-card';
import { DimensionsCard } from '@/features/dashboard/properties/components/form/property-form/cards/dimensions-card';
import { PropertyVisitingDays } from '@/features/dashboard/properties/components/form/property-form/visiting-days';
import { LocationCard } from '@/features/dashboard/properties/components/form/property-form/cards/location-card';
import { UpdatesCard } from '@/features/dashboard/properties/components/form/property-form/cards/updates-card';
import { ValuesCard } from '@/features/dashboard/properties/components/form/property-form/cards/values-card';
import { OwnerCard } from '@/features/dashboard/properties/components/form/property-form/cards/owner-card';
import { InfoCard } from '@/features/dashboard/properties/components/form/property-form/cards/info-card';
import { DataCard } from '@/features/dashboard/properties/components/form/property-form/cards/data-card';
import { TagsCard } from '@/features/dashboard/properties/components/form/property-form/cards/tags-card';
import { SeoCard } from '@/features/dashboard/properties/components/form/property-form/cards/seo-card';
import { CardHeader } from '@/features/dashboard/properties/components/form/property-form/card-header';
import { PropertyGallery } from '@/features/dashboard/properties/components/property-gallery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Card, CardContent } from '@/shared/components/ui/card';
import { LoadingFull } from '@/shared/components/loading-full';
import { ErrorCard } from '@/shared/components/error-card';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';
import { Form } from '@/shared/components/ui/form';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

function Page() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const uuid = params.uuid as string;
  const queryClient = useQueryClient();

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [mainPictureId, setMainPictureId] = useState('');
  const [activeTab, setActiveTab] = useState('extra');
  const [isResyncModalOpen, setIsResyncModalOpen] = useState(false);

  const {
    data: property,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['property', uuid],
    queryFn: () => getPropertyById(uuid),
    enabled: !!uuid,
  });

  const { data: propertyMedias } = useQuery({
    queryKey: ['property-medias', uuid],
    queryFn: () => getPropertyMedias(uuid),
    enabled: !!uuid,
  });

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      uuid: '',
      name: '',
      description: '',
      price: '',
      previousPrice: '',
      iptuValue: '',
      commission: '',
      location: {
        street: '',
        number: '',
        city: '',
        state: '',
        floor: '',
        region: '',
        subRegion: '',
        unit: '',
        usageZone: '',
        zipCode: '',
        district: '',
      },
      dimension: {
        internalArea: '',
        externalArea: '',
        lotArea: '',
      },
      feature: {
        rooms: '',
        suites: '',
        bathrooms: '',
        garageSpots: '',
        keyLocation: '',
        furnishedStatus: null,
        livingRooms: '',
        balconies: '',
        floorFinish: '',
        propertyPosition: '',
      },
      payment: {
        paymentMethods: '',
        directWithOwner: false,
        acceptsFinancing: false,
      },
      info: {
        isHighlighted: false,
        isAvailable: false,
        isAvailableForRent: false,
        access: '',
        propertyType: PropertyType.CASA,
        situation: PropertySituation.VAGO_DISPONIVEL,
        destination: PropertyDestination.RESIDENCIAL,
        secondaryType: '',
        purpose: PropertyPurpose.VENDA,
        keysAmount: '',
        garageType: PropertyGarageType.SEM_VAGA,
        garageLocation: '',
        adTitle: '',
        adDescription: '',
        metaDescription: '',
        readinessStatus: PropertyReadinessStatus.PRONTO_PARA_MORAR,
        constructionStatus: PropertyConstructionStatus.READY,
        launchType: PropertyLaunchType.HORIZONTAL,
        propertyPositionType: PropertyPositionType.MIDDLE,
        ownerName: '',
        ownerPhone: '',
        elevatorsCount: '',
        towersCount: '',
        floorsCount: '',
        unitsPerFloor: '',
        totalUnits: '',
        signAuthorized: false,
        signDetails: '',
        signStatus: undefined,
      },
      secondaryDistrictUuid: null,
      condominiumUuid: null,
      featureUuids: [],
      notes: [],
      catcherUuids: [],
      status: PropertyStatus.PENDING_TO_APPROVE,
      statusJustification: '',
      keyIdentifier: '',
      acceptsPermuta: false,
      displayedOnPortal: false,
      internetPublication: false,
    },
  });

  useEffect(() => {
    if (property) {
      const formData = propertyToFormData(property);
      setTimeout(() => form.reset(formData), 250);
    }
  }, [property, form]);

  useEffect(() => {
    if (propertyMedias) {
      const convertedMedia = propertyMediaArrayToMediaItems(propertyMedias);
      setMedia(convertedMedia);

      const principalMedia = propertyMedias.find((m) => m.principalMedia);
      if (principalMedia) {
        const mainMediaItem = convertedMedia.find((m) => m.uri === principalMedia.url);
        if (mainMediaItem) {
          setMainPictureId(mainMediaItem.id);
        }
      }
    }
  }, [propertyMedias]);

  const { mutate: mutateMedia, isPending: isPendingMedia } = useMutation({
    mutationFn: ({ uuid, media, mainPictureId }: { uuid: string; media: MediaItem[]; mainPictureId: string }) =>
      savePropertyMedias(uuid, media, mainPictureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', uuid] });
      queryClient.invalidateQueries({ queryKey: ['property-medias', uuid] });
      toast.success('Mídias atualizadas com sucesso!');
      media.forEach((item) => {
        if (item.file && item.uri.startsWith('blob:')) {
          URL.revokeObjectURL(item.uri);
        }
      });
    },
  });

  const { mutate: mutateDeleteMedia, isPending: isPendingDeleteMedia } = useMutation({
    mutationFn: ({ uuid, mediaCategory, mediaFilename }: { uuid: string; mediaCategory: MediaCategory; mediaFilename: string }) =>
      deletePropertyMedia(uuid, mediaCategory, mediaFilename),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', uuid] });
      queryClient.invalidateQueries({ queryKey: ['property-medias', uuid] });
      toast.success('Mídia removida com sucesso!');
    },
  });

  const { mutate: mutateChangePrincipalMedia, isPending: isPendingChangePrincipalMedia } = useMutation({
    mutationFn: ({ uuid, mediaCategory, mediaFilename }: { uuid: string; mediaCategory: MediaCategory; mediaFilename: string }) =>
      changePrincipalMedia(uuid, mediaCategory, mediaFilename),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', uuid] });
      queryClient.invalidateQueries({ queryKey: ['property-medias', uuid] });
      toast.success('Mídia principal alterada com sucesso!');
    },
  });

  const { mutate: mutateChangeMediaOrder } = useMutation({
    mutationFn: ({ uuid, from, to }: { uuid: string; from: number; to: number }) => changeMediaOrder(uuid, from, to),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-medias', uuid] });
      toast.success('Ordem das mídias alterada com sucesso!');
    },
  });

  const { mutate: mutateResync, isPending: isPendingResync } = useMutation({
    mutationFn: (propertyCode: string) => resyncPropertyIntegrations(propertyCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', uuid] });
      queryClient.invalidateQueries({ queryKey: ['property-medias', uuid] });
      setIsResyncModalOpen(false);
      toast.success('Sincronização iniciada com sucesso! Os dados serão atualizados em breve.');
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: PropertyFormData }) => updateProperty(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', uuid] });
      toast.success('Imóvel atualizado com sucesso!');
      mutateMedia({ uuid, media, mainPictureId });
    },
  });

  const handleAddMedia = (category: MediaCategory, files: File[]) => {
    if (!hasFeature(user?.userInfo.profile.permissions, '2507')) return;
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

  const handleUpdateDescription = (id: string, description: string) => {
    setMedia((prev) => prev.map((item) => (item.id === id ? { ...item, description } : item)));
  };

  const handleReorderMedia = (from: number, to: number) => {
    if (!hasFeature(user?.userInfo.profile.permissions, '2507')) return;
    mutateChangeMediaOrder({ uuid, from, to });
  };

  const handleRemoveMedia = (id: string) => {
    if (!hasFeature(user?.userInfo.profile.permissions, '2507')) return;

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
    if (!hasFeature(user?.userInfo.profile.permissions, '2507')) return;
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

  if (isLoading) return <Loading />;
  if (isError) return <ErrorCard error={error} title="Erro ao carregar imóvel" />;
  if (!property) return <ErrorCard error={new Error('Imóvel não encontrado')} title="Imóvel não encontrado" />;

  return (
    <>
      <AlertModal
        title="Ressincronizar Imóvel"
        description="Ao confirmar esta ação, todos os dados do imóvel serão sobrescritos com as informações da integração (IMOVIEW ou DWV). Esta ação não poderá ser desfeita. Deseja continuar?"
        isOpen={isResyncModalOpen}
        onClose={() => setIsResyncModalOpen(false)}
        onConfirm={() => mutateResync(property.code)}
        loading={isPendingResync}
        isDestructive
      />

      {isPendingMedia && <LoadingFull title="Salvando mídias do imóvel..." />}
      {isPendingDeleteMedia && <LoadingFull title="Removendo mídia do imóvel..." />}
      {isPendingChangePrincipalMedia && <LoadingFull title="Alterando mídia principal do imóvel..." />}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Atualizar Imóvel</h1>
              <p className="text-sm text-muted-foreground">{property.name}</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((formData) => {
              const newNotes = formData.notes
                .filter((note) => note.id?.endsWith('-new-note'))
                .map(({ noteType, description }) => ({ noteType, description }));

              mutate({
                uuid,
                data: {
                  ...formData,
                  notes: newNotes,
                  price: formData.price ? (parseFloat(formData.price) / 100).toString() : '',
                  previousPrice: formData.previousPrice ? (parseFloat(formData.previousPrice) / 100).toString() : '',
                  iptuValue: formData.iptuValue ? (parseFloat(formData.iptuValue) / 100).toString() : '',
                },
              });
            })}
            className="space-y-3 sm:space-y-4"
          >
            <PropertyGallery
              media={media}
              editMode
              mainPictureId={mainPictureId}
              onAddMedia={handleAddMedia}
              onRemoveMedia={handleRemoveMedia}
              onSetMainPicture={handleSetMainPicture}
              onUpdateDescription={handleUpdateDescription}
              onReorderMedia={handleReorderMedia}
            />

            <DataCard form={form} showStatusSelect />

            <LocationCard form={form} />

            <UpdatesCard form={form} />

            <ValuesCard form={form} />

            <DimensionsCard form={form} />

            <TagsCard form={form} />

            <Card>
              <CardHeader title="Características" />

              <CardContent className="space-y-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 rounded-xl p-1">
                    <TabsTrigger value="extra">Extra</TabsTrigger>
                    <TabsTrigger value="internal">Internas</TabsTrigger>
                    <TabsTrigger value="external">Externas</TabsTrigger>
                    <TabsTrigger value="leisure">Lazer</TabsTrigger>
                  </TabsList>

                  <TabsContent value="extra">
                    <FeaturesExtraCard form={form} />
                  </TabsContent>

                  <TabsContent value="internal">
                    <FeaturesInternalCard form={form} />
                  </TabsContent>

                  <TabsContent value="external">
                    <FeaturesExternalCard form={form} />
                  </TabsContent>

                  <TabsContent value="leisure">
                    <FeaturesLeisureCard form={form} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <InfoCard form={form} />

            <SeoCard form={form} />

            {hasFeature(user?.userInfo.profile.permissions, '2504') && <OwnerAssignmentCard propertyUuid={property.uuid} />}

            {hasFeature(user?.userInfo.profile.permissions, '2503') && <CatcherAssignmentCard propertyUuid={property.uuid} />}

            <PropertyKeychainCard propertyUuid={property.uuid} />

            <PropertyVisitingDays propertyUuid={property.uuid} />

            {hasFeature(user?.userInfo.profile.permissions, '2507') && (
              <div className="mt-4 flex flex-col gap-4 sm:flex-row justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 sm:flex-initial"
                  onClick={() => setIsResyncModalOpen(true)}
                >
                  <RefreshCw className="h-4 w-4" />
                  Ressincronizar Integrações
                </Button>
                <Button className="flex-1 sm:flex-initial" type="submit" isLoading={isPending || isPendingMedia}>
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </>
  );
}

export default withPermission(Page, ['2506', '2507']);
