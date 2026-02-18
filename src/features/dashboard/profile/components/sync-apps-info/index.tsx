'use client';

import { hasFeature } from '@/shared/lib/permissions';

import { useAuth } from '@/shared/hooks/use-auth';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

import { AssistantHunter } from '@/features/dashboard/profile/components/sync-apps-info/assistant-hunter';
import { GoogleAdsLeads } from '@/features/dashboard/profile/components/sync-apps-info/google-ads-leads';
import { GoogleCalendar } from '@/features/dashboard/profile/components/sync-apps-info/google-calendar';
import { AppleCalendar } from '@/features/dashboard/profile/components/sync-apps-info/apple-calendar';
import { MetaLeads } from '@/features/dashboard/profile/components/sync-apps-info/meta-leads';
import { Whatsapp } from '@/features/dashboard/profile/components/sync-apps-info/whatsapp';

export function SyncAppsInfo() {
  const { user } = useAuth();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Sincronização</CardTitle>
          <CardDescription>Conecte seus calendários para sincronizar eventos</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {hasFeature(user?.userInfo.profile.permissions, '1101') && <GoogleCalendar />}
          {hasFeature(user?.userInfo.profile.permissions, '1103') && <AppleCalendar />}
          {hasFeature(user?.userInfo.profile.permissions, '1105') && <MetaLeads />}
          {hasFeature(user?.userInfo.profile.permissions, '1109') && <GoogleAdsLeads />}
          {hasFeature(user?.userInfo.profile.permissions, '1107') && <Whatsapp />}
          {hasFeature(user?.userInfo.profile.permissions, '1111') && <AssistantHunter />}
        </CardContent>
      </Card>
    </>
  );
}
