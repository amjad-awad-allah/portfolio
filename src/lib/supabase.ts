import { createClient } from '@supabase/supabase-js';

// Supabase connection details from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

// Create Supabase client with safety check
if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials missing. Check your .env file or Netlify environment variables.");
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');
