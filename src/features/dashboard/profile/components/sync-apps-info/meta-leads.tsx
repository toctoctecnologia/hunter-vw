'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { useAuth } from '@/shared/hooks/use-auth';

import { isMetaLeadsConnected } from '@/shared/lib/meta-oauth';

import { TypographyMuted } from '@/shared/components/ui/typography';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { hasFeature } from '@/shared/lib/permissions';

export function MetaLeads() {
  const { user } = useAuth();

  const [metaConnected, setMetaConnected] = useState(false);

  const handleSyncMetaAds = () => {
    window.open('/api/meta/oauth/start', '_blank', 'width=600,height=700');
  };

  useEffect(() => {
    setMetaConnected(isMetaLeadsConnected());

    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'META_LEADS_SUCCESS') {
        setMetaConnected(true);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => {
      window.removeEventListener('message', handleOAuthMessage);
    };
  }, []);

  return (
    <Card>
      <CardContent className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex w-12 h-12 bg-white rounded-xl items-center justify-center shadow-sm">
            <Image src="/meta-icon.png" alt="Meta Leads" width={48} height={48} />
          </div>

          <div className="text-left">
            <p className="font-semibold text-lg">Meta Leads</p>
            <TypographyMuted>Sincronizar com Facebook/Instagram</TypographyMuted>
          </div>
        </div>

        {hasFeature(user?.userInfo.profile.permissions, '1106') && (
          <Button size="sm" onClick={handleSyncMetaAds} variant={metaConnected ? 'outline' : 'default'}>
            {metaConnected ? 'Reconectar' : 'Configurar'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
