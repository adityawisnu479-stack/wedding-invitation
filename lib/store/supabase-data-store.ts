import { supabaseBrowser, supabaseConfigured } from "../supabase/client";
import type { Guest, Invitation, Wish } from "../types";
import type { DataStore, NewGuestInput, StoreResult, WishInput } from "./types";

export class SupabaseDataStore implements DataStore {
  wishes = {
    submit: async (input: WishInput): Promise<StoreResult<Wish>> => {
      if (!supabaseConfigured || input.invitation_id === "local") {
        return {
          data: null,
          error: new Error("Form belum aktif: database Supabase belum dikonfigurasi."),
        };
      }
      if (input.guest_name.trim().length < 2) {
        return { data: null, error: new Error("Nama minimal 2 karakter.") };
      }
      if (input.message.trim().length < 2) {
        return { data: null, error: new Error("Tulis doa atau ucapan dulu ya.") };
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
          return { data: null, error: new Error(error.message || "Gagal mengirim ucapan") };
        }
        return { data: data as Wish, error: null };
      } catch (err: any) {
        return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
      }
    },
  };

  guests = {
    add: async (invitationId: string, rows: NewGuestInput[]): Promise<StoreResult<Guest[]>> => {
      if (invitationId === "local") {
        return { data: null, error: new Error("Buat undangan dulu di tab Tampilan") };
      }
      if (!rows.length) {
        return { data: null, error: new Error("Tidak ada nama yang bisa ditambahkan") };
      }

      try {
        const { data, error } = await supabaseBrowser()
          .from("guests")
          .insert(rows.map((row) => ({ ...row, invitation_id: invitationId })))
          .select();

        if (error) {
          return { data: null, error: new Error(error.message || "Gagal menambah tamu") };
        }
        return { data: (data as Guest[]) ?? [], error: null };
      } catch (err: any) {
        return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
      }
    },

    toggleSent: async (id: string, current: boolean): Promise<StoreResult<void>> => {
      try {
        const { error } = await supabaseBrowser()
          .from("guests")
          .update({ is_sent: !current })
          .eq("id", id);

        if (error) {
          return { data: null, error: new Error(error.message || "Gagal memperbarui status") };
        }
        return { data: null, error: null };
      } catch (err: any) {
        return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
      }
    },

    remove: async (id: string): Promise<StoreResult<void>> => {
      try {
        const { error } = await supabaseBrowser().from("guests").delete().eq("id", id);
        if (error) {
          return { data: null, error: new Error(error.message || "Gagal menghapus tamu") };
        }
        return { data: null, error: null };
      } catch (err: any) {
        return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
      }
    },
  };

  invitation = {
    update: async (id: string, patch: Partial<Invitation>): Promise<StoreResult<void>> => {
      try {
        const { error } = await supabaseBrowser().from("invitations").update(patch).eq("id", id);
        if (error) {
          return { data: null, error: new Error(error.message || "Gagal menyimpan perubahan") };
        }
        return { data: null, error: null };
      } catch (err: any) {
        return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
      }
    },
  };
}
