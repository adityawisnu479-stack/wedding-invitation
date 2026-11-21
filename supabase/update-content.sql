-- ============================================================
-- SQL Helper: Update / Reset Konten Undangan (JSONB)
-- Jalankan di Supabase SQL Editor jika ingin memperbarui konten
-- undangan langsung dari database.
-- ============================================================

-- 1. Contoh update seluruh content undangan berdasarkan slug 'default'
update public.invitations
set content = jsonb_build_object(
  'quote', jsonb_build_object(
    'text', 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri...',
    'source', 'QS. Ar-Rum: 21'
  ),
  'groom', jsonb_build_object(
    'name', 'Aditya',
    'fullName', 'Aditya Pratama',
    'father', 'Bapak Sutrisno',
    'mother', 'Ibu Siti Rahayu',
    'instagram', 'adityapratama'
  ),
  'bride', jsonb_build_object(
    'name', 'Ayu',
    'fullName', 'Ayu Lestari',
    'father', 'Bapak Hartono',
    'mother', 'Ibu Dewi Kartika',
    'instagram', 'ayulestari'
  ),
  'events', jsonb_build_array(
    jsonb_build_object(
      'kind', 'Akad Nikah',
      'date', '2026-12-12T08:00:00+07:00',
      'place', 'Masjid Al-Ikhlas',
      'address', 'Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan',
      'mapsUrl', 'https://maps.google.com/?q=Masjid+Al-Ikhlas+Jakarta'
    ),
    jsonb_build_object(
      'kind', 'Resepsi',
      'date', '2026-12-12T11:00:00+07:00',
      'place', 'Gedung Graha Indah',
      'address', 'Jl. Anggrek No. 45, Kebayoran Baru, Jakarta Selatan',
      'mapsUrl', 'https://maps.google.com/?q=Gedung+Graha+Indah+Jakarta'
    )
  ),
  'loveStory', jsonb_build_array(
    jsonb_build_object(
      'date', '2019',
      'title', 'Pertemuan Pertama',
      'text', 'Berawal dari teman satu kelompok di kampus, obrolan panjang membuat kami semakin dekat.'
    ),
    jsonb_build_object(
      'date', '2022',
      'title', 'Mulai Berjuang Bersama',
      'text', 'Melewati jarak dan waktu, kami belajar bahwa rasa cukup itu tumbuh dari saling percaya.'
    ),
    jsonb_build_object(
      'date', '2026',
      'title', 'Memilih Selamanya',
      'text', 'Dengan doa dan restu keluarga, kami memutuskan melangkah ke jenjang yang lebih serius.'
    )
  ),
  'gift', jsonb_build_array(
    jsonb_build_object(
      'bank', 'BCA',
      'number', '1234567890',
      'holder', 'Aditya Pratama'
    ),
    jsonb_build_object(
      'bank', 'Mandiri',
      'number', '0987654321',
      'holder', 'Ayu Lestari'
    )
  ),
  'giftAddress', 'Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan (a.n. Aditya Pratama)',
  'waMessage', 'Halo {guest}, kami mengundang Anda ke pernikahan kami. Buka link: {url}'
),
updated_at = now()
where slug = 'default';

-- 2. Contoh update parsial hanya data mempelai (groom & bride)
-- update public.invitations
-- set content = jsonb_set(
--   jsonb_set(content, '{groom,fullName}', '"Aditya Pratama S.T."'),
--   '{bride,fullName}', '"Ayu Lestari S.E."'
-- )
-- where slug = 'default';
