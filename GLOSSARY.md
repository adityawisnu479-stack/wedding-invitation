# Glossary

Dokumentasi terminologi domain untuk sistem wedding invitation. Bebas dari detail teknis implementasi database atau library tertentu.

---

### Invitation (Undangan)
Entitas utama konfigurasi undangan pernikahan milik pengguna, mencakup data kedua mempelai, cerita cinta, galeri foto, amplop digital, preferensi musik latar, serta template visual aktif yang dipilih.

### Guest (Tamu)
Penerima undangan yang terdaftar dalam daftar tamu pemilik acara, memiliki kategori (misal: Reguler, Keluarga, VIP), kontak, dan status pengiriman link undangan personalisasi.

### Wish & RSVP (Doa & Konfirmasi Kehadiran)
Catatan ucapan/doa dan konfirmasi kehadiran (hadir, tidak hadir, masih ragu beserta jumlah orang yang hadir) yang dikirimkan oleh tamu undangan.

### Template (Tema Tampilan)
Variasi visual dan gaya presentasi undangan saat dibuka oleh tamu (misal: Modern Minimalist atau Classic Luxury).

### Template Engine
Orkestrator presentasi yang menyusun urutan bagian undangan (hero, mempelai, jadwal acara, galeri, amplop, dan formulir RSVP) berdasarkan konfigurasi undangan dan tema aktif.

### Data Store
Modul repositori penyimpanan data yang menyediakan operasi pembacaan dan pemutakhiran data undangan, daftar tamu, doa/RSVP, serta penyimpanan aset media tanpa mengekspos mekanisme transmisi jaringan atau vendor database ke komponen pemanggil.

### Media Asset (Aset Media)
Berkas visual (foto sampul, avatar mempelai, galeri foto) dan berkas audio musik latar yang diunggah dan dikaitkan dengan konfigurasi undangan.

### Dashboard Store
Modul penyedia state reaktif dan aksi terpusat untuk antarmuka dashboard pemilik acara. Mengelola sinkronisasi lokal dan mutasi terhadap Data Store secara transparan, termasuk mekanisme transisi dan error rollback.
