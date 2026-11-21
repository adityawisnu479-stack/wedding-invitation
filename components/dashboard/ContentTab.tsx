"use client";

import { motion } from "framer-motion";
import { Calendar, Heart, Loader2, MapPin, Plus, Save, Sparkles, Trash2, Users, Wallet } from "lucide-react";
import { useState } from "react";
import type { EventItem, InvitationContent, LoveStoryItem, Person } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";
import { useDashboardStore } from "./DashboardStoreContext";
import { cardClass, inputClass, labelClass, primaryBtn } from "./styles";

/** Konversi string tanggal/ISO ke format YYYY-MM-DDTHH:mm untuk input type="datetime-local" */
function toDatetimeLocal(isoOrDateStr: string): string {
  try {
    const d = new Date(isoOrDateStr);
    if (isNaN(d.getTime())) return "";
    // Format YYYY-MM-DDTHH:mm lokal
    const pad = (n: number) => String(n).padStart(2, "0");
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return "";
  }
}

/** Konversi nilai input datetime-local kembali ke ISO 8601 string dengan timezone Jakarta (+07:00) */
function fromDatetimeLocal(val: string): string {
  if (!val) return "";
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return d.toISOString();
  } catch {
    return val;
  }
}

export function ContentTab() {
  const toast = useToast();
  const { invitation, actions, savingKey } = useDashboardStore();
  const { content } = invitation;

  // Local states for sections
  const [groom, setGroom] = useState<Person>(content.groom);
  const [bride, setBride] = useState<Person>(content.bride);
  const [quote, setQuote] = useState(content.quote);
  const [events, setEvents] = useState<EventItem[]>(content.events);
  const [loveStory, setLoveStory] = useState<LoveStoryItem[]>(content.loveStory);
  const [giftAccounts, setGiftAccounts] = useState(content.gift);
  const [giftAddress, setGiftAddress] = useState(content.giftAddress || "");
  const [waMessage, setWaMessage] = useState(content.waMessage || "");

  const saveSection = async (patch: Partial<InvitationContent>, key: string, label: string) => {
    const res = await actions.updateContent(patch, key);
    if (!res.success) {
      toast(res.error || `Gagal menyimpan ${label}`, "error");
      return;
    }
    toast(`${label} berhasil disimpan`);
  };

  // Event handlers
  const handleEventChange = (index: number, field: keyof EventItem, value: string) => {
    setEvents((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addEvent = () => {
    setEvents((prev) => [
      ...prev,
      {
        kind: "Acara Tambahan",
        date: new Date().toISOString(),
        place: "Nama Tempat",
        address: "Alamat Tempat",
        mapsUrl: "",
      },
    ]);
  };

  const removeEvent = (index: number) => {
    setEvents((prev) => prev.filter((_, i) => i !== index));
  };

  // Love Story handlers
  const handleStoryChange = (index: number, field: keyof LoveStoryItem, value: string) => {
    setLoveStory((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addStory = () => {
    setLoveStory((prev) => [
      ...prev,
      {
        date: new Date().getFullYear().toString(),
        title: "Momen Baru",
        text: "Ceritakan momen berharga perjalanan kalian di sini.",
      },
    ]);
  };

  const removeStory = (index: number) => {
    setLoveStory((prev) => prev.filter((_, i) => i !== index));
  };

  // Gift handlers
  const handleGiftChange = (index: number, field: "bank" | "number" | "holder", value: string) => {
    setGiftAccounts((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addGiftAccount = () => {
    setGiftAccounts((prev) => [
      ...prev,
      {
        bank: "BCA",
        number: "",
        holder: `${groom.name} / ${bride.name}`,
      },
    ]);
  };

  const removeGiftAccount = (index: number) => {
    setGiftAccounts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* 1. Data Mempelai */}
      <section className={cardClass}>
        <div className="flex items-center justify-between border-b border-ink/5 pb-3">
          <div className="flex items-center gap-2">
            <Users className="text-sage" size={18} />
            <h2 className="text-sm font-semibold">Data Mempelai</h2>
          </div>
          <button
            type="button"
            onClick={() => saveSection({ groom, bride }, "couple", "Data Mempelai")}
            disabled={savingKey === "couple"}
            className={`${primaryBtn} min-h-9 px-3 text-xs`}
          >
            {savingKey === "couple" ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            Simpan Mempelai
          </button>
        </div>

        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          {/* Groom */}
          <div className="space-y-3 rounded-xl bg-ink/[0.02] p-4 border border-ink/5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-sage">Mempelai Pria</h3>
            <label className="block">
              <span className={labelClass}>Nama Panggilan</span>
              <input
                value={groom.name}
                onChange={(e) => setGroom({ ...groom, name: e.target.value })}
                placeholder="Aditya"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Nama Lengkap & Gelar</span>
              <input
                value={groom.fullName}
                onChange={(e) => setGroom({ ...groom, fullName: e.target.value })}
                placeholder="Aditya Pratama S.T."
                className={inputClass}
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className={labelClass}>Nama Ayah</span>
                <input
                  value={groom.father}
                  onChange={(e) => setGroom({ ...groom, father: e.target.value })}
                  placeholder="Bpk. Sutrisno"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Nama Ibu</span>
                <input
                  value={groom.mother}
                  onChange={(e) => setGroom({ ...groom, mother: e.target.value })}
                  placeholder="Ibu Siti"
                  className={inputClass}
                />
              </label>
            </div>
            <label className="block">
              <span className={labelClass}>Username Instagram (tanpa @)</span>
              <input
                value={groom.instagram || ""}
                onChange={(e) => setGroom({ ...groom, instagram: e.target.value })}
                placeholder="adityapratama"
                className={inputClass}
              />
            </label>
          </div>

          {/* Bride */}
          <div className="space-y-3 rounded-xl bg-ink/[0.02] p-4 border border-ink/5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-sage">Mempelai Wanita</h3>
            <label className="block">
              <span className={labelClass}>Nama Panggilan</span>
              <input
                value={bride.name}
                onChange={(e) => setBride({ ...bride, name: e.target.value })}
                placeholder="Ayu"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Nama Lengkap & Gelar</span>
              <input
                value={bride.fullName}
                onChange={(e) => setBride({ ...bride, fullName: e.target.value })}
                placeholder="Ayu Lestari S.E."
                className={inputClass}
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className={labelClass}>Nama Ayah</span>
                <input
                  value={bride.father}
                  onChange={(e) => setBride({ ...bride, father: e.target.value })}
                  placeholder="Bpk. Hartono"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Nama Ibu</span>
                <input
                  value={bride.mother}
                  onChange={(e) => setBride({ ...bride, mother: e.target.value })}
                  placeholder="Ibu Dewi"
                  className={inputClass}
                />
              </label>
            </div>
            <label className="block">
              <span className={labelClass}>Username Instagram (tanpa @)</span>
              <input
                value={bride.instagram || ""}
                onChange={(e) => setBride({ ...bride, instagram: e.target.value })}
                placeholder="ayulestari"
                className={inputClass}
              />
            </label>
          </div>
        </div>
      </section>

      {/* 2. Rangkaian Acara */}
      <section className={cardClass}>
        <div className="flex items-center justify-between border-b border-ink/5 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="text-sage" size={18} />
            <h2 className="text-sm font-semibold">Rangkaian Acara</h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addEvent}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-ink/15 px-3 text-xs font-medium text-ink/75 hover:bg-ink/5"
            >
              <Plus size={13} /> Tambah Acara
            </button>
            <button
              type="button"
              onClick={() => saveSection({ events }, "events", "Rangkaian Acara")}
              disabled={savingKey === "events"}
              className={`${primaryBtn} min-h-9 px-3 text-xs`}
            >
              {savingKey === "events" ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              Simpan Acara
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {events.map((event, index) => (
            <div key={index} className="relative rounded-xl border border-ink/10 p-4 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sage">Acara #{index + 1}</span>
                {events.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeEvent(index)}
                    className="p-1 text-ink/40 hover:text-rose-600 transition"
                    title="Hapus Acara"
                  >
                    <Trash2 size={14} />
                  </button>
                ) : null}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Nama Acara</span>
                  <input
                    value={event.kind}
                    onChange={(e) => handleEventChange(index, "kind", e.target.value)}
                    placeholder="Akad Nikah / Resepsi"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Pilih Tanggal & Waktu Acara</span>
                  <input
                    type="datetime-local"
                    value={toDatetimeLocal(event.date)}
                    onChange={(e) => handleEventChange(index, "date", fromDatetimeLocal(e.target.value))}
                    className={`${inputClass} cursor-pointer`}
                  />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Nama Tempat / Gedung</span>
                  <input
                    value={event.place}
                    onChange={(e) => handleEventChange(index, "place", e.target.value)}
                    placeholder="Masjid Al-Ikhlas"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Link Google Maps</span>
                  <input
                    value={event.mapsUrl || ""}
                    onChange={(e) => handleEventChange(index, "mapsUrl", e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className={inputClass}
                  />
                </label>
              </div>
              <label className="block">
                <span className={labelClass}>Alamat Lengkap</span>
                <input
                  value={event.address}
                  onChange={(e) => handleEventChange(index, "address", e.target.value)}
                  placeholder="Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan"
                  className={inputClass}
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Cerita Cinta (Love Story) */}
      <section className={cardClass}>
        <div className="flex items-center justify-between border-b border-ink/5 pb-3">
          <div className="flex items-center gap-2">
            <Heart className="text-sage" size={18} />
            <h2 className="text-sm font-semibold">Love Story (Cerita Cinta)</h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addStory}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-ink/15 px-3 text-xs font-medium text-ink/75 hover:bg-ink/5"
            >
              <Plus size={13} /> Tambah Momen
            </button>
            <button
              type="button"
              onClick={() => saveSection({ loveStory }, "story", "Love Story")}
              disabled={savingKey === "story"}
              className={`${primaryBtn} min-h-9 px-3 text-xs`}
            >
              {savingKey === "story" ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              Simpan Cerita
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {loveStory.map((story, index) => (
            <div key={index} className="relative rounded-xl border border-ink/10 p-4 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sage">Momen #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeStory(index)}
                  className="p-1 text-ink/40 hover:text-rose-600 transition"
                  title="Hapus Momen"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
                <label className="block">
                  <span className={labelClass}>Tahun / Waktu</span>
                  <input
                    value={story.date}
                    onChange={(e) => handleStoryChange(index, "date", e.target.value)}
                    placeholder="2022"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Judul Momen</span>
                  <input
                    value={story.title}
                    onChange={(e) => handleStoryChange(index, "title", e.target.value)}
                    placeholder="Pertemuan Pertama"
                    className={inputClass}
                  />
                </label>
              </div>
              <label className="block">
                <span className={labelClass}>Cerita Singkat</span>
                <textarea
                  value={story.text}
                  onChange={(e) => handleStoryChange(index, "text", e.target.value)}
                  rows={2}
                  placeholder="Tuliskan kisah perjalanan kalian..."
                  className={`${inputClass} resize-none py-2`}
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Amplop Digital (Gift) & Kutipan */}
      <section className={cardClass}>
        <div className="flex items-center justify-between border-b border-ink/5 pb-3">
          <div className="flex items-center gap-2">
            <Wallet className="text-sage" size={18} />
            <h2 className="text-sm font-semibold">Amplop Digital & Kutipan</h2>
          </div>
          <button
            type="button"
            onClick={() =>
              saveSection(
                { gift: giftAccounts, giftAddress, quote, waMessage },
                "gift-quote",
                "Amplop & Kutipan",
              )
            }
            disabled={savingKey === "gift-quote"}
            className={`${primaryBtn} min-h-9 px-3 text-xs`}
          >
            {savingKey === "gift-quote" ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            Simpan Amplop & Kutipan
          </button>
        </div>

        {/* Kutipan */}
        <div className="mt-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sage">Kutipan / Doa (Quote)</h3>
          <label className="block">
            <span className={labelClass}>Teks Kutipan</span>
            <textarea
              value={quote.text}
              onChange={(e) => setQuote({ ...quote, text: e.target.value })}
              rows={3}
              className={`${inputClass} resize-none py-2`}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Sumber Kutipan</span>
            <input
              value={quote.source}
              onChange={(e) => setQuote({ ...quote, source: e.target.value })}
              placeholder="QS. Ar-Rum: 21"
              className={inputClass}
            />
          </label>
        </div>

        {/* Daftar Rekening Bank */}
        <div className="mt-6 space-y-3 border-t border-ink/5 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-sage">Rekening Bank / E-Wallet</h3>
            <button
              type="button"
              onClick={addGiftAccount}
              className="inline-flex items-center gap-1 text-xs text-sage font-medium hover:underline"
            >
              <Plus size={13} /> Tambah Rekening
            </button>
          </div>
          {giftAccounts.map((acc, index) => (
            <div key={index} className="grid grid-cols-[100px_1fr_1fr_auto] gap-2 items-center">
              <input
                value={acc.bank}
                onChange={(e) => handleGiftChange(index, "bank", e.target.value)}
                placeholder="BCA"
                className={inputClass}
              />
              <input
                value={acc.number}
                onChange={(e) => handleGiftChange(index, "number", e.target.value)}
                placeholder="Nomor Rekening"
                className={inputClass}
              />
              <input
                value={acc.holder}
                onChange={(e) => handleGiftChange(index, "holder", e.target.value)}
                placeholder="Nama Pemilik"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => removeGiftAccount(index)}
                className="p-2 text-ink/40 hover:text-rose-600 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <label className="block pt-2">
            <span className={labelClass}>Alamat Pengiriman Kado Fisik</span>
            <input
              value={giftAddress}
              onChange={(e) => setGiftAddress(e.target.value)}
              placeholder="Alamat lengkap pengiriman kado..."
              className={inputClass}
            />
          </label>

          <label className="block pt-2">
            <span className={labelClass}>Template Pesan Undangan WhatsApp</span>
            <textarea
              value={waMessage}
              onChange={(e) => setWaMessage(e.target.value)}
              rows={2}
              placeholder="Gunakan {guest} untuk nama tamu dan {url} untuk link undangan."
              className={`${inputClass} resize-none py-2`}
            />
          </label>
        </div>
      </section>
    </div>
  );
}
