import { SendNotificationForm } from '@/features/sadm-dashboard/manage-notifications/components/send-notification-form';

export default function Notifications() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Gerenciar Notificações</h1>
      <SendNotificationForm />
    </div>
  );
}
