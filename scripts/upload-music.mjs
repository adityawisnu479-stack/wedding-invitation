import { createClient } from "@supabase/supabase-js";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

// Jalankan: npm run upload-music
// Menaruh semua file .mp3 di folder ./music ke bucket wedding-music/defaults.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Isi NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di .env.local dulu.");
  process.exit(1);
}

const dir = join(process.cwd(), "music");
const files = (await readdir(dir).catch(() => [])).filter((file) => file.toLowerCase().endsWith(".mp3"));

if (files.length === 0) {
  console.error(`Tidak ada .mp3 di ${dir}. Taruh beberapa lagu default di sana lalu ulangi.`);
  process.exit(1);
}

const supabase = createClient(url, key);

for (const file of files) {
  const body = await readFile(join(dir, file));
  const { error } = await supabase.storage
    .from("wedding-music")
    .upload(`defaults/${file}`, body, { contentType: "audio/mpeg", upsert: true });

  console.log(error ? `GAGAL ${file}: ${error.message}` : `OK   ${file}`);
}
