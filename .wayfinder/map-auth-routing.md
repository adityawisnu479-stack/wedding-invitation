## Destination

Mengonfigurasi alur navigasi dan routing cerdas:
1. Landing page root (`/`) mengarahkan pemilik acara ke `/dashboard` (atau `/login` jika belum autentikasi).
2. Akses undangan tamu melalui rute eksplisit `/undangan` (atau root dengan query param `?to=...` / `?preview_template=...`) tetap menampilkan halaman undangan tanpa redirect ke dashboard.
3. Menyempurnakan antarmuka autentikasi (`/login`) dengan dukungan Sign In dan Sign Up (pendaftaran akun baru) mandiri.

## Notes

- Domain: Sistem Autentikasi Pemilik Acara & Routing Undangan Tamu.
- Skills: `codebase-design`, `grilling`, `domain-modeling`, `to-spec`, `to-tickets`, `implement-spec`.

## Decisions so far

- [ADR 0004: Routing Cerdas Pemilik Acara vs Tamu Undangan](file:///d:/Projects/web/wedding-invitation/docs/adr/0004-smart-routing-and-auth-flow.md): Root `/` redirect ke dashboard/login kecuali ada query tamu, rute `/undangan` tersedia sebagai rute kanonikal undangan tamu, dan halaman `/login` mendukung Sign In & Sign Up.

## Not yet specified

*(Tidak ada ketidakpastian tersisa).*

## Out of scope

- Autentikasi OAuth pihak ketiga (Google, Facebook) di luar email & password bawaan Supabase.
- Pengelolaan multi-tenant undangan yang berbeda akun dalam waktu bersamaan.
