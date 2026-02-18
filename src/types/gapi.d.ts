
// Google API type declarations
declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      client: {
        init: (config: {
          apiKey: string;
          clientId: string;
          discoveryDocs: string[];
          scope: string;
        }) => Promise<void>;
        calendar: {
          events: {
            list: (params: {
              calendarId: string;
              timeMin: string;
              timeMax: string;
              showDeleted: boolean;
              singleEvents: boolean;
              maxResults: number;
              orderBy: string;
            }) => Promise<{
              result: {
                items?: Array<{
                  id: string;
                  summary?: string;
                  start: { dateTime?: string; date?: string };
                  end: { dateTime?: string; date?: string };
                  description?: string;
                  location?: string;
                  attendees?: Array<{ email: string }>;
                }>;
              };
            }>;
            insert: (params: {
              calendarId: string;
              resource: {
                summary: string;
                start: { dateTime: string; timeZone: string };
                end: { dateTime: string; timeZone: string };
                description?: string;
                location?: string;
              };
            }) => Promise<any>;
          };
        };
      };
      auth2: {
        getAuthInstance: () => {
          isSignedIn: {
            get: () => boolean;
          };
          signIn: () => Promise<void>;
        };
      };
    };
  }
}

export {};
