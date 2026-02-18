'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateRoulettePopupSetting } from '@/features/dashboard/profile/api/user-profile';

import { useAuth } from '@/shared/hooks/use-auth';

import { Card, CardTitle, CardHeader, CardContent } from '@/shared/components/ui/card';
import { TypographyMuted } from '@/shared/components/ui/typography';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';

export function RouletteConfig() {
  const { user, refreshUserInformation } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: updateRoulettePopup, isPending: isUpdatingRoulettePopup } = useMutation({
    mutationFn: async (show: boolean) => updateRoulettePopupSetting(show),
    onSuccess: async () => {
      toast.success('Configuração de notificação atualizada');
      queryClient.invalidateQueries({ queryKey: ['user-information'] });
      await refreshUserInformation();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificações de Leads</CardTitle>
        <TypographyMuted>Configure como você deseja ser notificado sobre novos leads</TypographyMuted>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label>Popup de Novos Leads</Label>
            <TypographyMuted className="text-xs">
              Quando ativado, você receberá um popup sempre que um novo lead for captado. Se desativado, os leads
              aparecerão apenas na tela de &quot;Negociações&quot;.
            </TypographyMuted>
          </div>
          <Switch
            checked={user?.userInfo?.showRoulettePopup ?? true}
            onCheckedChange={(checked) => updateRoulettePopup(checked)}
            disabled={isUpdatingRoulettePopup}
          />
        </div>
      </CardContent>
    </Card>
  );
}
