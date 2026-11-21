---
title: Desain Deep Module untuk Dashboard State & Aksi
type: wayfinder:grilling
status: closed
assigned_to: agent
resolution_date: 2026-11-21
blocks: []
blocked_by: []
---

## Question

Bagaimana antarmuka modul Dashboard Store membungkus state optimistik, pembaruan data tamu, dan pembaruan pengaturan undangan sehingga `DashboardShell` dan tab tidak melakukan prop drilling fungsi setter `setState` secara mentah?

## Resolution

Keputusan disepakati dan dicatat pada ADR: [ADR 0003: Sentralisasi State dan Aksi Dashboard ke dalam Deep Dashboard Store](file:///d:/Projects/web/wedding-invitation/docs/adr/0003-centralized-dashboard-store.md).

1. **DashboardStore Interface:** Modul menyediakan data state (`invitation`, `guests`, `wishes`, `isSaving`, `lastError`) dan domain actions (`addGuests`, `removeGuest`, `toggleGuestSent`, `updateInvitation`).
2. **Eliminasi Prop Drilling:** Tab anak (`GuestsTab`, `AppearanceTab`, `OverviewTab`) menggunakan `useDashboardStore()` dan tidak lagi menerima setter `setState` mentah dari shell.
3. **Penyatuan dengan DataStore:** Modul dashboard store diimplementasikan di atas `DataStore` (ADR 0001), memudahkan pengujian alur dashboard secara in-memory.
