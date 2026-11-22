import type { Metadata } from "next";
import { Invitation } from "@/components/invitation/Invitation";
import { localInvitation } from "@/lib/data";
import type { Wish } from "@/lib/types";

export const dynamic = "force-dynamic";

type Search = { to?: string | string[]; preview_template?: string | string[] };

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Search>;
}): Promise<Metadata> {
  const params = await searchParams;
  const invitation = localInvitation;
  const { groom, bride } = invitation.content;
  const guest = typeof params.to === "string" ? params.to : undefined;

  return {
    title: guest
      ? `Undangan untuk ${guest} — ${groom.name} & ${bride.name}`
      : `The Wedding of ${groom.name} & ${bride.name}`,
    description: `Kami mengundang Anda untuk berbagi kebahagiaan di hari pernikahan ${groom.name} & ${bride.name}.`,
  };
}

export default async function UndanganPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  // Rute /undangan didelegasikan murni sebagai showcase contoh/demo publik netral.
  // Tidak mengambil data pribadi akun pengguna manapun dari database.
  const invitation = localInvitation;
  const wishes: Wish[] = [];

  return (
    <Invitation
      invitation={invitation}
      wishes={wishes}
      guestName={typeof params.to === "string" ? params.to : undefined}
      previewTemplate={
        typeof params.preview_template === "string"
          ? params.preview_template
          : undefined
      }
    />
  );
}
