import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve public environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qwkivzdahszcqxxshcko.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3a2l2emRhaHN6Y3F4eHNoY2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzOTA5ODUsImV4cCI6MjEwNjk2Njk4NX0.55fh2IZMJW0R4088WuEGFQwNPcqdeJuYwvmVSCQguvM';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20
  );
};

// Create the public client using the Anon key only (never service role)
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
