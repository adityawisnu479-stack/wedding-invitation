export type TemplateId = "modern-minimalist" | "classic-luxury";

export type Person = {
  name: string;
  fullName: string;
  father: string;
  mother: string;
  instagram?: string;
};

export type EventInfo = {
  kind: string;
  date: string;
  place: string;
  address: string;
  mapsUrl: string;
};

export type EventItem = EventInfo;

export type LoveStoryItem = { date: string; title: string; text: string };

export type GiftAccount = { bank: string; number: string; holder: string };

export type InvitationContent = {
  quote: { text: string; source: string };
  groom: Person;
  bride: Person;
  events: EventInfo[];
  loveStory: LoveStoryItem[];
  gift: GiftAccount[];
  giftAddress?: string;
  gallery: string[];
  photos: { cover: string; groom: string; bride: string };
  waMessage: string;
};

export type Invitation = {
  id: string;
  user_id: string;
  slug: string;
  active_template: TemplateId;
  show_love_story: boolean;
  show_gallery: boolean;
  show_gift: boolean;
  active_music_url: string | null;
  content: InvitationContent;
};

export type Guest = {
  id: string;
  invitation_id: string;
  name: string;
  category: string;
  phone: string | null;
  is_sent: boolean;
  created_at: string;
};

export type Wish = {
  id: string;
  invitation_id: string;
  guest_name: string;
  attendance: "hadir" | "tidak_hadir" | "masih_ragu";
  pax: number;
  message: string;
  is_hidden: boolean;
  created_at: string;
};
