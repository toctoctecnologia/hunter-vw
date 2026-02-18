import { create } from 'zustand';
import type { FeatureFlags, NotificationPrefs } from '@/types/notifications';

const defaultPrefs: NotificationPrefs = {
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  leadNotifications: true,
  appointmentReminders: true,
  systemUpdates: true,
  marketingEmails: false,
  weeklyReports: true,
  pushPriority: 'normal',
  pushSound: 'default',
};

const PREFS_KEY = 'notificationPrefs';
const FLAGS_KEY = 'featureFlags';

interface NotificationPrefsState {
  prefs: NotificationPrefs;
  featureFlags: FeatureFlags;
  load: () => Promise<void>;
  save: (prefs: Partial<NotificationPrefs>) => Promise<void>;
}

export const useNotificationPrefs = create<NotificationPrefsState>((set, get) => ({
  prefs: defaultPrefs,
  featureFlags: {},
  load: async () => {
    try {
      const [prefsRes, flagsRes] = await Promise.all([
        fetch('/api/me/notification-prefs'),
        fetch('/api/me/feature-flags'),
      ]);

      if (prefsRes.ok) {
        const prefs = await prefsRes.json();
        set({ prefs: { ...defaultPrefs, ...prefs } });
        localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
      } else {
        const stored = localStorage.getItem(PREFS_KEY);
        if (stored) set({ prefs: { ...defaultPrefs, ...JSON.parse(stored) } });
      }

      if (flagsRes.ok) {
        const flags = await flagsRes.json();
        set({ featureFlags: flags });
        localStorage.setItem(FLAGS_KEY, JSON.stringify(flags));
      } else {
        const storedFlags = localStorage.getItem(FLAGS_KEY);
        if (storedFlags) set({ featureFlags: JSON.parse(storedFlags) });
      }
    } catch (error) {
      const stored = localStorage.getItem(PREFS_KEY);
      if (stored) set({ prefs: { ...defaultPrefs, ...JSON.parse(stored) } });

      const storedFlags = localStorage.getItem(FLAGS_KEY);
      if (storedFlags) set({ featureFlags: JSON.parse(storedFlags) });
    }
  },
  save: async (prefs) => {
    const updated = { ...get().prefs, ...prefs };
    set({ prefs: updated });
    try {
      await fetch('/api/me/notification-prefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      localStorage.setItem(PREFS_KEY, JSON.stringify(updated));
    } catch (error) {
      localStorage.setItem(PREFS_KEY, JSON.stringify(updated));
    }
  },
}));
