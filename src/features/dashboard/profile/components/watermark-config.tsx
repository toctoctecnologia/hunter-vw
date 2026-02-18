'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Image from '@/shims/next-image';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  getOverlaySettings,
  updateOverlaySettings,
  uploadWatermarkImage,
} from '@/features/dashboard/profile/api/watermark';

import { OverlaySetting, OverlaySettingPosition } from '@/shared/types';
import { positionLabels } from '@/shared/lib/utils';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Card, CardTitle, CardHeader, CardContent } from '@/shared/components/ui/card';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { Slider } from '@/shared/components/ui/slider';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';

const watermarkFormSchema = z.object({
  position: z.nativeEnum(OverlaySettingPosition),
  opacity: z.number().min(0).max(100),
  scale: z.number().min(10).max(100),
  margin: z.number().min(0).max(100),
  active: z.boolean(),
});

type WatermarkFormValues = z.infer<typeof watermarkFormSchema>;

export function WatermarkConfig() {
  const queryClient = useQueryClient();

  const watermarkForm = useForm<WatermarkFormValues>({
    resolver: zodResolver(watermarkFormSchema),
    defaultValues: {
      position: OverlaySettingPosition.BOTTOM_CENTER,
      opacity: 80,
      scale: 100,
      margin: 10,
      active: true,
    },
  });

  const { data: overlaySettings, isLoading: isLoadingOverlay } = useQuery({
    queryKey: ['overlay-settings'],
    queryFn: getOverlaySettings,
  });

  const { mutate: updateWatermark, isPending: isUpdatingWatermark } = useMutation({
    mutationFn: async (data: WatermarkFormValues) => {
      if (!overlaySettings) return;
      const payload: OverlaySetting = {
        id: overlaySettings.id,
        watermarkImagePath: overlaySettings.watermarkImagePath,
        position: data.position,
        opacity: data.opacity / 100,
        scale: data.scale / 100,
        margin: data.margin,
        active: data.active,
      };
      return updateOverlaySettings(payload);
    },
    onSuccess: () => {
      toast.success("Configurações de marca d'água atualizadas");
      queryClient.invalidateQueries({ queryKey: ['overlay-settings'] });
    },
  });

  const { mutate: uploadImage, isPending: isUploadingImage } = useMutation({
    mutationFn: uploadWatermarkImage,
    onSuccess: () => {
      toast.success('Imagem enviada com sucesso');
      queryClient.invalidateQueries({ queryKey: ['overlay-settings', 'properties'] });
    },
  });

  const onWatermarkSubmit = (data: WatermarkFormValues) => {
    updateWatermark(data);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    uploadImage(file);
  };

  useEffect(() => {
    if (overlaySettings) {
      setTimeout(() => {
        watermarkForm.reset({
          position: overlaySettings.position,
          opacity: Math.round(overlaySettings.opacity * 100),
          scale: Math.round(overlaySettings.scale * 100),
          margin: overlaySettings.margin,
          active: overlaySettings.active,
        });
      }, 250);
    }
  }, [overlaySettings, watermarkForm]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marca D&apos;água</CardTitle>
        <TypographyMuted>Configure a marca d&apos;água que será aplicada nas imagens dos imóveis</TypographyMuted>
      </CardHeader>

      <CardContent className="space-y-6">
        {overlaySettings?.watermarkImagePath && (
          <div className="space-y-2">
            <Label>Imagem Atual</Label>
            <div className="relative w-full max-w-xs mx-auto aspect-video bg-muted rounded-lg overflow-hidden">
              <Image src={overlaySettings.watermarkImagePath} alt="Marca d'água" fill className="object-contain" />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="watermark-upload">Enviar Nova Imagem</Label>
          <Input
            id="watermark-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploadingImage}
          />
          <TypographyMuted className="text-xs">PNG ou JPG, máximo 5MB</TypographyMuted>
        </div>

        {!isLoadingOverlay && overlaySettings && (
          <Form {...watermarkForm}>
            <form onSubmit={watermarkForm.handleSubmit(onWatermarkSubmit)} className="space-y-4">
              <FormField
                control={watermarkForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Ativar Marca D&apos;água</FormLabel>
                      <TypographyMuted className="text-xs">
                        Aplica a marca d&apos;água nas imagens dos imóveis
                      </TypographyMuted>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={watermarkForm.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posição</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(OverlaySettingPosition).map((value) => (
                          <SelectItem key={value} value={value}>
                            {positionLabels[value]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={watermarkForm.control}
                name="opacity"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Opacidade</FormLabel>
                      <span className="text-sm text-muted-foreground">{field.value}%</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={10}
                        max={100}
                        step={5}
                        value={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={watermarkForm.control}
                name="scale"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Tamanho</FormLabel>
                      <span className="text-sm text-muted-foreground">{field.value}%</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={5}
                        value={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={watermarkForm.control}
                name="margin"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Margem</FormLabel>
                      <span className="text-sm text-muted-foreground">{field.value}px</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={5}
                        value={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg" isLoading={isUpdatingWatermark}>
                Salvar Configurações
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
