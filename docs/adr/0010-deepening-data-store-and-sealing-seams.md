# ADR 0010: Pendalaman Modul Data Store, Penyegelan Seam Autentikasi, dan Resolusi Rute Publik

- **Status**: Accepted
- **Tanggal**: 2026-11-22
- **Konteks**: Menindaklanjuti audit arsitektur (/improve-codebase-architecture) untuk mengeliminasi kebocoran seam di komponen UI (pelanggaran ESLint `no-restricted-imports`), mendisiplinkan isolasi tenant pada media storage (ADR 0009), memusatkan mutasi section konten undangan, dan mengonsolidasikan kueri rute publik.

---

## Konteks & Masalah

1. **Kebocoran Seam Autentikasi & Akun (`supabaseBrowser` di UI)**:
   - Komponen `LoginForm.tsx` dan `DashboardShell.tsx` memanggil `supabaseBrowser()` secara langsung untuk login, logout, dan bootstrap undangan akun baru.
   - Hal ini melanggar aturan ESLint ("Data & UI Boundary Rule") serta membebani komponen UI dengan logika orkestrasi peracikan slug unik dan pengisian starter template.
2. **Keterbatasan Media Store terhadap Konteks Tenant**:
   - Sesuai ADR 0009, berkas media wajib diisolasi di folder `{user_id}/{invitation_id}/`. Namun interface `DataStore["media"]` saat ini tidak menerima parameter context tenant/undangan sehingga berkas masih diunggah ke folder global.
3. **Duplikasi State di Content Tab**:
   - `ContentTab.tsx` mengelola 8 pasang `useState` manual untuk setiap seksi konten undangan, memaksa caller melakukan cloning/merging objek partial dan koordinasi status saving secara berulang.
4. **Duplikasi Kueri Halaman Publik**:
   - Rute publik (`/u/[slug]` dan `/undangan`) mengorkestrasi 3 langkah terpisah (pembacaan undangan, pengecekan sentinel string `"local"`, dan pembacaan ucapan), sehingga detail fallback database bocor ke caller.

---

## Keputusan Desain

1. **Ekspansi Seam Autentikasi & Akun (`AccountStore`)**:
   - Menambahkan domain `account` ke dalam `DataStore`:
     ```ts
     export interface AccountStore {
       signIn(creds: {
         email: string;
         password: string;
       }): Promise<StoreResult<{ user: User }>>;
       signUp(creds: {
         email: string;
         password: string;
       }): Promise<StoreResult<{ user: User }>>;
       signOut(): Promise<StoreResult<void>>;
       createInitialInvitation(): Promise<StoreResult<Invitation>>;
     }
     ```
   - Implementasi `SupabaseDataStore` menelan seluruh detail autentikasi, penyusunan slug unik acak (`undangan-${userId.slice(0,8)}-${random}`), serta penyuntikan `createStarterInvitationContent()`.
   - `InMemoryDataStore` menyediakan simulasi akun dan provisioning tanpa koneksi jaringan untuk keperluan testing.

2. **Tenant-Aware Media Management**:
   - Memperbarui antarmuka upload media di `DataStore["media"]` agar menerima context undangan (`invitationId`), sedangkan `user.id` diambil otomatis oleh adapter Supabase dari auth session aktif.
   - Adapter menyusun path terisolasi: `{user_id}/{invitation_id}/{folder}/{timestamp}-{cleanFileName}`.

3. **Seam Mutasi Sub-bagian Konten Undangan (`updateSection`)**:
   - Menambahkan aksi `updateSection` pada `DashboardStore`:
     ```ts
     updateSection: <K extends keyof InvitationContent>(
       section: K,
       value: InvitationContent[K]
     ) => Promise<{ success: boolean; error?: string }>;
     ```
   - Penggabungan partial content, optimistik state, dan pengelolaan `savingKey: section` ditangani terpusat oleh dashboard store.

4. **Konsolidasi Modul Kueri Undangan Publik (`resolvePublicInvitation`)**:
   - Menyediakan fungsi resolusi tunggal di `lib/data.ts`:
     ```ts
     export type InvitationResolution =
       | { status: "found"; invitation: Invitation; wishes: Wish[] }
       | { status: "not_found" };

     export async function resolvePublicInvitation(
       slug?: string
     ): Promise<InvitationResolution>;
     ```
   - Mengenkapsulasi sentinel ID `"local"` dan pengambilan ucapan sehingga rute server Next.js hanya mengonsumsi discriminated union yang siap pakai.

---

## Konsekuensi

- **Positif**:
  - Seluruh pelanggaran ESLint `no-restricted-imports` di `components/` teratasi sepenuhnya.
  - Alur login, logout, dan bootstrapping undangan dapat diuji secara headless tanpa network mock.
  - Struktur storage patuh 100% pada aturan isolasi multi-tenant ADR 0009.
  - Mengurangi ratusan baris kode boilerplate di `ContentTab` dan server pages.
- **Negatif / Perubahan Antarmuka**:
  - `DataStore` memerlukan implementasi domain `account` di kedua adapter (`supabase` dan `in-memory`).
  - Unit test data store perlu diperbarui untuk mencakup metode-metode baru tersebut.
