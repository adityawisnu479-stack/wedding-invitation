# 03: Migrasi Komponen RSVP & Wishes ke DataStore Seam

**What to build:**
Memigrasikan komponen formulir pengiriman ucapan dan konfirmasi kehadiran agar tidak lagi memanggil client Supabase secara langsung, melainkan sepenuhnya berkomunikasi melalui `useDataStore()`.

**Blocked by:** 02 (Implementasi SupabaseDataStore Adapter & DataStoreProvider)

**Status:** closed

- [x] Komponen `RsvpWishes` membersihkan impor langsung dari SDK database client.
- [x] Pengiriman ucapan dan RSVP didelegasikan ke pemanggilan method pada `useDataStore().wishes.submit`.
- [x] State lokal daftar ucapan terbarui secara instan saat ucapan baru berhasil dikirim.
- [x] Verifikasi interaksi formulir berjalan lancar baik saat menggunakan adapter Supabase maupun InMemoryDataStore.
