# ADR 0003: Sentralisasi State dan Aksi Dashboard ke dalam Deep Dashboard Store

## Status
Accepted

## Konteks
Sebelumnya, `DashboardShell.tsx` menerima `initialData` dan mengelola state mentah melalui beberapa `useState` (`guests`, `invitation`). Setter state mentah (`setGuests`, `setInvitation`) dioperkan ke tab anak (`GuestsTab.tsx`, `AppearanceTab.tsx`) bersamaan dengan pemanggilan mutasi database Supabase langsung dari dalam tab. Hal ini menyebabkan inkonsistensi error handling, minimnya isolasi pengujian logika bisnis tamu/undangan, dan bocornya manajemen state sinkronisasi ke komponen tampilan.

## Keputusan
1. Membuat modul deep **Dashboard Store** yang diekspos melalui hook/context `useDashboardStore()`:
   ```typescript
   export interface DashboardStore {
     invitation: Invitation;
     guests: Guest[];
     wishes: Wish[];
     isSaving: boolean;
     lastError: string | null;
     actions: {
       addGuests: (rows: NewGuestInput[]) => Promise<boolean>;
       removeGuest: (id: string) => Promise<boolean>;
       toggleGuestSent: (id: string) => Promise<boolean>;
       updateInvitation: (patch: Partial<Invitation>, sectionKey?: string) => Promise<boolean>;
     };
   }
   ```
2. Modul ini secara internal memanfaatkan antarmuka `DataStore` (dari ADR 0001) untuk melakukan mutasi data dan mengelola pembaruan state lokal (termasuk rollback jika mutasi gagal).
3. Tab anak (`GuestsTab`, `AppearanceTab`, `OverviewTab`) murni memanggil `actions` yang disediakan oleh `useDashboardStore()` dan tidak lagi menerima prop drilling fungsi setter mentah.

## Konsekuensi
- **Positif (Locality & Testability):** Logika sinkronisasi data tamu dan pengaturan undangan terpusat penuh di 1 modul. Dapat diuji secara unit murni dengan mengombinasikan `useDashboardStore` dan `InMemoryDataStore` tanpa perlu me-render hierarki DOM lengkap.
- **Negatif:** Tab harus berada di dalam konteks penyedia Dashboard Store (`DashboardProvider`).
