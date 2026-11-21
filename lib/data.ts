import { defaultMusicUrl, weddingConfig } from "@/config/wedding.config";
import type { Guest, Invitation, Wish } from "./types";
import { supabaseConfigured } from "./supabase/client";
import { supabaseServer } from "./supabase/server";

/** Undangan lokal dari config, dipakai saat Supabase belum diisi atau baris undangan belum dibuat. */
export const localInvitation: Invitation = {
  id: "local",
  user_id: "local",
  slug: "default",
  active_template: "modern-minimalist",
  show_love_story: true,
  show_gallery: true,
  show_gift: true,
  active_music_url: defaultMusicUrl || null,
  content: weddingConfig,
};

export async function getPublicInvitation(): Promise<Invitation> {
  if (!supabaseConfigured) return localInvitation;
  const supabase = await supabaseServer();
  if (!supabase) return localInvitation;

  try {
    const { data } = await supabase
      .from("invitations")
      .select("*")
      .order("created_at")
      .limit(1)
      .maybeSingle();
    return (data as Invitation | null) ?? localInvitation;
  } catch {
    return localInvitation;
  }
}

export async function getWishes(invitationId: string, limit = 40): Promise<Wish[]> {
  if (invitationId === "local") return [];
  const supabase = await supabaseServer();
  if (!supabase) return [];
  const { data } = await supabase
    .from("rsvps_and_wishes")
    .select("*")
    .eq("invitation_id", invitationId)
    .eq("is_hidden", false)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Wish[] | null) ?? [];
}

export type DashboardData = {
  invitation: Invitation;
  guests: Guest[];
  wishes: Wish[];
  email: string;
};

export async function getDashboardData(): Promise<DashboardData | null> {
  const supabase = await supabaseServer();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: invitation } = await supabase
    .from("invitations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at")
    .limit(1)
    .maybeSingle();

  if (!invitation) {
    return {
      invitation: { ...localInvitation, user_id: user.id },
      guests: [],
      wishes: [],
      email: user.email ?? "",
    };
  }

  const [{ data: guests }, { data: wishes }] = await Promise.all([
    supabase.from("guests").select("*").eq("invitation_id", invitation.id).order("created_at"),
    supabase
      .from("rsvps_and_wishes")
      .select("*")
      .eq("invitation_id", invitation.id)
      .order("created_at", { ascending: false }),
  ]);

  return {
    invitation: invitation as Invitation,
    guests: (guests as Guest[] | null) ?? [],
    wishes: (wishes as Wish[] | null) ?? [],
    email: user.email ?? "",
  };
}
