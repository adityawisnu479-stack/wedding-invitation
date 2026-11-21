"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Loader2, MessageCircle, Plus, Search, Trash2, Upload, UserPlus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { inviteUrl, messageForGuest, parseGuestLines, waShareUrl } from "@/lib/format";
import type { Guest } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";
import { useDashboardStore } from "./DashboardStoreContext";
import { cardClass, iconBtn, inputClass, labelClass, primaryBtn } from "./styles";

export function GuestsTab({
  waMessage,
  slug,
}: {
  waMessage: string;
  slug: string;
}) {
  const toast = useToast();
  const { guests, actions } = useDashboardStore();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Reguler");
  const [phone, setPhone] = useState("");
  const [bulk, setBulk] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);

  const origin = typeof window === "undefined" ? "" : window.location.origin;

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return guests;
    return guests.filter(
      (guest) =>
        guest.name.toLowerCase().includes(term) ||
        guest.category.toLowerCase().includes(term) ||
        (guest.phone ?? "").includes(term),
    );
  }, [guests, query]);

  const insert = async (rows: { name: string; category: string; phone: string | null }[]) => {
    if (rows.length === 0) return toast("Tidak ada nama yang bisa ditambahkan", "error");

    setPending(true);
    const res = await actions.addGuests(rows);
    setPending(false);

    if (!res.success) return toast(res.error || "Gagal menambah tamu", "error");
    toast(`${rows.length} tamu ditambahkan`);
  };

  const addSingle = async (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2) return toast("Nama tamu minimal 2 karakter", "error");
    await insert([{ name: name.trim(), category: category.trim() || "Reguler", phone: phone.trim() || null }]);
    setName("");
    setPhone("");
  };

  const addBulk = async () => {
    const rows = parseGuestLines(bulk);
    await insert(rows);
    setBulk("");
    setShowBulk(false);
  };

  const copyLink = async (guest: Guest) => {
    try {
      await navigator.clipboard.writeText(inviteUrl(origin, slug, guest.name));
      toast(`Link ${guest.name} disalin`);
    } catch {
      toast("Gagal menyalin link", "error");
    }
  };

  const markSent = async (guest: Guest) => {
    const res = await actions.toggleGuestSent(guest);
    if (!res.success) return toast(res.error || "Gagal memperbarui status", "error");
  };

  const remove = async (guest: Guest) => {
    if (!window.confirm(`Hapus ${guest.name} dari daftar tamu?`)) return;
    const res = await actions.removeGuest(guest);
    if (!res.success) return toast(res.error || "Gagal menghapus tamu", "error");
    toast("Tamu dihapus");
  };

  return (
    <div className="space-y-4">
      <div className={cardClass}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Tambah tamu</h2>
          <button
            type="button"
            onClick={() => setShowBulk((value) => !value)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-sage transition hover:bg-sage/10"
          >
            {showBulk ? <X size={14} /> : <Upload size={14} />}
            {showBulk ? "Tutup" : "Tempel massal"}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {showBulk ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2">
                <textarea
                  value={bulk}
                  onChange={(event) => setBulk(event.target.value)}
                  rows={5}
                  placeholder={"Satu tamu per baris. Contoh:\nBudi Santoso\nSari, 08123456789\nAndi\tKantor\t08129876543"}
                  className={`${inputClass} resize-none py-2.5 font-mono text-xs`}
                />
                <button type="button" onClick={addBulk} disabled={pending} className={primaryBtn}>
                  {pending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  Tambah {parseGuestLines(bulk).length || ""} tamu
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <form onSubmit={addSingle} className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Nama tamu</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Budi & Partner"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Nomor WhatsApp (opsional)</span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                inputMode="tel"
                placeholder="08123456789"
                className={inputClass}
              />
            </label>
          </div>
          <label className="block">
            <span className={labelClass}>Kategori</span>
            <input
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              list="kategori-tamu"
              className={inputClass}
            />
            <datalist id="kategori-tamu">
              {["Reguler", "Keluarga", "Kantor", "VIP"].map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </label>
          <button type="submit" disabled={pending} className={primaryBtn}>
            {pending ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
            Tambah tamu
          </button>
        </form>
      </div>

      <div className={cardClass}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">Daftar tamu ({guests.length})</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari tamu"
              className={`${inputClass} min-h-10 pl-8`}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-14 text-center">
            <UserPlus className="mx-auto text-ink/20" size={30} />
            <p className="mt-3 text-sm text-ink/50">
              {guests.length === 0 ? "Belum ada tamu di daftar." : "Tidak ada tamu yang cocok dengan pencarian."}
            </p>
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-ink/5">
            <AnimatePresence initial={false}>
              {filtered.map((guest) => (
                <motion.li
                  key={guest.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{guest.name}</p>
                      <span className="shrink-0 rounded-full bg-ink/5 px-2 py-0.5 text-[10px] text-ink/50">
                        {guest.category}
                      </span>
                      {guest.is_sent ? (
                        <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-600">
                          terkirim
                        </span>
                      ) : null}
                    </div>
                    {guest.phone ? <p className="text-xs text-ink/40">+{guest.phone}</p> : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <button type="button" className={iconBtn} onClick={() => copyLink(guest)} title="Salin link">
                      <Copy size={15} />
                    </button>
                    <a
                      className={iconBtn}
                      href={waShareUrl(guest.phone, messageForGuest(waMessage, guest.name, inviteUrl(origin, slug, guest.name)))}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => markSent(guest)}
                      title="Kirim WhatsApp"
                    >
                      <MessageCircle size={15} />
                    </a>
                    <button
                      type="button"
                      className={`${iconBtn} ${guest.is_sent ? "text-emerald-600" : ""}`}
                      onClick={() => markSent(guest)}
                      title={guest.is_sent ? "Tandai belum terkirim" : "Tandai sudah terkirim"}
                    >
                      <Check size={15} />
                    </button>
                    <button
                      type="button"
                      className={`${iconBtn} hover:text-rose-600`}
                      onClick={() => remove(guest)}
                      title="Hapus"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      <p className="px-1 text-xs text-ink/40">
        Salin link lalu tempel manual, atau pakai tombol WhatsApp untuk membuka chat dengan pesan undangan siap kirim.
      </p>
    </div>
  );
}
