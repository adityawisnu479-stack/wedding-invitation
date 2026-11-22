# ADR 0005: Penutupan Seam Doa & Ucapan (Wishes) pada DataStore dan DashboardStore

## Status
Accepted

## Konteks
Setelah migrasi Ports & Adapters pada ADR 0001 dan ADR 0003, `OverviewTab.tsx` masih memanggil `supabaseBrowser()` secara langsung untuk aksi menyembunyikan (`toggleHidden`) dan menghapus (`remove`) doa/ucapan (*wishes*). Selain itu, komponen tersebut masih bergantung pada *prop drilling* `wishes` dan `setWishes` dari `DashboardShell.tsx`. Hal ini menyebabkan inkonsistensi arsitektur (*leakage*), di mana satu tab masih memiliki coupling langsung ke vendor database dan pengujian integrasi tab tersebut tidak dapat disimulasikan menggunakan `InMemoryDataStore`.

Di sisi lain, terdapat dua berkas template usang (`ModernTemplate.tsx` dan `LuxuryTemplate.tsx`) yang tidak lagi digunakan setelah adopsi `WeddingTemplateEngine` (ADR 0002).

## Keputusan
1. **Perluasan Kontrak `DataStore.wishes`:**
   Menambahkan method `toggleHidden(id: string, current: boolean)` dan `remove(id: string)` pada kontrak `DataStore` di [lib/store/types.ts](../../lib/store/types.ts), serta mengimplementasikannya pada:
   - `SupabaseDataStore`: memanggil tabel `rsvps_and_wishes` via client Supabase.
   - `InMemoryDataStore`: manipulasi array state in-memory deterministik untuk unit testing.

2. **Sentralisasi Aksi pada `DashboardStoreContext`:**
   Menambahkan `actions.toggleWishHidden(wish)` dan `actions.removeWish(wish)` ke dalam `useDashboardStore()`. Menghapus *prop drilling* `setWishes` dan `wishes` dari `DashboardShell.tsx` ke `OverviewTab.tsx`.

3. **Pembersihan Dead Code (Deletion Test):**
   Menghapus berkas `components/invitation/ModernTemplate.tsx` dan `components/invitation/LuxuryTemplate.tsx` (~474 baris kode) untuk menjaga *AI-navigability* dan kebersihan codebase.

## Konsekuensi
- **Positif (Locality & Leverage):** Seluruh tab dashboard (`OverviewTab`, `ContentTab`, `GuestsTab`, `AppearanceTab`) kini 100% konsisten mengonsumsi state dan aksi melalui `useDashboardStore()`. Tidak ada lagi kebocoran impor `supabaseBrowser` di dalam tab UI dashboard.
- **Positif (Testability):** Seluruh lifecycle manipulasi doa/ucapan dapat diuji secara terisolasi tanpa mock jaringan bundler.
- **Negatif:** Setiap penambahan operasi mutasi baru pada doa/ucapan harus didaftarkan di kontrak `DataStore` dan kedua adapternya.
