# 04: Implementasi Unified Template Engine & Konfigurasi Tema Declarative

**What to build:**
Membangun modul terpadu `WeddingTemplateEngine` yang mengonsolidasi sekuens render 10 section undangan, evaluasi feature-flag, dan binding data ke komponen presentasi. Mengubah template yang ada menjadi deklarasi tema visual murni, dan menyederhanakan pemanggilan di `Invitation`.

**Blocked by:** None (can start immediately)

**Status:** closed

- [x] Definisi antarmuka tema `TemplateTheme` yang memisahkan konfigurasi visual (wrapper, tone, hero renderer, couple card renderer).
- [x] Implementasi modul `WeddingTemplateEngine` yang mengelola alur section undangan secara konsisten di satu tempat.
- [x] Deklarasi tema untuk tema Modern Minimalist dan Classic Luxury.
- [x] Refaktor `Invitation` untuk mendelegasikan presentasi ke `WeddingTemplateEngine`.
- [x] Penghapusan kode redundant di antara komponen template terdahulu.
