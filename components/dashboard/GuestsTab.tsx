"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Loader2, MessageCircle, Plus, Search, Trash2, Upload, UserPlus, X } from "lucide-react";
import { inviteUrl, messageForGuest, parseGuestLines, waShareUrl } from "@/lib/format";
import { useDashboardStore } from "./DashboardStoreContext";
import { cardClass, iconBtn, inputClass, labelClass, primaryBtn } from "./styles";
import { useGuestManagement } from "./useGuestManagement";

export function GuestsTab({
  waMessage,
  slug,
}: {
  waMessage: string;
  slug: string;
}) {
  const { guests } = useDashboardStore();
  const {
    query,
    setQuery,
    filteredGuests,
    pending,
    form,
    bulk,
    actions,
  } = useGuestManagement({ slug });

  const origin = typeof window === "undefined" ? "" : window.location.origin;

  return (
    <div className="space-y-4">
      <div className={cardClass}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Tambah tamu</h2>
          <button
            type="button"
            onClick={() => bulk.setIsOpen(!bulk.isOpen)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-sage transition hover:bg-sage/10"
          >
            {bulk.isOpen ? <X size={14} /> : <Upload size={14} />}
            {bulk.isOpen ? "Tutup" : "Tempel massal"}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {bulk.isOpen ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2">
                <textarea
                  value={bulk.text}
                  onChange={(event) => bulk.setText(event.target.value)}
                  rows={5}
                  placeholder={"Satu tamu per baris. Contoh:\nBudi Santoso\nSari, 08123456789\nAndi\tKantor\t08129876543"}
                  className={`${inputClass} resize-none py-2.5 font-mono text-xs`}
                />
                <button type="button" onClick={bulk.submit} disabled={pending} className={primaryBtn}>
                  {pending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  Tambah {parseGuestLines(bulk.text).length || ""} tamu
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <form onSubmit={form.submit} className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Nama tamu</span>
              <input
                value={form.name}
                onChange={(event) => form.setName(event.target.value)}
                placeholder="Budi & Partner"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Nomor WhatsApp (opsional)</span>
              <input
                value={form.phone}
                onChange={(event) => form.setPhone(event.target.value)}
                inputMode="tel"
                placeholder="08123456789"
                className={inputClass}
              />
            </label>
          </div>
          <label className="block">
            <span className={labelClass}>Kategori</span>
            <input
              value={form.category}
              onChange={(event) => form.setCategory(event.target.value)}
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

        {filteredGuests.length === 0 ? (
          <div className="py-14 text-center">
            <UserPlus className="mx-auto text-ink/20" size={30} />
            <p className="mt-3 text-sm text-ink/50">
              {guests.length === 0 ? "Belum ada tamu di daftar." : "Tidak ada tamu yang cocok dengan pencarian."}
            </p>
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-ink/5">
            <AnimatePresence initial={false}>
              {filteredGuests.map((guest) => (
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
                    <button type="button" className={iconBtn} onClick={() => actions.copyLink(guest)} title="Salin link">
                      <Copy size={15} />
                    </button>
                    <a
                      className={iconBtn}
                      href={waShareUrl(guest.phone, messageForGuest(waMessage, guest.name, inviteUrl(origin, slug, guest.name)))}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => actions.markSent(guest)}
                      title="Kirim WhatsApp"
                    >
                      <MessageCircle size={15} />
                    </a>
                    <button
                      type="button"
                      className={`${iconBtn} ${guest.is_sent ? "text-emerald-600" : ""}`}
                      onClick={() => actions.markSent(guest)}
                      title={guest.is_sent ? "Tandai belum terkirim" : "Tandai sudah terkirim"}
                    >
                      <Check size={15} />
                    </button>
                    <button
                      type="button"
                      className={`${iconBtn} hover:text-rose-600`}
                      onClick={() => actions.remove(guest)}
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
