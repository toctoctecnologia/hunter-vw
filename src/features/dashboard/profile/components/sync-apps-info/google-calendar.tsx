import { useEffect, useState } from 'react';

import { useAuth } from '@/shared/hooks/use-auth';

import { hasFeature } from '@/shared/lib/permissions';

import { isGoogleServiceConnected } from '@/shared/lib/google-oauth';

import { TypographyMuted } from '@/shared/components/ui/typography';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

export function GoogleCalendar() {
  const { user } = useAuth();

  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false);

  useEffect(() => {
    if (isGoogleServiceConnected('calendar')) {
      setGoogleCalendarConnected(true);
    }

    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'GOOGLE_CALENDAR_SUCCESS') {
        setGoogleCalendarConnected(true);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
  }, []);

  const handleSyncGoogle = () => {
    window.open('/api/google/oauth/start?scope=calendar', '_blank', 'width=600,height=700');
  };

  return (
    <Card>
      <CardContent className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex w-12 h-12 bg-[#4285F4] rounded-xl items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </div>

          <div className="text-left">
            <p className="font-semibold text-lg">Google Agenda</p>
            <TypographyMuted>Sincronizar com Google Calendar</TypographyMuted>
          </div>
        </div>

        {hasFeature(user?.userInfo.profile.permissions, '1102') && (
          <Button
            size="sm"
            onClick={() => handleSyncGoogle()}
            variant={googleCalendarConnected ? 'outline' : 'default'}
          >
            {googleCalendarConnected ? 'Reconectar' : 'Configurar'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
