import Link from "next/link";

export function SetupNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold">Hubungkan Supabase dulu</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink/60">
          Dashboard dan RSVP butuh database. Tiga langkah singkat:
        </p>
        <ol className="mt-4 space-y-3 text-sm text-ink/70">
          <li>
            <span className="font-medium text-ink">1.</span> Buat project di{" "}
            <a className="text-sage underline" href="https://supabase.com" target="_blank" rel="noreferrer">
              supabase.com
            </a>
            .
          </li>
          <li>
            <span className="font-medium text-ink">2.</span> Jalankan{" "}
            <code className="rounded bg-ink/5 px-1 text-xs">supabase/schema.sql</code> di SQL Editor.
          </li>
          <li>
            <span className="font-medium text-ink">3.</span> Salin{" "}
            <code className="rounded bg-ink/5 px-1 text-xs">.env.example</code> menjadi{" "}
            <code className="rounded bg-ink/5 px-1 text-xs">.env.local</code> lalu isi URL & anon key.
          </li>
        </ol>
        <p className="mt-4 rounded-xl bg-cream px-3 py-2 text-xs text-ink/55">
          Buat user admin di Authentication → Users, lalu login di halaman ini.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-sage text-sm font-semibold text-cream transition hover:bg-[#5c6c5f] active:scale-[0.98]"
        >
          Lihat undangan (mode config)
        </Link>
      </div>
    </div>
  );
}
