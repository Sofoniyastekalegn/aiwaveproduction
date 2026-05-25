import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = String(import.meta.env.VITE_SUPABASE_URL ?? '').trim();
const supabaseAnonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

export const isSupabaseConfigured =
  supabaseUrl.length > 0 && supabaseAnonKey.length > 0;

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.error(
    '[AIWave] Supabase credentials missing. ' +
      'Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env, then restart npm run dev.'
  );
}

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env and restart the dev server.'
    );
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}

/** Lazy Supabase client — only used when {@link isSupabaseConfigured} is true. */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const value = Reflect.get(getSupabase(), prop, receiver);
    return typeof value === 'function' ? value.bind(getSupabase()) : value;
  },
});

export type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    name?: string;
  };
};

export const saveCallLog = async (
  userId: string,
  data: {
    phone_number: string;
    industry: string;
    duration: string;
    status: string;
    transcript: unknown[];
  }
) => {
  const { error } = await getSupabase().from('calls').insert([
    {
      ...data,
      user_id: userId,
      created_at: new Date().toISOString(),
    },
  ]);
  return { error };
};
