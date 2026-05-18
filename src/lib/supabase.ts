import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[AIWave] Supabase credentials missing. ' +
    'Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.'
  );
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

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
  const { error } = await supabase.from('calls').insert([
    {
      ...data,
      user_id: userId,
      created_at: new Date().toISOString(),
    },
  ]);
  return { error };
};
