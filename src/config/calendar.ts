
export const CALENDAR_CONFIG = {
  google: {
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    scopes: [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events'
    ],
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
  },
  apple: {
    serverUrl: import.meta.env.VITE_APPLE_CALENDAR_SERVER || 'https://caldav.icloud.com',
    endpoints: {
      sync: '/api/calendar/apple/sync',
      create: '/api/calendar/apple/create',
      update: '/api/calendar/apple/update',
      delete: '/api/calendar/apple/delete'
    }
  },
  sync: {
    intervalMinutes: 30,
    autoSync: true,
    retryAttempts: 3,
    retryDelay: 5000 // 5 seconds
  }
};

export const CALENDAR_COLORS = {
  personal: '#34A853',
  work: '#4285F4', 
  google: '#EA4335',
  apple: '#007AFF',
  default: '#9AA0A6'
};

export const EVENT_TYPES = {
  meeting: { color: '#4285F4', icon: '👥' },
  appointment: { color: '#34A853', icon: '📅' },
  reminder: { color: '#FBBC04', icon: '⏰' },
  birthday: { color: '#EA4335', icon: '🎂' },
  holiday: { color: '#9AA0A6', icon: '🏖️' },
  task: { color: 'hsl(var(--accent))', icon: '✅' }
};
