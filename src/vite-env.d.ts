/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_API_URL: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_WS_URL: string;
  readonly VITE_FACEBOOK_APP_ID: string;
  readonly VITE_WHATSAPP_CONFIG_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
