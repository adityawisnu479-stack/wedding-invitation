# 01: Fondasi Kontrak DataStore & InMemory Adapter dengan Automated Test

**What to build:**
Membangun kontrak publik antarmuka penyimpanan data client (`DataStore`) yang mencakup operasi domain untuk ucapan/RSVP, daftar tamu, dan pengaturan undangan. Menyediakan adapter tiruan in-memory (`InMemoryDataStore`) beserta rangkaian unit test otomatis yang memverifikasi bahwa seluruh operasi mutasi dan query berjalan sesuai kontrak secara deterministik tanpa dependensi jaringan.

**Blocked by:** None (can start immediately)

**Status:** closed

- [x] Definisi antarmuka publik `DataStore` dengan pembagian modul `wishes`, `guests`, dan `invitation`.
- [x] Implementasi `InMemoryDataStore` yang menyimpan state di memori dan mengembalikan result format yang konsisten.
- [x] Rangkaian unit test yang memverifikasi alur penambahan doa, penambahan tamu (single & bulk), toggle status terkirim, penghapusan tamu, dan pembaruan konfigurasi undangan.
