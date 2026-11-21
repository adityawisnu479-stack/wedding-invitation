import { createBrowserClient } from "@supabase/ssr";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function supabaseBrowser() {
  if (!supabaseConfigured) throw new Error("Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.");
  browserClient ??= createBrowserClient(supabaseUrl, supabaseAnonKey);
  return browserClient;
}
