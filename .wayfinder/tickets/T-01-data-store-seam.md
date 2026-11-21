---
title: Desain Seam dan Kontrak Interface untuk Client Data Store
type: wayfinder:grilling
status: closed
assigned_to: agent
resolution_date: 2026-11-21
blocks: []
blocked_by: []
---

## Question

Bagaimana bentuk antarmuka (interface) minimal dan seam yang tepat untuk modul Data Store client sehingga komponen UI (`RsvpWishes`, `GuestsTab`, `AppearanceTab`) tidak lagi bergantung pada Supabase SDK secara langsung, serta bagaimana bentuk adapter in-memory untuk pengujian?

## Resolution

Keputusan disepakati dan dicatat pada ADR: [ADR 0001: Client Data Access Menggunakan Ports & Adapters (DataStore)](file:///d:/Projects/web/wedding-invitation/docs/adr/0001-client-data-store-ports-and-adapters.md).

1. **Narrow Interface:** Modul mengekspos interface `DataStore` yang mengelompokkan operasi domain:
   - `wishes`: `submit(input: WishInput): Promise<Result<Wish>>`
   - `guests`: `add(rows: NewGuestInput[]): Promise<Result<Guest[]>>`, `toggleSent(id: string, current: boolean): Promise<Result<void>>`, `remove(id: string): Promise<Result<void>>`
   - `invitation`: `update(id: string, patch: Partial<Invitation>): Promise<Result<void>>`
2. **Dual Adapter:** 
   - `SupabaseDataStore` untuk runtime produksi.
   - `InMemoryDataStore` untuk pengujian unit dan preview lokal bebas network mock.
3. **Injeksi Dependensi:** Disediakan melalui `DataStoreProvider` dan `useDataStore()`.
