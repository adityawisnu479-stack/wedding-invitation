"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AtSign, ChevronDown } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { Invitation, Person, Wish } from "@/lib/types";
import { RsvpWishes } from "./RsvpWishes";
import { Countdown, EventCard, Gallery, GiftList, LoveStory, Reveal, SectionTitle } from "./shared";

export function ModernTemplate({
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
    <div className="bg-cream text-ink">
      {/* Hero */}
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

      {/* Quote */}
      <section className="px-6 py-16">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="font-serif text-xl leading-relaxed text-ink/80">{content.quote.text}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.25em] text-sage">{content.quote.source}</p>
        </Reveal>
      </section>

      {/* Couple */}
      <section id="mempelai" className="scroll-mt-8 px-6 py-16">
        <Reveal>
          <SectionTitle eyebrow="The Bride & Groom" title="Mempelai" />
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-2xl gap-10 sm:grid-cols-2">
          <CoupleCard person={content.groom} photo={content.photos.groom} role="Mempelai Pria" delay={0} />
          <CoupleCard person={content.bride} photo={content.photos.bride} role="Mempelai Wanita" delay={0.12} />
        </div>
      </section>

      {/* Countdown */}
      <section className="bg-cream-deep/60 px-6 py-16">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-sage">Save The Date</p>
          <p className="mt-3 font-serif text-2xl">Menuju Hari Bahagia</p>
          <div className="mt-6">
            <Countdown target={content.events[0].date} />
          </div>
        </Reveal>
      </section>

      {/* Events */}
      <section className="px-6 py-16">
        <Reveal>
          <SectionTitle eyebrow="When & Where" title="Rangkaian Acara" />
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
          {content.events.map((event, index) => (
            <Reveal key={event.kind} delay={index * 0.1}>
              <EventCard event={event} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Love story */}
      {invitation.show_love_story && content.loveStory.length > 0 ? (
        <section className="bg-cream-deep/60 px-6 py-16">
          <Reveal>
            <SectionTitle eyebrow="Our Journey" title="Love Story" />
          </Reveal>
          <div className="mt-10">
            <LoveStory items={content.loveStory} />
          </div>
        </section>
      ) : null}

      {/* Gallery */}
      {invitation.show_gallery && content.gallery.length > 0 ? (
        <section className="px-6 py-16">
          <Reveal>
            <SectionTitle eyebrow="Moments" title="Galeri" />
          </Reveal>
          <div className="mx-auto mt-10 max-w-2xl">
            <Gallery photos={content.gallery} />
          </div>
        </section>
      ) : null}

      {/* Gift */}
      {invitation.show_gift ? (
        <section className="bg-cream-deep/60 px-6 py-16">
          <Reveal>
            <SectionTitle eyebrow="Wedding Gift" title="Amplop Digital" />
            <p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-ink/60">
              Tanpa mengurangi rasa hormat, bagi Anda yang ingin memberikan tanda kasih, kami sediakan secara
              digital.
            </p>
          </Reveal>
          <div className="mt-8">
            <GiftList accounts={content.gift} address={content.giftAddress} />
          </div>
        </section>
      ) : null}

      {/* RSVP */}
      <section className="px-6 py-16">
        <Reveal>
          <SectionTitle eyebrow="RSVP" title="Konfirmasi & Ucapan" />
        </Reveal>
        <div className="mt-10">
          <RsvpWishes invitationId={invitation.id} initialWishes={wishes} guestName={guestName} />
        </div>
      </section>

      <footer className="relative overflow-hidden bg-ink px-6 py-14 text-center text-cream">
        <p className="text-[10px] uppercase tracking-[0.4em] text-cream/50">Thank You</p>
        <p className="mt-4 font-serif text-3xl">
          {content.groom.name} & {content.bride.name}
        </p>
        <p className="mx-auto mt-4 max-w-sm text-xs leading-relaxed text-cream/60">
          Merupakan suatu kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.
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
