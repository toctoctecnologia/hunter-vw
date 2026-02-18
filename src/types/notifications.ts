export type PushPriority = 'low' | 'normal' | 'high';

export type PushSound = 'default' | 'chime' | 'silent';

export interface NotificationPrefs {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  leadNotifications: boolean;
  appointmentReminders: boolean;
  systemUpdates: boolean;
  marketingEmails: boolean;
  weeklyReports: boolean;
  pushPriority: PushPriority;
  pushSound: PushSound;
}

export interface FeatureFlags {
  [key: string]: boolean;
}
