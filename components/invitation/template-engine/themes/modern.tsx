"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AtSign, ChevronDown } from "lucide-react";
import { formatDate } from "@/lib/format";
import { Reveal } from "../../shared";
import type { CoupleCardProps, HeroSectionProps, TemplateTheme } from "../types";

function ModernHero({ invitation, guestName }: HeroSectionProps) {
  const reduced = useReducedMotion();
  const { content } = invitation;
  const cover = content.photos.cover;

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {cover ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover} alt="Foto sampul" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        </>
      ) : (
        <>
          <div className="absolute -left-24 top-10 size-64 rounded-full bg-sage/15 blur-3xl" />
          <div className="absolute -right-20 bottom-20 size-72 rounded-full bg-gold/20 blur-3xl" />
        </>
      )}

      <div className={`relative z-10 ${cover ? "text-white" : "text-ink"}`}>
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-[11px] uppercase tracking-[0.45em] opacity-75"
        >
          We Are Getting Married
        </motion.p>
        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="mt-4 font-serif text-6xl leading-[1.02] sm:text-7xl"
        >
          {content.groom.name}
          <span className="mx-1.5 text-4xl opacity-50">&</span>
          {content.bride.name}
        </motion.h1>
        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-5 text-sm tracking-[0.25em] opacity-80"
        >
          {formatDate(content.events[0].date)}
        </motion.p>
        {guestName ? (
          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 text-xs uppercase tracking-[0.3em] opacity-70"
          >
            Kepada: {guestName}
          </motion.p>
        ) : null}
      </div>

      <motion.a
        href="#mempelai"
        animate={reduced ? undefined : { y: [0, 7, 0] }}
        transition={{ repeat: Infinity, duration: 2.4 }}
        className="absolute bottom-8 z-10 flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.3em] opacity-70"
      >
        Scroll
        <ChevronDown size={16} />
      </motion.a>
    </section>
  );
}

function ModernCoupleCard({ person, photo, role, delay }: CoupleCardProps) {
  return (
    <Reveal delay={delay} className="text-center">
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-t-[150px] rounded-b-3xl bg-cream-deep ring-1 ring-ink/5">
        {photo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={photo} alt={person.fullName} className="size-full object-cover" loading="lazy" />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-b from-sage/15 to-gold/20">
            <span className="font-serif text-6xl text-sage/60">{person.name.charAt(0)}</span>
          </div>
        )}
      </div>
      <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-sage">{role}</p>
      <p className="mt-2 font-serif text-2xl">{person.fullName || person.name}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink/60">
        Putra/Putri dari
        <br />
        {person.father} & {person.mother}
      </p>
      {person.instagram ? (
        <a
          href={`https://instagram.com/${person.instagram.replace(/^@+/, "")}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-xs text-sage transition hover:bg-sage/10"
        >
          <AtSign size={14} /> {person.instagram.replace(/^@+/, "")}
        </a>
      ) : null}
    </Reveal>
  );
}

export const modernTheme: TemplateTheme = {
  id: "modern-minimalist",
  wrapperClass: "bg-cream text-ink",
  tone: "light",
  coverStyles: {
    backgroundClass: "bg-[radial-gradient(circle_at_top,#f6efe4,#e6ddcd_70%)]",
    eyebrowClass: "opacity-75",
    titleFontClass: "font-serif",
    ampersandClass: "opacity-60",
    buttonClass: "bg-ink text-cream",
  },
  renderHero: (props: HeroSectionProps) => <ModernHero {...props} />,
  renderCoupleCard: (props: CoupleCardProps) => <ModernCoupleCard {...props} />,
};
