import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://yqddkgarogdzrdonkhbd.supabase.co";
const supabaseAnonKey = "sb_publishable_IluObfhhd9LvBc8qj34vIg_rp92TKlr";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided in environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
