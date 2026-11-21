import type { InvitationContent } from "@/lib/types";

/**
 * Data acara & mempelai. Dipakai sebagai nilai awal saat undangan pertama dibuat,
 * dan sebagai fallback tampilan jika Supabase belum dikonfigurasi.
 * shortcut: satu sumber config global; pindah ke editor JSONB di dashboard saat dipakai multi-user.
 */
export const weddingConfig: InvitationContent = {
  quote: {
    text: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu dapat ketenangan hati dan menjadikan kasih sayang di antara kamu.",
    source: "QS. Ar-Rum: 21",
  },
  groom: {
    name: "Aditya",
    fullName: "Aditya Pratama",
    father: "Bapak Sutrisno",
    mother: "Ibu Siti Rahayu",
    instagram: "adityapratama",
  },
  bride: {
    name: "Ayu",
    fullName: "Ayu Lestari",
    father: "Bapak Hartono",
    mother: "Ibu Dewi Kartika",
    instagram: "ayulestari",
  },
  events: [
    {
      kind: "Akad Nikah",
      date: "2026-12-12T08:00:00+07:00",
      place: "Masjid Al-Ikhlas",
      address: "Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan",
      mapsUrl: "https://maps.google.com/?q=Masjid+Al-Ikhlas+Jakarta",
    },
    {
      kind: "Resepsi",
      date: "2026-12-12T11:00:00+07:00",
      place: "Gedung Graha Indah",
      address: "Jl. Anggrek No. 45, Kebayoran Baru, Jakarta Selatan",
      mapsUrl: "https://maps.google.com/?q=Gedung+Graha+Indah+Jakarta",
    },
  ],
  loveStory: [
    {
      date: "2019",
      title: "Pertemuan Pertama",
      text: "Berawal dari teman satu kelompok di kampus, obrolan panjang membuat kami semakin dekat.",
    },
    {
      date: "2022",
      title: "Mulai Berjuang Bersama",
      text: "Melewati jarak dan waktu, kami belajar bahwa rasa cukup itu tumbuh dari saling percaya.",
    },
    {
      date: "2026",
      title: "Memilih Selamanya",
      text: "Dengan doa dan restu keluarga, kami memutuskan melangkah ke jenjang yang lebih serius.",
    },
  ],
  gift: [
    {
      bank: "BCA",
      number: "1234567890",
      holder: "Aditya Pratama",
    },
    {
      bank: "Mandiri",
      number: "0987654321",
      holder: "Ayu Lestari",
    },
  ],
  giftAddress: "Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan (a.n. Aditya Pratama)",
  gallery: [],
  photos: { cover: "", groom: "", bride: "" },
  waMessage:
    "Assalamualaikum {guest} 🌸\n\nTanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di pernikahan kami:\n\n{url}\n\nMerupakan suatu kehormatan bagi kami apabila Anda berkenan hadir. Terima kasih.",
};

/** Dipakai jika kolom active_music_url masih kosong. */
export const defaultMusicUrl = "";
