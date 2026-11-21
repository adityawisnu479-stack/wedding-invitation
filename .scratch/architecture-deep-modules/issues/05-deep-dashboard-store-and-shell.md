# 05: Modul Deep Dashboard Store & Integrasi ke Shell

**What to build:**
Membangun modul custom hook dan context `useDashboardStore()` yang membungkus seluruh state data dashboard (undangan, daftar tamu, ucapan) dan mengekspos aksi-aksi domain yang bersih menggunakan `DataStore`. Mengintegrasikannya ke dalam `DashboardShell` sehingga tidak ada lagi prop drilling setter mentah.

**Blocked by:** 02 (Implementasi SupabaseDataStore Adapter & DataStoreProvider)

**Status:** closed

- [x] Definisi antarmuka `DashboardStore` yang memuat data state dan fungsi aksi domain.
- [x] Implementasi hook `useDashboardStore()` yang menangani pembaruan optimistik dan sinkronisasi ke `DataStore`.
- [x] Penyedia `DashboardProvider` yang membungkus halaman dashboard.
- [x] Refaktor `DashboardShell` agar tidak lagi mendistribusikan setter `setGuests` dan `setInvitation` ke komponen tab anak.
