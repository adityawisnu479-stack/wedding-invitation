import { createStarterInvitationContent } from "@/config/wedding.config";
import { supabaseBrowser, supabaseConfigured } from "../supabase/client";
import type { Guest, Invitation, Wish } from "../types";
import type {
  AuthCredentials,
  AuthSessionResult,
  DataStore,
  NewGuestInput,
  PhotoFolder,
  StoreResult,
  TrackItem,
  WishInput,
} from "./types";

function buildStoragePath(
  folder: string,
  fileName: string,
  tenantPrefix?: string
): string {
  const safeName = fileName.replace(/[^\w.-]+/g, "-");
  const base = `${folder}/${Date.now()}-${safeName}`;
  return tenantPrefix ? `${tenantPrefix}/${base}` : base;
}

async function resolveTenantPrefix(
  invitationId?: string
): Promise<string | undefined> {
  if (!invitationId) return undefined;
  const {
    data: { user },
  } = await supabaseBrowser().auth.getUser();
  return user ? `${user.id}/${invitationId}` : undefined;
}

export class SupabaseDataStore implements DataStore {
  account = {
    signIn: async (
      creds: AuthCredentials
    ): Promise<StoreResult<AuthSessionResult>> => {
      try {
        const { data, error } = await supabaseBrowser().auth.signInWithPassword(
          {
            email: creds.email.trim(),
            password: creds.password,
          }
        );
        if (error) {
          return { data: null, error: new Error(error.message) };
        }
        return {
          data: {
            user: data.user
              ? { id: data.user.id, email: data.user.email }
              : null,
            hasSession: !!data.session,
          },
          error: null,
        };
      } catch (err: unknown) {
        return {
          data: null,
          error: err instanceof Error ? err : new Error(String(err)),
        };
      }
    },

    signUp: async (
      creds: AuthCredentials
    ): Promise<StoreResult<AuthSessionResult>> => {
      try {
        const { data, error } = await supabaseBrowser().auth.signUp({
          email: creds.email.trim(),
          password: creds.password,
        });
        if (error) {
          return { data: null, error: new Error(error.message) };
        }
        return {
          data: {
            user: data.user
              ? { id: data.user.id, email: data.user.email }
              : null,
            hasSession: !!data.session,
          },
          error: null,
        };
      } catch (err: unknown) {
        return {
          data: null,
          error: err instanceof Error ? err : new Error(String(err)),
        };
      }
    },

    signOut: async (): Promise<StoreResult<void>> => {
      try {
        const { error } = await supabaseBrowser().auth.signOut();
        if (error) {
          return { data: null, error: new Error(error.message) };
        }
        return { data: undefined, error: null };
      } catch (err: unknown) {
        return {
          data: null,
          error: err instanceof Error ? err : new Error(String(err)),
        };
      }
    },

    createInitialInvitation: async (): Promise<StoreResult<Invitation>> => {
      try {
        const client = supabaseBrowser();
        const {
          data: { user },
          error: userError,
        } = await client.auth.getUser();
        if (userError || !user) {
          return {
            data: null,
            error: new Error(userError?.message || "User tidak terautentikasi"),
            unauthenticated: true,
          };
        }

        const randomSuffix = Math.random().toString(36).substring(2, 7);
        const slug = `undangan-${user.id.slice(0, 8)}-${randomSuffix}`;

        const { data, error } = await client
          .from("invitations")
          .insert({
            user_id: user.id,
            slug,
            content: createStarterInvitationContent(),
          })
          .select()
          .single();

        if (error) {
          return {
            data: null,
            error: new Error(error.message || "Gagal membuat undangan"),
          };
        }
        return { data: data as Invitation, error: null };
      } catch (err: unknown) {
        return {
          data: null,
          error: err instanceof Error ? err : new Error(String(err)),
        };
      }
    },
  };
  wishes = {
    submit: async (input: WishInput): Promise<StoreResult<Wish>> => {
      if (!supabaseConfigured || input.invitation_id === "local") {
        return {
          data: null,
          error: new Error(
            "Form belum aktif: database Supabase belum dikonfigurasi."
          ),
        };
      }
      if (input.guest_name.trim().length < 2) {
        return { data: null, error: new Error("Nama minimal 2 karakter.") };
      }
      if (input.message.trim().length < 2) {
        return {
          data: null,
          error: new Error("Tulis doa atau ucapan dulu ya."),
        };
      }

      try {
        const { data, error } = await supabaseBrowser()
          .from("rsvps_and_wishes")
          .insert({
            invitation_id: input.invitation_id,
            guest_name: input.guest_name.trim(),
            attendance: input.attendance,
            pax: input.attendance === "hadir" ? input.pax : 0,
            message: input.message.trim(),
          })
          .select()
          .single();

        if (error) {
          return {
            data: null,
            error: new Error(error.message || "Gagal mengirim ucapan"),
          };
        }
        return { data: data as Wish, error: null };
      } catch (err: unknown) {
        return {
          data: null,
          error: err instanceof Error ? err : new Error(String(err)),
        };
      }
    },

    toggleHidden: async (
      id: string,
      current: boolean
    ): Promise<StoreResult<void>> => {
      try {
        const { error } = await supabaseBrowser()
          .from("rsvps_and_wishes")
          .update({ is_hidden: !current })
          .eq("id", id);

        if (error) {
          return {
            data: null,
            error: new Error(
              error.message || "Gagal memperbarui status ucapan"
            ),
          };
        }
        return { data: null, error: null };
      } catch (err: unknown) {
        return {
          data: null,
          error: err instanceof Error ? err : new Error(String(err)),
        };
      }
    },

    remove: async (id: string): Promise<StoreResult<void>> => {
      try {
        const { error } = await supabaseBrowser()
          .from("rsvps_and_wishes")
          .delete()
          .eq("id", id);
        if (error) {
          return {
            data: null,
            error: new Error(error.message || "Gagal menghapus ucapan"),
          };
        }
        return { data: null, error: null };
      } catch (err: unknown) {
        return {
          data: null,
          error: err instanceof Error ? err : new Error(String(err)),
        };
      }
    },
  };

  guests = {
    add: async (
      invitationId: string,
      rows: NewGuestInput[]
    ): Promise<StoreResult<Guest[]>> => {
      if (invitationId === "local") {
        return {
          data: null,
          error: new Error("Buat undangan dulu di tab Tampilan"),
        };
      }
      if (!rows.length) {
        return {
          data: null,
          error: new Error("Tidak ada nama yang bisa ditambahkan"),
        };
      }

      try {
        const { data, error } = await supabaseBrowser()
          .from("guests")
          .insert(rows.map((row) => ({ ...row, invitation_id: invitationId })))
          .select();

        if (error) {
          return {
            data: null,
            error: new Error(error.message || "Gagal menambah tamu"),
          };
        }
        return { data: (data as Guest[]) ?? [], error: null };
      } catch (err: unknown) {
        return {
          data: null,
          error: err instanceof Error ? err : new Error(String(err)),
        };
      }
    },

    toggleSent: async (
      id: string,
      current: boolean
    ): Promise<StoreResult<void>> => {
      try {
        const { error } = await supabaseBrowser()
          .from("guests")
          .update({ is_sent: !current })
          .eq("id", id);

        if (error) {
          return {
            data: null,
            error: new Error(error.message || "Gagal memperbarui status"),
          };
        }
        return { data: null, error: null };
      } catch (err: unknown) {
        return {
          data: null,
          error: err instanceof Error ? err : new Error(String(err)),
        };
      }
    },

    remove: async (id: string): Promise<StoreResult<void>> => {
      try {
        const { error } = await supabaseBrowser()
          .from("guests")
          .delete()
          .eq("id", id);
        if (error) {
          return {
            data: null,
            error: new Error(error.message || "Gagal menghapus tamu"),
          };
        }
        return { data: null, error: null };
      } catch (err: unknown) {
        return {
          data: null,
          error: err instanceof Error ? err : new Error(String(err)),
        };
      }
    },
  };

  invitation = {
    update: async (
      id: string,
      patch: Partial<Invitation>
    ): Promise<StoreResult<void>> => {
      try {
        const { error } = await supabaseBrowser()
          .from("invitations")
          .update(patch)
          .eq("id", id);
        if (error) {
          return {
            data: null,
            error: new Error(error.message || "Gagal menyimpan perubahan"),
          };
        }
        return { data: null, error: null };
      } catch (err: unknown) {
        return {
          data: null,
          error: err instanceof Error ? err : new Error(String(err)),
        };
      }
    },
  };

  media = {
    listTracks: async (): Promise<StoreResult<TrackItem[]>> => {
      try {
        const client = supabaseBrowser();
        const [defaults, custom] = await Promise.all([
          client.storage.from("wedding-music").list("defaults", { limit: 100 }),
          client.storage.from("wedding-music").list("custom", { limit: 100 }),
        ]);

        const rows = [
          ...(defaults.data ?? []).map((file: { name: string }) => ({
            name: file.name,
            path: `defaults/${file.name}`,
          })),
          ...(custom.data ?? []).map((file: { name: string }) => ({
            name: file.name,
            path: `custom/${file.name}`,
          })),
        ].filter((row) => /\.mp3$/i.test(row.name));

        const tracks: TrackItem[] = rows.map((row) => ({
          name: row.name.replace(/\.mp3$/i, "").replace(/^\d+-/, ""),
          url: client.storage.from("wedding-music").getPublicUrl(row.path).data
            .publicUrl,
        }));

        return { data: tracks, error: null };
      } catch (err: unknown) {
        return {
          data: null,
          error: err instanceof Error ? err : new Error(String(err)),
        };
      }
    },

    uploadTrack: async (
      file: File,
      options?: { invitationId?: string }
    ): Promise<StoreResult<TrackItem>> => {
      if (!/\.mp3$/i.test(file.name)) {
        return { data: null, error: new Error("Format musik harus .mp3") };
      }

      try {
        const client = supabaseBrowser();
        const tenantPrefix = await resolveTenantPrefix(options?.invitationId);
        const path = buildStoragePath("custom", file.name, tenantPrefix);
        const { error } = await client.storage
          .from("wedding-music")
          .upload(path, file, { contentType: "audio/mpeg" });

        if (error) {
          return {
            data: null,
            error: new Error(error.message || "Gagal mengunggah musik"),
          };
        }

        const publicUrl = client.storage
          .from("wedding-music")
          .getPublicUrl(path).data.publicUrl;
        const cleanName = file.name.replace(/\.mp3$/i, "").replace(/^\d+-/, "");

        return {
          data: { name: cleanName, url: publicUrl },
          error: null,
        };
      } catch (err: unknown) {
        return {
          data: null,
          error: err instanceof Error ? err : new Error(String(err)),
        };
      }
    },

    uploadPhoto: async (
      folder: PhotoFolder,
      file: File,
      options?: { invitationId?: string }
    ): Promise<StoreResult<string>> => {
      try {
        const client = supabaseBrowser();
        const tenantPrefix = await resolveTenantPrefix(options?.invitationId);
        const path = buildStoragePath(folder, file.name, tenantPrefix);
        const { error } = await client.storage
          .from("wedding-photos")
          .upload(path, file, { upsert: true });

        if (error) {
          return {
            data: null,
            error: new Error(error.message || "Gagal mengunggah foto"),
          };
        }

        const publicUrl = client.storage
          .from("wedding-photos")
          .getPublicUrl(path).data.publicUrl;
        return { data: publicUrl, error: null };
      } catch (err: unknown) {
        return {
          data: null,
          error: err instanceof Error ? err : new Error(String(err)),
        };
      }
    },

    uploadPhotos: async (
      folder: "gallery",
      files: File[],
      options?: { invitationId?: string }
    ): Promise<StoreResult<string[]>> => {
      if (files.length === 0) {
        return { data: [], error: null };
      }

      try {
        const urls: string[] = [];
        const errors: string[] = [];

        for (const file of files) {
          const res = await this.media.uploadPhoto(folder, file, options);
          if (res.data) {
            urls.push(res.data);
          } else if (res.error) {
            errors.push(`${file.name}: ${res.error.message}`);
          }
        }

        if (urls.length === 0 && errors.length > 0) {
          return {
            data: null,
            error: new Error(`Gagal mengunggah foto: ${errors.join("; ")}`),
          };
        }

        return { data: urls, error: null };
      } catch (err: unknown) {
        return {
          data: null,
          error: err instanceof Error ? err : new Error(String(err)),
        };
      }
    },
  };
}
