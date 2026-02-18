import { createBrowserClient } from '@supabase/ssr';

const FALLBACK_SUPABASE_URL = 'https://placeholder.supabase.co';
const FALLBACK_SUPABASE_PUBLISHABLE_KEY = 'placeholder-anon-key';

let hasLoggedMissingEnv = false;

export function createClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if ((!supabaseUrl || !supabasePublishableKey) && !hasLoggedMissingEnv) {
    console.error(
      '[Supabase] VITE_SUPABASE_URL e/ou VITE_SUPABASE_PUBLISHABLE_KEY não foram configuradas. ' +
        'A aplicação vai abrir, mas autenticação e recursos protegidos não funcionarão até configurar as variáveis.',
    );
    hasLoggedMissingEnv = true;
  }

  return createBrowserClient(
    supabaseUrl || FALLBACK_SUPABASE_URL,
    supabasePublishableKey || FALLBACK_SUPABASE_PUBLISHABLE_KEY,
  );
}
