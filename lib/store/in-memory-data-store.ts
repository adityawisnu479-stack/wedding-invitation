import type { Guest, Invitation, Wish } from "../types";
import type { DataStore, NewGuestInput, StoreResult, WishInput } from "./types";

export type InMemoryState = {
  wishes: Wish[];
  guests: Guest[];
  invitations: Map<string, Invitation>;
};

export class InMemoryDataStore implements DataStore {
  private state: InMemoryState;

  constructor(initial?: Partial<InMemoryState>) {
    this.state = {
      wishes: initial?.wishes ? [...initial.wishes] : [],
      guests: initial?.guests ? [...initial.guests] : [],
      invitations: initial?.invitations ? new Map(initial.invitations) : new Map(),
    };
  }

  wishes = {
    submit: async (input: WishInput): Promise<StoreResult<Wish>> => {
      if (input.invitation_id === "local") {
        return { data: null, error: new Error("Form belum aktif: database belum dikonfigurasi.") };
      }
      if (input.guest_name.trim().length < 2) {
        return { data: null, error: new Error("Nama minimal 2 karakter.") };
      }
      if (input.message.trim().length < 2) {
        return { data: null, error: new Error("Tulis doa atau ucapan dulu ya.") };
      }

      const newWish: Wish = {
        id: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        invitation_id: input.invitation_id,
        guest_name: input.guest_name.trim(),
        attendance: input.attendance,
        pax: input.attendance === "hadir" ? input.pax : 0,
        message: input.message.trim(),
        is_hidden: false,
        created_at: new Date().toISOString(),
      };

      this.state.wishes.unshift(newWish);
      return { data: newWish, error: null };
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

      const created: Guest[] = rows.map((row, idx) => ({
        id: `guest-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
        invitation_id: invitationId,
        name: row.name.trim(),
        category: row.category.trim() || "Reguler",
        phone: row.phone?.trim() || null,
        is_sent: false,
        created_at: new Date().toISOString(),
      }));

      this.state.guests.push(...created);
      return { data: created, error: null };
    },

    toggleSent: async (id: string, current: boolean): Promise<StoreResult<void>> => {
      const guest = this.state.guests.find((g) => g.id === id);
      if (!guest) {
        return { data: null, error: new Error("Tamu tidak ditemukan") };
      }
      guest.is_sent = !current;
      return { data: null, error: null };
    },

    remove: async (id: string): Promise<StoreResult<void>> => {
      const idx = this.state.guests.findIndex((g) => g.id === id);
      if (idx === -1) {
        return { data: null, error: new Error("Tamu tidak ditemukan") };
      }
      this.state.guests.splice(idx, 1);
      return { data: null, error: null };
    },
  };

  invitation = {
    update: async (id: string, patch: Partial<Invitation>): Promise<StoreResult<void>> => {
      const existing = this.state.invitations.get(id);
      if (existing) {
        this.state.invitations.set(id, { ...existing, ...patch });
      }
      return { data: null, error: null };
    },
  };

  // Helper inspeksi untuk unit test
  getState(): InMemoryState {
    return this.state;
  }
}
