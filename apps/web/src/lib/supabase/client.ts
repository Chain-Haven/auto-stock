import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function createMockClient(): SupabaseClient {
  const noUser = { data: { user: null }, error: null };
  const configError = { data: { user: null }, error: { message: "Supabase not configured", name: "AuthError", status: 500 } };
  return {
    auth: {
      getUser: () => Promise.resolve(noUser),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve(configError),
      signUp: () => Promise.resolve(configError),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: "No env", details: "", hint: "", code: "" } }) }) }),
      upsert: () => Promise.resolve({ data: null, error: { message: "No env", details: "", hint: "", code: "" } }),
      insert: () => Promise.resolve({ data: null, error: { message: "No env", details: "", hint: "", code: "" } }),
    }),
  } as unknown as SupabaseClient;
}

export function createClient() {
  if (!url || !key) {
    return createMockClient();
  }
  return createBrowserClient(url, key);
}
