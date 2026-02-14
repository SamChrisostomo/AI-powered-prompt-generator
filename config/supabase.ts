import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://yqddkgarogdzrdonkhbd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxZGRrZ2Fyb2dkenJkb25raGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg2MzQ0MjAsImV4cCI6MjAzNDIxMDQyMH0.IluObfhhd9LvBc8qj34vIg_rp92TKlro-Z2bJ-aR-3M";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided in environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
