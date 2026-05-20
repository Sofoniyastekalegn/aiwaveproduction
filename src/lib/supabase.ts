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

// ── Agents table helpers ──────────────────────────────────────────────────────
// Run this SQL once in your Supabase SQL editor to create the agents table:
//
// create table if not exists agents (
//   id uuid primary key default gen_random_uuid(),
//   user_id uuid references auth.users(id) on delete cascade,
//   name text not null,
//   industry text not null default 'General',
//   status text not null default 'Draft',
//   voice text,
//   language text default 'en-US',
//   calls_today integer default 0,
//   knowledge_pct integer default 0,
//   created_at timestamptz default now()
// );
// alter table agents enable row level security;
// create policy "Users manage own agents" on agents
//   for all using (auth.uid() = user_id);

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
