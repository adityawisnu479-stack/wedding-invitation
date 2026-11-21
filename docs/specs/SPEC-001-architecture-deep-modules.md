# SPEC-001: Refaktor Arsitektur Deep Module (DataStore, Template Engine, Dashboard Store)

## Problem Statement

Pengguna dan pengembang aplikasi undangan pernikahan menghadapi kesulitan dalam merawat dan menguji aplikasi secara reliabel karena arsitektur modul yang dangkal (*shallow*). Akses database client bocor langsung ke dalam komponen presentasi visual, template undangan menduplikasi ratusan baris kode untuk urutan bagian yang sama, dan state dashboard dioperkan secara mentah tanpa batas enkapsulasi domain yang jelas. Hal ini meningkatkan risiko regresi saat penambahan fitur baru dan membuat pembuatan tes otomatis menjadi rumit serta bergantung pada jaringan.

## Solution

Mengonsolidasi arsitektur codebase menjadi modul-modul yang dalam (*deep modules*) dengan batas *seam* yang bersih dan antarmuka yang sempit (*narrow interfaces*). Solusi ini menghadirkan:
1. Antarmuka penyimpanan data client (*DataStore*) dengan pola *Ports & Adapters* yang mendukung implementasi produksi (Supabase) dan implementasi pengujian (*InMemory*).
2. Satu mesin orkestrasi template undangan (*Template Engine*) terpadu yang memisahkan logika urutan seksi dari token visual tema.
3. Modul pengelola state dashboard (*Dashboard Store*) yang memusatkan pembaruan optimistik dan aksi domain tamu serta pengaturan undangan.

## User Stories

1. Sebagai pengembang aplikasi, saya ingin berinteraksi dengan antarmuka DataStore yang sempit dari komponen UI, sehingga detail teknis SDK database tidak bocor ke dalam komponen visual.
2. Sebagai pengembang aplikasi, saya ingin menyediakan adapter penyimpanan in-memory pada test suite, sehingga pengujian alur RSVP dan daftar tamu dapat berjalan cepat, terisolasi, dan deterministik tanpa koneksi internet.
3. Sebagai pengembang aplikasi, saya ingin menambahkan tema tampilan undangan baru hanya dengan menulis konfigurasi deklarasi tema, sehingga saya tidak perlu menyalin dan merawat urutan seksi secara berulang.
4. Sebagai pengembang aplikasi, saya ingin mengubah urutan seksi atau menambahkan seksi undangan baru pada satu tempat terpusat di Template Engine, sehingga perubahan tersebut langsung terefleksi konsisten di semua tema undangan.
5. Sebagai calon pengantin (pengguna dashboard), saya ingin menambah tamu baru atau mengimpor daftar tamu secara massal dengan pembaruan state yang instan dan terpercaya, sehingga saya dapat segera menyalin tautan undangan tanpa gangguan lag antarmuka.
6. Sebagai calon pengantin, saya ingin menandai status pengiriman undangan pada daftar tamu dengan pembaruan status yang konsisten, sehingga saya tidak kehilangan jejak tamu mana yang sudah dihubungi.
7. Sebagai calon pengantin, saya ingin mengubah preferensi visibilitas seksi undangan (galeri foto, cerita cinta, amplop digital) dengan penanganan penyimpanan yang aman, sehingga tamu hanya melihat seksi yang saya kehendaki.
8. Sebagai tamu undangan, saya ingin mengirimkan doa dan konfirmasi kehadiran melalui formulir RSVP dengan umpan balik pengiriman yang jelas, sehingga pesan dan konfirmasi kehadiran saya tercatat dengan benar.
9. Sebagai tamu undangan, saya ingin melihat pesan doa dan ucapan tamu lain secara langsung di halaman undangan dengan tampilan yang selaras dengan tema yang dipilih pemilik acara.
10. Sebagai pengembang aplikasi, saya ingin menguji seluruh alur logika sinkronisasi dashboard tanpa harus merender hierarki DOM yang kompleks, sehingga siklus umpan balik pengembangan menjadi lebih singkat.

## Implementation Decisions

- **Modul Data Store (Ports & Adapters):**
  - Komponen UI tidak lagi mengimpor SDK database eksternal secara langsung.
  - Antarmuka Data Store dikelompokkan berdasarkan entitas domain utama: operasi doa/RSVP, operasi daftar tamu, dan pemutakhiran pengaturan undangan.
  - Menyediakan dua implementasi adapter: satu adapter nyata untuk produksi dan satu adapter tiruan in-memory untuk lingkungan pengujian dan mode lokal.
  - Modul Data Store disediakan ke pohon komponen UI melalui React Context Provider dan custom hook pendamping.

- **Modul Template Engine (Presentation Consolidation):**
  - Menggabungkan perulangan seksi undangan yang sebelumnya terduplikasi pada template terpisah ke dalam satu komponen orkestrator terpusat.
  - Varian tema visual didefinisikan sebagai deskriptor deklaratif murni yang menyediakan pemetaan kelas pembungkus, nada warna (light/dark), serta komponen render khusus untuk hero dan kartu mempelai.
  - Evaluasi visibilitas seksi berdasarkan konfigurasi undangan dan pengalihan seksi dilakukan terpusat di dalam Template Engine.

- **Modul Dashboard Store:**
  - Menghilangkan praktik pengoperan setter state mentah (*prop drilling*) dari shell dashboard ke tab-tab anak.
  - Menyediakan hook atau context terpusat yang mengekspos state terpadu (data undangan, daftar tamu, doa, status penyimpanan, dan pesan kesalahan) serta daftar aksi domain yang dapat dipanggil oleh tab.
  - Seluruh mutasi data di dalam Dashboard Store didelegasikan ke antarmuka Data Store yang aktif.

## Testing Decisions

- **Filosofi Pengujian:**
  - Pengujian difokuskan secara ketat pada pengujian perilaku eksternal melalui antarmuka modul publik (*testing through the seam*), bukan menguji detail implementasi internal atau state privat.
  - Pengujian tidak boleh melakukan monkey patching atau mock terhadap library vendor database pada tingkat modul.
- **Seam Pengujian Utama:**
  - **Data Store Seam:** Menguji `InMemoryDataStore` secara langsung untuk memastikan validasi, mutasi data tamu, dan penambahan RSVP memenuhi kontrak antarmuka yang diharapkan.
  - **Dashboard Store Seam:** Menguji custom hook Dashboard Store dengan menginjeksikan `InMemoryDataStore`, memverifikasi bahwa pemanggilan aksi menghasilkan mutasi state yang tepat dan menangani skenario kegagalan penyimpanan.
  - **Component Integration Seam:** Menguji komponen formulir RSVP dan tab dashboard dengan membungkusnya dalam penyedia `InMemoryDataStore`, memverifikasi interaksi pengguna (input teks, submit) sampai state UI terbarui.
- **Prioritas & Format:**
  - Mengikuti pola pengujian yang sudah ada di proyek (misalnya pengujian unit fungsi format string) dan menggunakan test runner bawaan dengan assertions berbasis TypeScript.

## Out of Scope

- Perubahan pada skema tabel database Supabase yang sudah berjalan.
- Penulisan ulang atau migrasi dari framework Next.js App Router ke framework lain.
- Penambahan fitur bisnis baru seperti integrasi payment gateway otomatis untuk amplop digital.
- Perubahan desain visual dasar (palette warna Tailwind dan aset gambar) di luar refaktor struktur modul.

## Further Notes

- Seluruh rancangan modul pada spesifikasi ini mengacu pada terminologi domain di `GLOSSARY.md` dan keputusan arsitektur yang telah disepakati pada ADR 0001, ADR 0002, dan ADR 0003.
