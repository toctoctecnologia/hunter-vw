import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { newProperty, savePropertyMedias } from '@/features/dashboard/properties/api/properties';

import { PropertyFormData, propertySchema } from '@/features/dashboard/properties/components/form/property-form/schema';
import {
  PropertyConstructionStatus,
  PropertyDestination,
  PropertyGarageType,
  PropertyLaunchType,
  PropertyPositionType,
  PropertyPurpose,
  PropertyReadinessStatus,
  PropertySituation,
  PropertyStatus,
  PropertyType,
} from '@/shared/types';

import { FeaturesInternalCard } from '@/features/dashboard/properties/components/form/property-form/cards/features-internal-card';
import { FeaturesExternalCard } from '@/features/dashboard/properties/components/form/property-form/cards/features-external-card';
import { FeaturesLeisureCard } from '@/features/dashboard/properties/components/form/property-form/cards/features-leisure-card';
import { FeaturesExtraCard } from '@/features/dashboard/properties/components/form/property-form/cards/features-extra-card';
import { DimensionsCard } from '@/features/dashboard/properties/components/form/property-form/cards/dimensions-card';
import { LocationCard } from '@/features/dashboard/properties/components/form/property-form/cards/location-card';
import { MediaCategory, MediaItem } from '@/features/dashboard/properties/components/property-gallery/types';
import { ValuesCard } from '@/features/dashboard/properties/components/form/property-form/cards/values-card';
import { OwnerCard } from '@/features/dashboard/properties/components/form/property-form/cards/owner-card';
import { DataCard } from '@/features/dashboard/properties/components/form/property-form/cards/data-card';
import { InfoCard } from '@/features/dashboard/properties/components/form/property-form/cards/info-card';
import { TagsCard } from '@/features/dashboard/properties/components/form/property-form/cards/tags-card';
import { CardHeader } from '@/features/dashboard/properties/components/form/property-form/card-header';
import { SeoCard } from '@/features/dashboard/properties/components/form/property-form/cards/seo-card';
import { PropertyGallery } from '@/features/dashboard/properties/components/property-gallery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Card, CardContent } from '@/shared/components/ui/card';
import { LoadingFull } from '@/shared/components/loading-full';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';

export function PropertyForm() {
  const queryClient = useQueryClient();

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [mainPictureId, setMainPictureId] = useState('');
  const [activeTab, setActiveTab] = useState('extra');

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
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
        floor: '',
        state: '',
        unit: '',
        zipCode: '',
        district: '',
        region: '',
        subRegion: '',
        usageZone: '',
      },
      dimension: {
        internalArea: '',
        externalArea: '',
        lotArea: '',
      },
      feature: {
        area: '',
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
      },
      secondaryDistrictUuid: null,
      condominiumUuid: null,
      featureUuids: [],
      notes: [],
      status: PropertyStatus.PENDING_TO_APPROVE,
      statusJustification: '',
    },
  });

  const { mutate: mutateMedia, isPending: isPendingMedia } = useMutation({
    mutationFn: ({ uuid, media, mainPictureId }: { uuid: string; media: MediaItem[]; mainPictureId: string }) =>
      savePropertyMedias(uuid, media, mainPictureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Mídias criadas com sucesso!');
      media.forEach((item) => {
        if (item.uri.startsWith('blob:')) {
          URL.revokeObjectURL(item.uri);
        }
      });
      setMedia([]);
      form.reset();
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: PropertyFormData) => newProperty(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Imóvel criado com sucesso!');
      mutateMedia({ uuid: data.uuid, media, mainPictureId });
    },
  });

  function onSubmit(formData: PropertyFormData) {
    mutate({
      ...formData,
      price: formData.price ? (parseFloat(formData.price) / 100).toString() : '',
      previousPrice: formData.previousPrice ? (parseFloat(formData.previousPrice) / 100).toString() : '',
      iptuValue: formData.iptuValue ? (parseFloat(formData.iptuValue) / 100).toString() : '',
    });
  }

  const handleUpdateDescription = (id: string, description: string) => {
    setMedia((prev) => prev.map((item) => (item.id === id ? { ...item, description } : item)));
  };

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
    setMedia((prev) => {
      const item = prev.find((m) => m.id === id);
      if (item?.uri.startsWith('blob:')) {
        URL.revokeObjectURL(item.uri);
      }
      return prev.filter((m) => m.id !== id);
    });
    if (mainPictureId === id) setMainPictureId('');
  };

  return (
    <>
      {isPendingMedia && <LoadingFull title="Salvando mídias do imóvel..." />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          <PropertyGallery
            media={media}
            editMode
            mainPictureId={mainPictureId}
            onAddMedia={handleAddMedia}
            onRemoveMedia={handleRemoveMedia}
            onUpdateDescription={handleUpdateDescription}
            onSetMainPicture={(id) => setMainPictureId(id)}
          />

          <DataCard form={form} />

          <LocationCard form={form} />

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

          <OwnerCard form={form} />

          <div className="flex justify-end">
            <Button type="submit" isLoading={isPending}>
              Criar imóvel
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
