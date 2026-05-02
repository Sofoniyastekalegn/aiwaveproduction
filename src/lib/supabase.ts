import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  // Define your database types here if known, or keep it generic
};

if (!supabaseAnonKey) {
  console.error(
    '[AIWave] Login will fail: Missing VITE_SUPABASE_ANON_KEY. ' +
    'Create a .env file with VITE_SUPABASE_ANON_KEY from Supabase Dashboard → Settings → API. ' +
    'The anon key is a long JWT starting with eyJ...'
  );
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey || 'placeholder');

export const saveCalllog = async (userId: string, data: {
  phone_number: string;
  industry: string;
  duration: string;
  status: string;
  transcript: any[];
}) => {
  const { error } = await supabase 
  .from('calls')
  .insert([{
    ...data,
    user_id: userId,
    created_at: new Date().toISOString()

  }]);
  return { errpr };
};

