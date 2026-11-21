"use client";

import type { Invitation, Wish } from "@/lib/types";
import { RsvpWishes } from "../RsvpWishes";
import { Countdown, EventCard, Gallery, GiftList, LoveStory, Reveal, SectionTitle } from "../shared";
import type { TemplateTheme } from "./types";

export function WeddingTemplateEngine({
  invitation,
  wishes,
  guestName,
  theme,
}: {
  invitation: Invitation;
  wishes: Wish[];
  guestName?: string;
  theme: TemplateTheme;
}) {
  const { content } = invitation;
  const tone = theme.tone;

  return (
    <div className={theme.wrapperClass}>
      {/* Hero */}
      {theme.renderHero({ invitation, guestName, tone })}

      {/* Quote */}
      <section className={`px-6 py-16 sm:py-20 ${tone === "dark" ? "bg-luxury-soft" : ""}`}>
        <Reveal className="mx-auto max-w-xl text-center">
          {tone === "dark" ? (
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold/70">Bismillahirrahmanirrahim</p>
          ) : null}
          <p
            className={`mt-4 text-xl leading-relaxed sm:text-2xl ${
              tone === "dark" ? "font-display text-cream/85" : "font-serif text-ink/80"
            }`}
          >
            {content.quote.text}
          </p>
          <p
            className={`mt-4 text-xs uppercase tracking-[0.25em] ${
              tone === "dark" ? "text-gold" : "text-sage"
            }`}
          >
            {content.quote.source}
          </p>
        </Reveal>
      </section>

      {/* Mempelai */}
      <section id="mempelai" className="scroll-mt-8 px-6 py-16 sm:py-20">
        <Reveal>
          <SectionTitle eyebrow="The Bride & Groom" title="Mempelai" tone={tone} />
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-2xl gap-10 sm:grid-cols-2 sm:gap-12">
          {theme.renderCoupleCard({
            person: content.groom,
            photo: content.photos.groom,
            role: tone === "dark" ? "The Groom" : "Mempelai Pria",
            delay: 0,
            tone,
          })}
          {theme.renderCoupleCard({
            person: content.bride,
            photo: content.photos.bride,
            role: tone === "dark" ? "The Bride" : "Mempelai Wanita",
            delay: 0.12,
            tone,
          })}
        </div>
      </section>

      {/* Countdown */}
      <section className={`px-6 py-16 sm:py-20 ${tone === "dark" ? "bg-luxury-soft" : "bg-cream-deep/60"}`}>
        <Reveal className="mx-auto max-w-xl text-center">
          <p className={`text-[11px] uppercase tracking-[0.35em] ${tone === "dark" ? "text-gold/70" : "text-sage"}`}>
            {tone === "dark" ? "Counting The Days" : "Save The Date"}
          </p>
          <p className={`mt-3 text-2xl ${tone === "dark" ? "font-display" : "font-serif"}`}>Menuju Hari Bahagia</p>
          <div className="mt-6">
            <Countdown target={content.events[0].date} tone={tone} />
          </div>
        </Reveal>
      </section>

      {/* Events */}
      <section className="px-6 py-16 sm:py-20">
        <Reveal>
          <SectionTitle eyebrow={tone === "dark" ? "Save The Date" : "When & Where"} title="Rangkaian Acara" tone={tone} />
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
          {content.events.map((event, index) => (
            <Reveal key={event.kind} delay={index * 0.1}>
              <EventCard event={event} tone={tone} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Love Story */}
      {invitation.show_love_story && content.loveStory.length > 0 ? (
        <section className={`px-6 py-16 sm:py-20 ${tone === "dark" ? "bg-luxury-soft" : "bg-cream-deep/60"}`}>
          <Reveal>
            <SectionTitle eyebrow={tone === "dark" ? "Our Story" : "Our Journey"} title="Love Story" tone={tone} />
          </Reveal>
          <div className="mt-10">
            <LoveStory items={content.loveStory} tone={tone} />
          </div>
        </section>
      ) : null}

      {/* Galeri */}
      {invitation.show_gallery && content.gallery.length > 0 ? (
        <section className="px-6 py-16 sm:py-20">
          <Reveal>
            <SectionTitle eyebrow="Moments" title="Galeri" tone={tone} />
          </Reveal>
          <div className="mx-auto mt-10 max-w-2xl">
            <Gallery photos={content.gallery} tone={tone} />
          </div>
        </section>
      ) : null}

      {/* Amplop Digital */}
      {invitation.show_gift ? (
        <section className={`px-6 py-16 sm:py-20 ${tone === "dark" ? "bg-luxury-soft" : "bg-cream-deep/60"}`}>
          <Reveal>
            <SectionTitle eyebrow="Wedding Gift" title="Amplop Digital" tone={tone} />
            <p
              className={`mx-auto mt-4 max-w-md text-center text-sm leading-relaxed ${
                tone === "dark" ? "text-cream/55" : "text-ink/60"
              }`}
            >
              {tone === "dark"
                ? "Tanda kasih Anda adalah kehormatan bagi kami. Dapat disalurkan melalui:"
                : "Tanpa mengurangi rasa hormat, bagi Anda yang ingin memberikan tanda kasih, kami sediakan secara digital."}
            </p>
          </Reveal>
          <div className="mt-8">
            <GiftList accounts={content.gift} address={content.giftAddress} tone={tone} />
          </div>
        </section>
      ) : null}

      {/* RSVP */}
      <section className="px-6 py-16 sm:py-20">
        <Reveal>
          <SectionTitle eyebrow="RSVP" title="Konfirmasi & Ucapan" tone={tone} />
        </Reveal>
        <div className="mt-10 sm:mt-12">
          <RsvpWishes invitationId={invitation.id} initialWishes={wishes} guestName={guestName} tone={tone} />
        </div>
      </section>

      {/* Footer */}
      {theme.renderFooter ? (
        theme.renderFooter({ invitation, tone })
      ) : (
        <footer
          className={`relative overflow-hidden px-6 py-14 text-center ${
            tone === "dark" ? "border-t border-gold/15 text-cream" : "bg-ink text-cream"
          }`}
        >
          <p className={`text-[10px] uppercase tracking-[0.4em] ${tone === "dark" ? "text-gold/60" : "text-cream/50"}`}>
            {tone === "dark" ? "Wassalamualaikum" : "Thank You"}
          </p>
          <p className={`mt-4 text-3xl sm:text-4xl ${tone === "dark" ? "font-display" : "font-serif"}`}>
            {content.groom.name}{" "}
            <span className={tone === "dark" ? "font-serif italic text-gold" : "opacity-60"}>&</span>{" "}
            {content.bride.name}
          </p>
          <p
            className={`mx-auto mt-4 max-w-sm text-xs leading-relaxed ${
              tone === "dark" ? "text-cream/50" : "text-cream/60"
            }`}
          >
            {tone === "dark"
              ? "Terima kasih atas doa dan restu yang senantiasa menyertai kami."
              : "Merupakan suatu kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu."}
          </p>
        </footer>
      )}
    </div>
  );
}
