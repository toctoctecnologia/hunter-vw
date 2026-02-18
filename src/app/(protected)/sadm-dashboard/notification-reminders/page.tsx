'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

import { TemplatesTab } from '@/features/sadm-dashboard/notification-reminders/components/templates-tab';
import { RemindersTab } from '@/features/sadm-dashboard/notification-reminders/components/reminders-tab';

export default function Page() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Lembretes e Templates de Notificação</h1>

      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="reminders">Lembretes</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <TemplatesTab />
        </TabsContent>

        <TabsContent value="reminders">
          <RemindersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
