# Undangan Pernikahan — Website + Dashboard

Website undangan pernikahan pribadi dengan dashboard untuk mengelola tamu, RSVP, desain, dan musik.
Arsitektur database sudah siap multi-undangan (banyak user) tanpa perlu bongkar skema nanti.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + Framer Motion + Lucide
- Supabase: Postgres (data), Auth (login dashboard), Storage (foto & musik)

## 1. Setup

```bash
npm install
cp .env.example .env.local
```

Isi `.env.local` dengan URL + anon key dari **Supabase → Project Settings → API**.

Lalu jalankan **seluruh isi** `supabase/schema.sql` di **Supabase → SQL Editor**. File itu membuat:

- tabel `invitations`, `guests`, `rsvps_and_wishes` + index + RLS
- bucket storage `wedding-photos` dan `wedding-music` (public read)

Setelah itu buat akun admin di **Supabase → Authentication → Users → Add user** (email + password, centang *auto confirm*).

```bash
npm run dev
```

- Undangan: http://localhost:3000
- Login dashboard: http://localhost:3000/login

## 2. Isi data acara

Semua teks acara (nama mempelai, orang tua, jadwal akad/resepsi, love story, rekening, template pesan WA) ada di
`config/wedding.config.ts`. Saat undangan pertama dibuat dari dashboard, isi config ini di-*copy* ke kolom
`invitations.content` (JSONB) sehingga kamu bisa mengubahnya tanpa deploy — selama fitur editor konten belum ada,
ubah lewat Supabase Table Editor.

Foto, musik, dan toggle section **tidak** di config: semuanya diatur dari dashboard.

## 3. Alur pakai dashboard

1. Login → klik **Buat undangan** (sekali saja).
2. Tab **Tamu**: tambah satu-satu atau *Tempel massal* (satu nama per baris; format `Nama`, `Nama, nomor`, atau `Nama<TAB>Kategori<TAB>nomor`). Tombol copy link & WhatsApp per tamu.
3. Tab **Tampilan**:
   - ganti template (Modern Minimalist / Classic Luxury) + Preview
   - toggle Love Story, Galeri, Amplop Digital
   - pilih/upload musik latar
   - upload foto sampul, mempelai, dan galeri
4. Tab **Ringkasan**: statistik RSVP + sembunyikan/hapus ucapan.

Link tamu: `https://domain-kamu/?to=Nama+Tamu`. Tanpa parameter `to`, nama tamu tampil sebagai sapaan umum.

## 4. Musik default

Taruh beberapa file `.mp3` di folder `music/`, isi `SUPABASE_SERVICE_ROLE_KEY` di `.env.local`, lalu:

```bash
npm run upload-music
```

Semua lagu masuk ke `wedding-music/defaults/` dan langsung muncul di pemilih musik dashboard.
Upload dari dashboard masuk ke `wedding-music/custom/`.

## 5. Struktur

```
app/
  page.tsx                  undangan publik (template mengikuti pengaturan)
  login/, dashboard/
components/invitation/      cover, 2 template, RSVP, shared section
components/dashboard/       ringkasan, tamu, tampilan, login
config/wedding.config.ts    data acara (sumber awal + fallback)
lib/                        tipe, query Supabase, helper (format.test.ts)
supabase/schema.sql         tabel + RLS + storage policy (jangan diedit di dashboard Supabase saja)
scripts/upload-music.mjs    upload mp3 bawaan
proxy.ts                    refresh sesi Supabase untuk /dashboard & /login
```

## Catatan desain (sengaja ditunda)

- `shortcut: satu undangan per user, route "/"`, tambah route `/[slug]` + halaman daftar user saat dibuka untuk publik.
- `shortcut: konten acara dari wedding.config.ts`, tambah editor JSONB di dashboard saat dipakai multi-user.
- `shortcut: tanpa payment/plan`, tambahkan kolom `plan` di `invitations` saat mulai berbayar.

## Verifikasi

```bash
npm test          # unit test helper (parse tamu, nomor WA, countdown)
npm run lint
npm run build
```
