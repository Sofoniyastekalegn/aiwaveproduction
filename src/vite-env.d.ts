/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_APP_URL: string;
  readonly VITE_N8N_WEBHOOK_URL: string;
  readonly VITE_ELEVEN_LABS_API_KEY: string;
  readonly VITE_TWILIO_PHONE_NUMBER: string;
  readonly VITE_CAL_LINK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
