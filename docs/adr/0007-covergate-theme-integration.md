# ADR 0007: Penyatuan Konfigurasi Gaya CoverGate ke dalam TemplateTheme

## Status
Accepted

## Konteks
Sebelumnya, komponen pembuka undangan (`CoverGate.tsx`) memiliki percabangan gaya berbasis string template ID (`const luxury = template === "classic-luxury"`). Hal ini mendikte gradient background, bingkai ornamen (*ornament-frame*), warna font judul, ampersand, serta style tombol secara terpisah dari *seam* template engine yang sudah ditetapkan pada ADR 0002. Akibatnya, menambahkan tema undangan baru di masa mendatang mengharuskan modifikasi percabangan `if/else` di dalam `CoverGate.tsx`.

## Keputusan
1. **Memperluas Deskriptor `TemplateTheme`:**
   Menambahkan `coverStyles: CoverThemeStyles` pada antarmuka `TemplateTheme` di [components/invitation/template-engine/types.ts](../../components/invitation/template-engine/types.ts).
2. **Lokalisasi Styling ke File Tema Masing-Masing:**
   - `themes/modern.tsx`: mendefinisikan background radial lembut cerah dan tombol dark ink.
   - `themes/luxury.tsx`: mendefinisikan background gelap kehijauan, ornamen frame emas, dan tombol gold.
3. **Refactoring `CoverGate.tsx` dan `Invitation.tsx`:**
   - `CoverGate` tidak lagi menerima prop string `template: TemplateId`, melainkan objek `theme: TemplateTheme`.
   - `CoverGate` menjadi murni komponen orkestrator interaksi & transisi pembuka undangan.

## Konsekuensi
- **Positif (Locality):** Seluruh styling visual (mulai dari cover gate, hero, couple card, hingga tone warna konten) kini 100% terlokalisasi di berkas tema masing-masing.
- **Positif (Extensibility):** Penambahan tema baru (misal tema ke-3) dapat dilakukan sepenuhnya secara deklaratif tanpa mengubah logika komponen `CoverGate.tsx`.
