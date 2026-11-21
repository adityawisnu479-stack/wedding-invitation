# ADR 0002: Penyatuan Template Presentasi ke dalam Unified Template Engine

## Status
Accepted

## Konteks
Sebelumnya, template undangan diimplementasikan sebagai dua modul terpisah yang berdiri sendiri (`ModernTemplate.tsx` dan `LuxuryTemplate.tsx`). Masing-masing modul menduplikasi ~230 baris kode yang mencakup urutan rendering 10 section identik, pengecekan feature-flag (`show_love_story`, `show_gallery`, `show_gift`), data passing, dan error boundaries. Perbedaan nyata antar keduanya hanyalah variasi token gaya visual, kartu mempelai (*CoupleCard*), dan layout hero.

## Keputusan
1. Mengonsolidasi rendering presentasi ke dalam satu *deep module* yaitu **Template Engine** (`WeddingTemplateEngine`).
2. Modul ini menerima deklarasi tema (*Theme Descriptor*) melalui antarmuka:
   ```typescript
   export interface TemplateTheme {
     id: TemplateId;
     wrapperClass: string;
     tone: "light" | "dark";
     renderHero: (props: HeroSectionProps) => React.ReactNode;
     renderCoupleCard: (props: CoupleCardProps) => React.ReactNode;
     renderFooter?: (props: FooterSectionProps) => React.ReactNode;
   }
   ```
3. Seluruh sekuens section, evaluasi feature-flag, dan binding data ke komponen `shared.tsx` dan `RsvpWishes.tsx` dikelola terpusat di dalam implementasi engine.
4. `Invitation.tsx` memanggil modul engine secara seragam menggunakan resolver tema `getTheme(templateId)`.

## Konsekuensi
- **Positif (Locality & Depth):** Perubahan urutan section atau penambahan fitur undangan (misal: Live Streaming) hanya perlu ditulis di 1 file. Menambah varian template baru murni berupa deklarasi tema visual (~40 baris kode) tanpa menduplikasi orkestrator section.
- **Negatif:** Kustomisasi layout yang radikal (misal: tema horizontal scrolling atau buku perhalaman) memerlukan hook/slot khusus di dalam engine.
