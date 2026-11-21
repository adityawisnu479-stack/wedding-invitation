export type Tone = "light" | "dark";

export const toneStyles = {
  light: {
    muted: "text-ink/60",
    faint: "text-ink/40",
    line: "bg-ink/10",
    card: "bg-white/70 border border-ink/10",
    input:
      "border border-ink/15 bg-white/85 text-ink placeholder:text-ink/35 focus:border-sage focus:ring-2 focus:ring-sage/20",
    chip: "border border-ink/15 text-ink/70 hover:border-sage/60",
    chipActive: "border bg-sage text-cream border-sage",
    primary: "bg-sage text-cream hover:bg-[#5c6c5f]",
    accent: "text-sage",
    badge: "bg-sage/10 text-sage",
    skeleton: "text-ink",
  },
  dark: {
    muted: "text-cream/60",
    faint: "text-cream/35",
    line: "bg-gold/25",
    card: "bg-white/[0.04] border border-gold/15",
    input:
      "border border-gold/20 bg-white/[0.04] text-cream placeholder:text-cream/30 focus:border-gold focus:ring-2 focus:ring-gold/20",
    chip: "border border-gold/25 text-cream/70 hover:border-gold/70",
    chipActive: "border bg-gold text-luxury border-gold",
    primary: "bg-gold text-luxury hover:bg-[#d0b88a]",
    accent: "text-gold",
    badge: "bg-gold/15 text-gold",
    skeleton: "text-cream",
  },
} satisfies Record<Tone, Record<string, string>>;
