import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAnonKey, supabaseConfigured, supabaseUrl } from "./client";

export async function supabaseServer() {
  if (!supabaseConfigured) return null;

  const store = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Server Component tidak boleh menulis cookie; sesi tetap valid lewat middleware-free refresh di client.
        }
      },
    },
  });
}
