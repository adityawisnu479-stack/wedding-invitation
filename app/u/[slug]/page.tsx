import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Invitation } from "@/components/invitation/Invitation";
import { resolvePublicInvitation } from "@/lib/data";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    to?: string | string[];
    preview_template?: string | string[];
  }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const search = await searchParams;
  const res = await resolvePublicInvitation(slug);

  if (res.status === "not_found") {
    return {
      title: "Undangan Tidak Ditemukan",
    };
  }

  const { groom, bride } = res.invitation.content;
  const guest = typeof search.to === "string" ? search.to : undefined;

  return {
    title: guest
      ? `Undangan untuk ${guest} — ${groom.name} & ${bride.name}`
      : `The Wedding of ${groom.name} & ${bride.name}`,
    description: `Kami mengundang Anda untuk berbagi kebahagiaan di hari pernikahan ${groom.name} & ${bride.name}.`,
  };
}

export default async function SlugUndanganPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const search = await searchParams;
  const res = await resolvePublicInvitation(slug);

  if (res.status === "not_found") {
    notFound();
  }

  return (
    <Invitation
      invitation={res.invitation}
      wishes={res.wishes}
      guestName={typeof search.to === "string" ? search.to : undefined}
      previewTemplate={
        typeof search.preview_template === "string"
          ? search.preview_template
          : undefined
      }
    />
  );
}
