---
title: Desain Penyatuan Template Engine dan Deklarasi Tema Visual
type: wayfinder:grilling
status: closed
assigned_to: agent
resolution_date: 2026-11-21
blocks: []
blocked_by: []
---

## Question

Bagaimana antarmuka modul Template Engine yang dapat menyatukan sekuens render section (Hero, Mempelai, Acara, Galeri, Cerita Cinta, Amplop, RSVP) antara `ModernTemplate` dan `LuxuryTemplate`, serta bagaimana struktur konfigurasi tema visual (style tokens & custom cards) agar penambahan template baru tidak menduplikasi logika section?

## Resolution

Keputusan disepakati dan dicatat pada ADR: [ADR 0002: Penyatuan Template Presentasi ke dalam Unified Template Engine](file:///d:/Projects/web/wedding-invitation/docs/adr/0002-unified-template-engine.md).

1. **Unified Template Engine:** Logika pemanggilan 10 section undangan, pengecekan feature-flag, dan binding data dipusatkan di balik komponen tunggal `WeddingTemplateEngine`.
2. **Declarative Theme Descriptors:** Variasi tema hanya mengimplementasikan antarmuka `TemplateTheme` (wrapperClass, tone, renderHero, renderCoupleCard, renderFooter).
3. **Caller Boundary:** Modul `Invitation.tsx` memanggil engine melalui resolver tema `getTheme(templateId)` tanpa membedakan komponen per template.
