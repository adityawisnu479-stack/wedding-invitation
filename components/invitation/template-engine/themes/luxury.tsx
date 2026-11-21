"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AtSign } from "lucide-react";
import { formatDate } from "@/lib/format";
import { Reveal } from "../../shared";
import type { CoupleCardProps, HeroSectionProps, TemplateTheme } from "../types";

function LuxuryHero({ invitation, guestName }: HeroSectionProps) {
  const reduced = useReducedMotion();
  const { content } = invitation;
  const cover = content.photos.cover;

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {cover ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt="Foto sampul" className="absolute inset-0 size-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury/70 via-luxury/40 to-luxury" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#1e3a30,#0d1a16_65%)]" />
      )}

      <div className="ornament-frame absolute inset-5 rounded-sm opacity-50 sm:inset-8" />

      <div className="relative z-10">
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="mx-auto flex size-16 items-center justify-center rounded-full border border-gold/40"
        >
          <span className="font-display text-lg text-gold">
            {content.groom.name.charAt(0)}
            {content.bride.name.charAt(0)}
          </span>
        </motion.div>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-7 text-[10px] uppercase tracking-[0.5em] text-gold/80"
        >
          The Wedding Celebration
        </motion.p>

        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 font-display text-5xl leading-[1.1] sm:text-7xl"
        >
          {content.groom.name}
          <span className="mx-3 align-middle font-serif text-3xl italic text-gold">&</span>
          {content.bride.name}
        </motion.h1>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mx-auto mt-7 flex items-center justify-center gap-3"
        >
          <span className="h-px w-12 bg-gold/40" />
          <p className="text-xs uppercase tracking-[0.3em] text-cream/70">{formatDate(content.events[0].date)}</p>
          <span className="h-px w-12 bg-gold/40" />
        </motion.div>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="mt-10 text-[10px] uppercase tracking-[0.3em] text-cream/45"
        >
          Kepada {guestName || "Bapak / Ibu / Saudara / i"}
        </motion.p>
      </div>
    </section>
  );
}

function LuxuryCoupleCard({ person, photo, role, delay }: CoupleCardProps) {
  return (
    <Reveal delay={delay} className="text-center">
      <div className="relative mx-auto size-44 overflow-hidden rounded-full ring-1 ring-gold/40 sm:size-52">
        {photo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={photo} alt={person.fullName} className="size-full object-cover" loading="lazy" />
        ) : (
          <div className="flex size-full items-center justify-center bg-luxury-soft">
            <span className="font-display text-5xl text-gold/50">{person.name.charAt(0)}</span>
          </div>
        )}
        <span className="pointer-events-none absolute inset-2 rounded-full border border-gold/30" />
      </div>
      <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-gold/70">{role}</p>
      <p className="mt-2 font-display text-2xl">{person.fullName || person.name}</p>
      <p className="mt-2 text-sm leading-relaxed text-cream/55">
        Putra/Putri dari
        <br />
        {person.father} & {person.mother}
      </p>
      {person.instagram ? (
        <a
          href={`https://instagram.com/${person.instagram.replace(/^@+/, "")}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-xs text-gold/80 transition hover:bg-gold/10"
        >
          <AtSign size={14} /> {person.instagram.replace(/^@+/, "")}
        </a>
      ) : null}
    </Reveal>
  );
}

export const luxuryTheme: TemplateTheme = {
  id: "classic-luxury",
  wrapperClass: "bg-luxury font-[family-name:var(--font-lato)] text-cream",
  tone: "dark",
  renderHero: (props: HeroSectionProps) => <LuxuryHero {...props} />,
  renderCoupleCard: (props: CoupleCardProps) => <LuxuryCoupleCard {...props} />,
};
