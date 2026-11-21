"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AtSign } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { Invitation, Person, Wish } from "@/lib/types";
import { RsvpWishes } from "./RsvpWishes";
import { Countdown, EventCard, Gallery, GiftList, LoveStory, Reveal, SectionTitle } from "./shared";

export function LuxuryTemplate({
  invitation,
  wishes,
  guestName,
}: {
  invitation: Invitation;
  wishes: Wish[];
  guestName?: string;
}) {
  const reduced = useReducedMotion();
  const { content } = invitation;
  const cover = content.photos.cover;

  return (
    <div className="bg-luxury font-[family-name:var(--font-lato)] text-cream">
      {/* Hero */}
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

      {/* Quote */}
      <section className="bg-luxury-soft px-6 py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold/70">Bismillahirrahmanirrahim</p>
          <p className="mt-6 font-display text-xl leading-relaxed text-cream/85 sm:text-2xl">{content.quote.text}</p>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-gold">{content.quote.source}</p>
        </Reveal>
      </section>

      {/* Couple */}
      <section className="px-6 py-20">
        <Reveal>
          <SectionTitle eyebrow="The Bride & Groom" title="Mempelai" tone="dark" />
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-2xl gap-12 sm:grid-cols-2">
          <CoupleCard person={content.groom} photo={content.photos.groom} role="The Groom" delay={0} />
          <CoupleCard person={content.bride} photo={content.photos.bride} role="The Bride" delay={0.12} />
        </div>
      </section>

      {/* Countdown */}
      <section className="bg-luxury-soft px-6 py-20">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold/70">Counting The Days</p>
          <p className="mt-3 font-display text-2xl">Menuju Hari Bahagia</p>
          <div className="mt-7">
            <Countdown target={content.events[0].date} tone="dark" />
          </div>
        </Reveal>
      </section>

      {/* Events */}
      <section className="px-6 py-20">
        <Reveal>
          <SectionTitle eyebrow="Save The Date" title="Rangkaian Acara" tone="dark" />
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-2xl gap-4 sm:grid-cols-2">
          {content.events.map((event, index) => (
            <Reveal key={event.kind} delay={index * 0.1}>
              <EventCard event={event} tone="dark" />
            </Reveal>
          ))}
        </div>
      </section>

      {invitation.show_love_story && content.loveStory.length > 0 ? (
        <section className="bg-luxury-soft px-6 py-20">
          <Reveal>
            <SectionTitle eyebrow="Our Story" title="Love Story" tone="dark" />
          </Reveal>
          <div className="mt-12">
            <LoveStory items={content.loveStory} tone="dark" />
          </div>
        </section>
      ) : null}

      {invitation.show_gallery && content.gallery.length > 0 ? (
        <section className="px-6 py-20">
          <Reveal>
            <SectionTitle eyebrow="Moments" title="Galeri" tone="dark" />
          </Reveal>
          <div className="mx-auto mt-12 max-w-2xl">
            <Gallery photos={content.gallery} tone="dark" />
          </div>
        </section>
      ) : null}

      {invitation.show_gift ? (
        <section className="bg-luxury-soft px-6 py-20">
          <Reveal>
            <SectionTitle eyebrow="Wedding Gift" title="Amplop Digital" tone="dark" />
            <p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-cream/55">
              Tanda kasih Anda adalah kehormatan bagi kami. Dapat disalurkan melalui:
            </p>
          </Reveal>
          <div className="mt-8">
            <GiftList accounts={content.gift} address={content.giftAddress} tone="dark" />
          </div>
        </section>
      ) : null}

      <section className="px-6 py-20">
        <Reveal>
          <SectionTitle eyebrow="RSVP" title="Konfirmasi & Ucapan" tone="dark" />
        </Reveal>
        <div className="mt-12">
          <RsvpWishes
            invitationId={invitation.id}
            initialWishes={wishes}
            guestName={guestName}
            tone="dark"
          />
        </div>
      </section>

      <footer className="relative overflow-hidden border-t border-gold/15 px-6 py-16 text-center">
        <p className="text-[10px] uppercase tracking-[0.45em] text-gold/60">Wassalamualaikum</p>
        <p className="mt-5 font-display text-4xl">
          {content.groom.name} <span className="font-serif italic text-gold">&</span> {content.bride.name}
        </p>
        <p className="mx-auto mt-5 max-w-sm text-xs leading-relaxed text-cream/50">
          Terima kasih atas doa dan restu yang senantiasa menyertai kami.
        </p>
      </footer>
    </div>
  );
}

function CoupleCard({
  person,
  photo,
  role,
  delay,
}: {
  person: Person;
  photo?: string;
  role: string;
  delay: number;
}) {
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
