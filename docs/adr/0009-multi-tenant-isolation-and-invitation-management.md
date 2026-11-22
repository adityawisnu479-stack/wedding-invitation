# ADR 0009: Arsitektur Multi-Tenant dan Isolasi Undangan Pengguna

- **Status**: Accepted
- **Tanggal**: 2026-11-22
- **Konteks**: Transisi dari sistem single-invitation statis ke platform multi-tenant berbasis autentikasi akun mandiri di Supabase.

---

## Konteks & Masalah

Sebelumnya aplikasi dirancang dengan asumsi single-tenant:
1. File konfigurasi statis (`config/wedding.config.ts`) memuat data mempelai nyata awal ("Debrion & Nonaventa").
2. Setiap kali akun baru menekan tombol "Buat Undangan", data hardcoded tersebut disalin bulat-bulat ke baris database akun baru, menyebabkan data personal akun awal muncul di akun lain.
3. Rute undangan publik hanya mengarah ke `/undangan` dan fungsi pembacaan data mengambil baris pertama (`limit(1)`).
4. Penamaan berkas di Supabase Storage berisiko tumpang tindih antar pengguna tanpa isolasi path per tenant.

## Keputusan Desain

1. **Starter Template Content (Placeholder Netral)**:
   - Akun baru yang membuat undangan tidak lagi menduplikasi `weddingConfig` akun lama.
   - Menggunakan konfigurasi awal netral (`initialInvitationContent`) dengan nama placeholder (misal: "Nama Mempelai Pria" & "Nama Mempelai Wanita"), tanggal acara default di masa depan, dan daftar rekening kosong (`[]`).

2. **Kardinalitas Akun & Undangan (1 Akun = 1 Undangan Aktif)**:
   - Satu akun pengguna terotentikasi mengelola 1 undangan aktif untuk menyederhanakan alur dashboard saat ini.
   - Skema database diisolasi lewat RLS `user_id = auth.uid()`.

3. **Kustomisasi Slug URL & Validasi Kata Terlarang (Reserved Words)**:
   - Pengguna memiliki kendali untuk mengubah slug undangan di Dashboard (misal: `/u/andi-siti`).
   - Sistem memberlakukan validasi keunikan (`UNIQUE` constraint) dan memblokir kata terlarang (`dashboard`, `login`, `api`, `u`, `undangan`, `admin`).

4. **Isolasi Berkas Media Storage per Tenant**:
   - Struktur folder Supabase Storage (`wedding-assets`) diatur menjadi `{user_id}/{invitation_id}/[filename]`.
   - Menghindari tabrakan nama file dan memastikan pengguna hanya dapat memutakhirkan berkas miliknya.

## Konsekuensi

- **Positif**:
  - Data akun awal tidak lagi bocor ke akun baru.
  - Setiap pengguna memiliki tautan undangan mandiri yang bersih dan unik (`/u/[slug]`).
  - Aman dari potensi overwriting aset foto/musik antar pengguna.
- **Negatif / Batasan**:
  - Diperlukan penyesuaian UI di dashboard untuk input edit slug undangan.
  - Perlu migrasi/penyesuaian helper upload media untuk menyertakan `userId/invitationId` pada path target.
