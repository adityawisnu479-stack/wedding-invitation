# ADR 0001: Client Data Access Menggunakan Ports & Adapters (DataStore)

## Status
Accepted

## Konteks
Komponen UI client (`RsvpWishes.tsx`, `GuestsTab.tsx`, `AppearanceTab.tsx`) sebelumnya memanggil `supabaseBrowser()` secara langsung untuk query dan mutasi data (RSVP, daftar tamu, dan preferensi tampilan). Hal ini menyebabkan detail skema database, error handling Supabase, dan query string bocor (*leakage*) ke dalam komponen presentasi, serta membuat pengujian UI unit/integrasi sulit dilakukan tanpa mock network bundler yang rapuh.

## Keputusan
1. Membuat modul `DataStore` dengan antarmuka sempit (*narrow interface*) yang mengelompokkan operasi domain:
   - `wishes.submit(input)`
   - `guests.add(rows)`, `guests.toggleSent(id, current)`, `guests.remove(id)`
   - `invitation.update(id, patch)`
2. Menerapkan pola *Ports & Adapters* dengan dua adapter konkret:
   - `SupabaseDataStore`: implementasi produksi menggunakan client Supabase.
   - `InMemoryDataStore`: implementasi in-memory untuk pengujian unit dan mode offline/lokal.
3. Menyediakan dependensi `DataStore` ke Client Components melalui React Context (`DataStoreProvider` dan hook `useDataStore()`), sehingga adapter pengujian dapat diinjeksikan secara instan tanpa monkey patching modul.

## Konsekuensi
- **Positif (Locality & Leverage):** Mutasi dan penanganan error terkonsentrasi pada satu modul. Komponen UI menjadi murni presentasional terhadap antarmuka `DataStore`. Pengujian komponen UI dapat dijalankan cepat dan deterministik menggunakan `InMemoryDataStore`.
- **Negatif:** Diperlukan boilerplate awal berupa penyediaan Provider di root aplikasi/dashboard.
