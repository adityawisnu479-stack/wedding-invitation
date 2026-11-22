# ADR 0006: Enkapsulasi Penyedia Aset Media Melalui Seam DataStore

## Status
Accepted

## Konteks
Sebelumnya, `AppearanceTab.tsx` mengelola penyimpanan media (foto cover, mempelai, galeri, dan file audio musik) dengan memanggil `supabaseBrowser()` secara langsung ke storage bucket `wedding-photos` dan `wedding-music`. Hal ini mengakibatkan:
1. Detail infrastruktur penyimpanan (nama bucket, folder convention, query parameter, penanganan ekstensi, dan pembentukan URL publik) bocor ke dalam komponen UI presentasional.
2. Seluruh tab dashboard belum sepenuhnya bebas dari vendor lock-in database/storage.
3. Fitur unggah media tidak dapat diuji secara otomatis dalam lingkungan unit testing lokal/offline tanpa koneksi aktif ke Supabase Storage.

## Keputusan
1. **Mendefinisikan Seam Media pada Kontrak `DataStore`:**
   Menambahkan namespace `media` pada `DataStore` di [lib/store/types.ts](../../lib/store/types.ts):
   ```typescript
   export type TrackItem = { name: string; url: string };
   export type PhotoFolder = "cover" | "groom" | "bride" | "gallery";

   export interface DataStore {
     media: {
       listTracks(): Promise<StoreResult<TrackItem[]>>;
       uploadTrack(file: File): Promise<StoreResult<TrackItem>>;
       uploadPhoto(folder: PhotoFolder, file: File): Promise<StoreResult<string>>;
       uploadPhotos(folder: "gallery", files: File[]): Promise<StoreResult<string[]>>;
     };
   }
   ```
2. **Implementasi Dua Adapter (Ports & Adapters):**
   - `SupabaseDataStore`: mengelola operasi unggah ke bucket `wedding-music` dan `wedding-photos`, menyaring file mp3, menyusun prefix path timestamp, dan menghasilkan URL publik Supabase.
   - `InMemoryDataStore`: menyediakan track bawaan tiruan (*mock*) dan mengembalikan URL deterministik tanpa menyentuh jaringan luar, memungkinkan pengujian unit murni.
3. **Refactoring `AppearanceTab.tsx`:**
   Menghapus pemanggilan `supabaseBrowser()` dan murni mengonsumsi `useDataStore().media`.

## Konsekuensi
- **Positif (Locality & Leverage):** Seluruh 4 tab dashboard (`OverviewTab`, `ContentTab`, `GuestsTab`, `AppearanceTab`) sekarang **100% bersih** dari pemanggilan `supabaseBrowser()`.
- **Positif (Testability):** Alur upload musik dan foto terverifikasi melalui unit test otomatis di `lib/store/in-memory-data-store.test.ts`.
- **Positif (Portability):** Jika di masa mendatang ingin memindahkan penyimpanan file ke Cloudflare R2, AWS S3, atau Google Cloud Storage, hanya perlu mengubah implementasi adapter `DataStore` tanpa menyentuh satupun baris kode di UI.
