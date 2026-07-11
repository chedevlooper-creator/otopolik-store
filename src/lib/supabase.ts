import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function createSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch {
    console.warn("Failed to initialize Supabase client.");
    return null;
  }
}

// Lazy-initialized client — only created on first actual use, not at module import.
// This prevents build failures when env vars aren't available during prerendering.
let _client: SupabaseClient | null | undefined;

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    if (_client === undefined) {
      _client = createSupabaseClient();
    }
    if (!_client) {
      console.warn("Supabase istemcisi başlatılamadı. Ortam değişkenlerini kontrol edin.");
      return undefined;
    }
    const value = (_client as Record<string | symbol, unknown>)[prop];
    if (typeof value === "function") {
      return value.bind(_client);
    }
    return value;
  },
});
