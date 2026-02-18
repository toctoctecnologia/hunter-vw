import { WhatsappSessionStatusItem } from '@/shared/types';
import { api } from '@/shared/lib/api';

export async function getWhatsAppSessionStatus() {
  const { data } = await api.get<WhatsappSessionStatusItem>('user/profile/whatsapp/session/status');
  return data;
}

export async function newWhatsAppHistorySession(token: string) {
  await api.patch(`user/profile/whatsapp/history/session?token=${token}`);
}

export async function deleteWhatsAppHistorySession() {
  await api.delete('user/profile/whatsapp/history/session');
}
