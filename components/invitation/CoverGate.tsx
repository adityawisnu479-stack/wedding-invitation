"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, MailOpen } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { InvitationContent } from "@/lib/types";
import type { TemplateTheme } from "./template-engine/types";

export function CoverGate({
  content,
  theme,
  guestName,
  onOpen,
}: {
  content: InvitationContent;
  theme: TemplateTheme;
  guestName?: string;
  onOpen: () => void;
}) {
  const reduced = useReducedMotion();
  const cover = content.photos.cover;
  const { coverStyles, tone } = theme;

  return (
    <motion.section
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 text-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {cover ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt="Foto sampul" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-black/45" />
        </>
      ) : (
        <div className={`absolute inset-0 ${coverStyles.backgroundClass}`} />
      )}

      {coverStyles.ornamentClass ? (
        <div className={`absolute inset-5 rounded-[28px] ${coverStyles.ornamentClass}`} />
      ) : null}

      <div className={`relative z-10 ${cover ? "text-white" : tone === "dark" ? "text-cream" : "text-ink"}`}>
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className={`text-[11px] uppercase tracking-[0.45em] ${coverStyles.eyebrowClass || ""}`}
        >
          The Wedding Of
        </motion.p>

        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className={`mt-4 font-serif text-5xl leading-[1.05] sm:text-6xl ${coverStyles.titleFontClass || ""}`}
        >
          {content.groom.name}
          <span className={`mx-2 inline-block text-3xl ${coverStyles.ampersandClass || "opacity-60"}`}>&</span>
          {content.bride.name}
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-4 text-sm tracking-[0.2em] opacity-80"
        >
          {formatDate(content.events[0].date)}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-10 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 backdrop-blur-md"
        >
          <p className="text-[10px] uppercase tracking-[0.25em] opacity-70">Kepada</p>
          <p className="mt-1 text-base font-medium">{guestName || "Bapak / Ibu / Saudara / i"}</p>
        </motion.div>

        <motion.button
          type="button"
          onClick={onOpen}
          whileTap={{ scale: 0.97 }}
          whileHover={{ y: -2 }}
          className={`mt-6 inline-flex min-h-12 items-center gap-2 rounded-full px-7 text-sm font-semibold shadow-lg transition ${coverStyles.buttonClass}`}
        >
          <MailOpen size={17} /> Buka Undangan
        </motion.button>

        <motion.div
          animate={reduced ? undefined : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          className="mt-10 flex justify-center opacity-60"
        >
          <ChevronDown size={20} />
        </motion.div>
      </div>
    </motion.section>
  );
}
