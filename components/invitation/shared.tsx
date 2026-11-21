"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Check, Copy, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";
import { countdownParts, formatDate, formatTime } from "@/lib/format";
import type { EventInfo, GiftAccount } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";
import { toneStyles, type Tone } from "./theme";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  tone?: Tone;
}) {
  return (
    <div className="text-center">
      {eyebrow ? (
        <p
          className={`text-[11px] uppercase tracking-[0.35em] ${
            tone === "light" ? "text-sage" : "text-gold/80"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`mt-3 font-serif text-3xl sm:text-4xl ${
          tone === "light" ? "text-ink" : "text-cream"
        }`}
      >
        {title}
      </h2>
      <div className="mx-auto mt-4 flex items-center justify-center gap-2">
        <span className={`h-px w-10 ${tone === "light" ? "bg-sage/40" : "bg-gold/40"}`} />
        <span className={`size-1.5 rotate-45 ${tone === "light" ? "bg-gold" : "bg-gold"}`} />
        <span className={`h-px w-10 ${tone === "light" ? "bg-sage/40" : "bg-gold/40"}`} />
      </div>
    </div>
  );
}

export function Countdown({ target, tone = "light" }: { target: string; tone?: Tone }) {
  const [parts, setParts] = useState(() => ({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    done: false,
  }));

  useEffect(() => {
    const update = () => setParts(countdownParts(target));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [target]);

  const boxes: Array<[string, number]> = [
    ["Hari", parts.days],
    ["Jam", parts.hours],
    ["Menit", parts.minutes],
    ["Detik", parts.seconds],
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {boxes.map(([label, value]) => (
        <div
          key={label}
          className={`rounded-2xl px-1 py-4 text-center backdrop-blur ${
            tone === "light" ? "bg-white/60 shadow-sm ring-1 ring-ink/5" : "bg-white/[0.05] ring-1 ring-gold/20"
          }`}
        >
          <div
            className={`font-serif text-2xl tabular-nums sm:text-4xl ${
              tone === "light" ? "text-ink" : "text-gold"
            }`}
          >
            {String(value).padStart(2, "0")}
          </div>
          <div
            className={`mt-1 text-[10px] uppercase tracking-[0.2em] ${
              tone === "light" ? "text-ink/50" : "text-cream/50"
            }`}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

export function EventCard({ event, tone = "light" }: { event: EventInfo; tone?: Tone }) {
  const s = toneStyles[tone];
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`rounded-3xl p-6 text-center ${s.card}`}
    >
      <p className={`text-[11px] uppercase tracking-[0.3em] ${s.accent}`}>{event.kind}</p>
      <p className={`mt-3 font-serif text-xl ${tone === "light" ? "text-ink" : "text-cream"}`}>
        {formatDate(event.date)}
      </p>
      <div className={`mt-1 flex items-center justify-center gap-1.5 text-sm ${s.muted}`}>
        <CalendarDays size={14} /> {formatTime(event.date)}
      </div>
      <p className={`mt-4 font-medium ${tone === "light" ? "text-ink" : "text-cream"}`}>{event.place}</p>
      <p className={`mt-1 text-sm leading-relaxed ${s.muted}`}>{event.address}</p>
      <a
        href={event.mapsUrl}
        target="_blank"
        rel="noreferrer"
        className={`mt-5 inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition active:scale-[0.97] ${s.primary}`}
      >
        <MapPin size={16} /> Lihat Lokasi
      </a>
    </motion.div>
  );
}

export function LoveStory({
  items,
  tone = "light",
}: {
  items: { date: string; title: string; text: string }[];
  tone?: Tone;
}) {
  const s = toneStyles[tone];
  return (
    <div className="relative mx-auto max-w-xl">
      <span className={`absolute left-[7px] top-2 h-[calc(100%-16px)] w-px ${s.line}`} />
      <div className="space-y-8">
        {items.map((item, index) => (
          <Reveal key={`${item.title}-${index}`} delay={index * 0.08} className="relative pl-9">
            <span
              className={`absolute left-0 top-1.5 size-[15px] rounded-full border-2 ${
                tone === "light" ? "border-sage bg-cream" : "border-gold bg-luxury"
              }`}
            />
            <p className={`text-xs uppercase tracking-[0.25em] ${s.accent}`}>{item.date}</p>
            <p className={`mt-1 font-serif text-lg ${tone === "light" ? "text-ink" : "text-cream"}`}>
              {item.title}
            </p>
            <p className={`mt-1 text-sm leading-relaxed ${s.muted}`}>{item.text}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function Gallery({ photos, tone = "light" }: { photos: string[]; tone?: Tone }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
        {photos.map((src, index) => (
          <motion.button
            key={src + index}
            type="button"
            onClick={() => setActive(src)}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.04 }}
            whileTap={{ scale: 0.97 }}
            className={`group relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl ${
              tone === "light" ? "bg-cream-deep" : "bg-luxury-soft"
            }`}
            aria-label="Perbesar foto"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Galeri ${index + 1}`}
              className="size-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4"
            onClick={() => setActive(null)}
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              src={active}
              alt="Foto galeri"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain"
            />
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-5 top-5 rounded-full bg-white/15 p-3 text-white backdrop-blur transition active:scale-95"
              aria-label="Tutup"
            >
              <X size={20} />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function GiftList({
  accounts,
  address,
  tone = "light",
}: {
  accounts: GiftAccount[];
  address?: string;
  tone?: Tone;
}) {
  const s = toneStyles[tone];
  const toast = useToast();
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      toast("Nomor rekening disalin");
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast("Gagal menyalin, salin manual ya", "error");
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-3">
      {accounts.map((account) => (
        <div key={account.number} className={`flex items-center gap-3 rounded-2xl p-4 ${s.card}`}>
          <div className="flex-1">
            <p className={`text-[11px] uppercase tracking-[0.25em] ${s.accent}`}>{account.bank}</p>
            <p className={`mt-1 font-mono text-lg tracking-wide ${tone === "light" ? "text-ink" : "text-cream"}`}>
              {account.number}
            </p>
            <p className={`text-xs ${s.muted}`}>a.n. {account.holder}</p>
          </div>
          <button
            type="button"
            onClick={() => copy(account.number)}
            className={`flex min-h-11 min-w-11 items-center justify-center rounded-full transition active:scale-95 ${s.chip}`}
            aria-label={`Salin nomor ${account.bank}`}
          >
            {copied === account.number ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
          </button>
        </div>
      ))}
      {address ? (
        <div className={`rounded-2xl p-4 text-center text-sm ${s.card}`}>
          <p className={`text-[11px] uppercase tracking-[0.25em] ${s.accent}`}>Kirim hadiah</p>
          <p className={`mt-2 leading-relaxed ${s.muted}`}>{address}</p>
        </div>
      ) : null}
    </div>
  );
}
