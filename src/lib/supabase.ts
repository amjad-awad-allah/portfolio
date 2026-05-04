import { createClient } from '@supabase/supabase-js';

// Supabase connection details from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
