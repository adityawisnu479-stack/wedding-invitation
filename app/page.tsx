import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Invitation } from "@/components/invitation/Invitation";
import { getPublicInvitation, getWishes } from "@/lib/data";

export const dynamic = "force-dynamic";

type Search = { to?: string | string[]; preview_template?: string | string[] };

export async function generateMetadata({ searchParams }: { searchParams: Promise<Search> }): Promise<Metadata> {
  const params = await searchParams;
  const invitation = await getPublicInvitation();
  const { groom, bride } = invitation.content;
  const guest = typeof params.to === "string" ? params.to : undefined;

  return {
    title: guest ? `Undangan untuk ${guest} — ${groom.name} & ${bride.name}` : `The Wedding of ${groom.name} & ${bride.name}`,
    description: `Kami mengundang Anda untuk berbagi kebahagiaan di hari pernikahan ${groom.name} & ${bride.name}.`,
  };
}

export default async function HomePage({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const guest = typeof params.to === "string" ? params.to : undefined;
  const preview = typeof params.preview_template === "string" ? params.preview_template : undefined;

  // Jika pengunjung membuka root landing page TANPA query parameter tamu/preview,
  // arahkan pemilik acara langsung ke dashboard (yang otomatis memproteksi ke /login jika belum ada sesi).
  if (!guest && !preview) {
    redirect("/dashboard");
  }

  // Jika ada query parameter tamu (?to=...), tampilkan undangan secara langsung tanpa redirect.
  const invitation = await getPublicInvitation();
  const wishes = await getWishes(invitation.id);

  return (
    <Invitation
      invitation={invitation}
      wishes={wishes}
      guestName={guest}
      previewTemplate={preview}
    />
  );
}
