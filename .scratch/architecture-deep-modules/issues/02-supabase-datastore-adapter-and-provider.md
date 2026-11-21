# 02: Implementasi SupabaseDataStore Adapter & DataStoreProvider

**What to build:**
Membangun adapter produksi `SupabaseDataStore` yang mengimplementasikan antarmuka `DataStore` dengan memanfaatkan Supabase client. Menyediakan komponen konteks `DataStoreProvider` dan hook `useDataStore()` untuk menginjeksi adapter yang sesuai ke pohon komponen aplikasi.

**Blocked by:** 01 (Fondasi Kontrak DataStore & InMemory Adapter dengan Automated Test)

**Status:** closed

- [x] Implementasi kelas/objek `SupabaseDataStore` yang membungkus query tabel `rsvps_and_wishes`, `guests`, dan `invitations`.
- [x] Penanganan fallback yang aman ketika konfigurasi Supabase belum disetel atau berada di mode demo lokal.
- [x] Penyedia React Context `DataStoreProvider` dan hook pendamping `useDataStore()`.
- [x] Integrasi provider di root layout / layer aplikasi dengan default `SupabaseDataStore`.
