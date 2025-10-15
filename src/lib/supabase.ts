import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Don't throw — log a friendly message for dev
  console.warn('[supabase] Missing env vars. Supabase client not initialized.');
}

export { supabase };

// Export types as before
export type Student = {
  id: string;
  name: string;
  roll_number: string;
  class: string;
  email?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};
