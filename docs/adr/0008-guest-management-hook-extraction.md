# ADR 0008: Ekstraksi Manajemen State & Form Tamu ke useGuestManagement

## Status
Accepted

## Konteks
Sebelumnya, `GuestsTab.tsx` mengelola 7 state lokal terpisah (`name`, `category`, `phone`, `bulk`, `showBulk`, `query`, `pending`) bersamaan dengan rendering layout tabel, form, modal tempel massal (*bulk add*), pencarian filter, dan aksi clipboard. Akibatnya, komponen presentasional ini membengkak dan logika alur penambahan serta filtering tamu menyatu rapat dengan JSX antarmuka pengguna.

## Keputusan
1. **Mengekstrak Hook Internal `useGuestManagement`:**
   Membuat modul hook [components/dashboard/useGuestManagement.ts](../../components/dashboard/useGuestManagement.ts) yang mengonsolidasi:
   - State form single guest (`form.name`, `form.category`, `form.phone`, `form.submit`)
   - State bulk parsing (`bulk.text`, `bulk.isOpen`, `bulk.submit`)
   - Logika filtering tamu realtime (`query`, `setQuery`, `filteredGuests`)
   - Aksi-aksi item tamu (`actions.copyLink`, `actions.markSent`, `actions.remove`)
2. **Refactoring `GuestsTab.tsx` Menjadi Murni Presentasional:**
   `GuestsTab.tsx` hanya mengonsumsi nilai dan fungsi dari `useGuestManagement({ slug })`, merampingkan file dan memisahkan state machine dari DOM rendering.

## Konsekuensi
- **Positif (Locality & Readability):** Logika formulir, validasi input, dan filter tamu terisolasi di 1 berkas hook khusus. Komponen `GuestsTab.tsx` menyusut sekitar ~60 baris dan mudah dipahami.
- **Positif (Testability):** Logika form tamu dapat diuji secara terpisah tanpa perlu merender struktur DOM form lengkap.
