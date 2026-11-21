# ADR 0004: Routing Cerdas Pemilik Acara vs Tamu Undangan dan Penambahan Sign Up

## Status
Accepted

## Konteks
Sebelumnya, root path (`/`) selalu menampilkan undangan pernikahan terlepas dari apakah yang membuka adalah pemilik acara yang ingin mengelola dashboard atau tamu undangan. Pemilik acara kesulitan menemukan jalan ke dashboard tanpa mengetik `/login` atau `/dashboard` secara manual di URL. Di sisi lain, tamu undangan yang mengklik tautan undangan tidak boleh terlempar (*redirect*) ke dashboard atau halaman login. Selain itu, formulir login belum menyediakan opsi Sign Up bagi pengguna yang ingin mendaftarkan akun baru secara mandiri.

## Keputusan
1. **Routing Cerdas pada Root (`/`):**
   - Jika root path `/` dibuka **tanpa parameter tamu** (tidak ada `?to=...` dan tidak ada `?preview_template=...`), sistem melakukan pengalihan (*redirect*) ke `/dashboard` (yang secara otomatis diproteksi dan mengarahkan ke `/login` jika belum ada sesi pengguna).
   - Jika root path `/` dibuka **dengan parameter tamu** (`?to=...`) atau preview (`?preview_template=...`), halaman menampilkan undangan pernikahan secara langsung tanpa pengalihan.
2. **Kanonikal Route Undangan (`/undangan`):**
   - Menyediakan rute permanen `/undangan` khusus untuk tamu, sehingga link undangan tamu dapat menggunakan rute ini (misal `/undangan?to=NamaTamu`), menjamin 100% tidak terlempar ke dashboard.
   - Fungsi helper `inviteUrl` diperbarui untuk mengarahkan ke `/undangan` sebagai basis URL undangan tamu.
3. **Penyempurnaan Form Login & Sign Up:**
   - Menambahkan mode *Sign In* dan *Sign Up* pada komponen `LoginForm`, memungkinkan pengguna baru membuat akun email/password secara langsung dari antarmuka login.

## Konsekuensi
- **Positif:** Pemilik acara langsung diarahkan ke ruang kerjanya (dashboard) saat membuka web secara langsung. Tamu undangan dijamin tetap berada di halaman undangan. Registrasi pengguna baru menjadi mudah dan mandiri.
- **Negatif:** Tamu yang sengaja menghapus seluruh query parameter dari URL root akan diarahkan ke login/dashboard, namun link yang disalin via tombol WhatsApp selalu menyertakan rute `/undangan` atau query `?to=...`.
