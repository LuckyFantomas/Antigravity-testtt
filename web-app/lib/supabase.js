import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isConfigured =
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  !supabaseUrl.includes("placeholder") &&
  !supabaseUrl.includes("your_supabase");

let _supabase = null;

/**
 * Returns the Supabase client (lazy-initialized).
 */
function getClient() {
  if (!_supabase && isConfigured) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

// Proxy: only creates the client when actually accessed
export const supabase = new Proxy(
  {},
  {
    get(_, prop) {
      const client = getClient();
      if (!client) {
        throw new Error("Supabase is not configured");
      }
      return client[prop];
    },
  }
);
