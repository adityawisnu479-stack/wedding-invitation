import React from "react";
import type { Invitation, Person, TemplateId, Wish } from "@/lib/types";
import type { Tone } from "../theme";

export interface HeroSectionProps {
  invitation: Invitation;
  guestName?: string;
  tone: Tone;
}

export interface CoupleCardProps {
  person: Person;
  photo?: string;
  role: string;
  delay: number;
  tone: Tone;
}

export interface FooterSectionProps {
  invitation: Invitation;
  tone: Tone;
}

export interface CoverThemeStyles {
  backgroundClass: string;
  ornamentClass?: string;
  eyebrowClass?: string;
  titleFontClass?: string;
  ampersandClass?: string;
  buttonClass: string;
}

export interface TemplateTheme {
  id: TemplateId;
  wrapperClass: string;
  tone: Tone;
  coverStyles: CoverThemeStyles;
  renderHero: (props: HeroSectionProps) => React.ReactNode;
  renderCoupleCard: (props: CoupleCardProps) => React.ReactNode;
  renderFooter?: (props: FooterSectionProps) => React.ReactNode;
}
