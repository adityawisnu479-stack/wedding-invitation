# 06: Migrasi Tab Dashboard ke Dashboard Store

**What to build:**
Memigrasikan komponen tab dashboard (`GuestsTab`, `AppearanceTab`, `OverviewTab`) untuk mengonsumsi data dan memicu aksi melalui `useDashboardStore()`. Menghilangkan impor langsung client SDK database dan penanganan state manual dari masing-masing tab.

**Blocked by:** 05 (Modul Deep Dashboard Store & Integrasi ke Shell)

**Status:** closed

- [x] Refaktor `GuestsTab` untuk memanggil aksi `addGuests`, `removeGuest`, dan `toggleGuestSent` dari `useDashboardStore()`.
- [x] Refaktor `AppearanceTab` untuk memanggil aksi `updateInvitation` dari `useDashboardStore()`.
- [x] Pembersihan impor `supabaseBrowser` di seluruh tab dashboard.
- [x] Verifikasi seluruh alur penambahan tamu massal, pengeditan template/seksi undangan, dan penyalinan link undangan berjalan normal.
