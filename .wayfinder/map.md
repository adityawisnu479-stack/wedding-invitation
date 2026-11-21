## Destination

Menghasilkan spesifikasi arsitektur teknis dan kontrak interface (deep module, narrow interface, seam ports & adapters, serta adapter in-memory) untuk 3 area utama (Data Store, Template Engine, dan Dashboard State) sehingga seluruh logika sistem teruji (*testable*) tanpa mock jaringan kotor sebelum implementasi kode.

## Notes

- Domain: Sistem Undangan Pernikahan Digital (Next.js, TypeScript).
- Skills: `codebase-design`, `grilling`, `domain-modeling`, `improve-codebase-architecture`.
- Standing preferences: 
  - Gunakan kosakata `/codebase-design`: *module, interface, implementation, depth, deep, shallow, seam, adapter, leverage, locality*.
  - Hindari impor langsung client SDK (Supabase) di komponen UI client.
  - Sediakan selalu adapter in-memory untuk pengujian unit/integrasi.

## Decisions so far

- [Desain Seam dan Kontrak Interface untuk Client Data Store](file:///d:/Projects/web/wedding-invitation/.wayfinder/tickets/T-01-data-store-seam.md): Memisahkan akses data ke antarmuka `DataStore` dengan dua adapter (`SupabaseDataStore` & `InMemoryDataStore`) via `DataStoreProvider`. Dicatat dalam [ADR 0001](file:///d:/Projects/web/wedding-invitation/docs/adr/0001-client-data-store-ports-and-adapters.md).
- [Desain Penyatuan Template Engine dan Deklarasi Tema Visual](file:///d:/Projects/web/wedding-invitation/.wayfinder/tickets/T-02-template-engine-design.md): Mengonsolidasikan template ke `WeddingTemplateEngine` dengan variasi murni berbasis descriptor `TemplateTheme`. Dicatat dalam [ADR 0002](file:///d:/Projects/web/wedding-invitation/docs/adr/0002-unified-template-engine.md).
- [Desain Deep Module untuk Dashboard State & Aksi](file:///d:/Projects/web/wedding-invitation/.wayfinder/tickets/T-03-dashboard-state-store.md): Mengonsolidasi manajemen state dashboard dan aksi domain tamu/undangan ke dalam modul `useDashboardStore`. Dicatat dalam [ADR 0003](file:///d:/Projects/web/wedding-invitation/docs/adr/0003-centralized-dashboard-store.md).

## Not yet specified

- *(Seluruh frontier utama saat ini telah terjawab dan terspesifikasi secara lengkap).*

## Out of scope

- Penggantian framework Next.js atau migrasi database selain Supabase.
- Penambahan fitur bisnis baru di luar undangan digital (misal: payment gateway amplop digital).
