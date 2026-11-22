import { createStarterInvitationContent } from "../../config/wedding.config.ts";
import type { Guest, Invitation, Wish } from "../types";
import type {
  AuthCredentials,
  AuthSessionResult,
  AuthUser,
  DataStore,
  NewGuestInput,
  PhotoFolder,
  StoreResult,
  TrackItem,
  WishInput,
} from "./types";

export type InMemoryState = {
  wishes: Wish[];
  guests: Guest[];
  invitations: Map<string, Invitation>;
  tracks: TrackItem[];
  photos: Map<string, string>;
  currentUser: AuthUser | null;
};

export class InMemoryDataStore implements DataStore {
  private state: InMemoryState;

  constructor(initial?: Partial<InMemoryState>) {
    this.state = {
      wishes: initial?.wishes ? [...initial.wishes] : [],
      guests: initial?.guests ? [...initial.guests] : [],
      invitations: initial?.invitations
        ? new Map(initial.invitations)
        : new Map(),
      tracks: initial?.tracks
        ? [...initial.tracks]
        : [
            { name: "Canon in D", url: "https://example.com/canon.mp3" },
            {
              name: "A Thousand Years",
              url: "https://example.com/thousand-years.mp3",
            },
          ],
      photos: initial?.photos ? new Map(initial.photos) : new Map(),
      currentUser:
        initial && "currentUser" in initial
          ? (initial.currentUser ?? null)
          : { id: "user-test-123", email: "test@example.com" },
    };
  }

  account = {
    signIn: async (
      creds: AuthCredentials
    ): Promise<StoreResult<AuthSessionResult>> => {
      if (!creds.email || !creds.password) {
        return {
          data: null,
          error: new Error("Email dan password wajib diisi."),
        };
      }
      const user: AuthUser = { id: `user-${Date.now()}`, email: creds.email };
      this.state.currentUser = user;
      return { data: { user, hasSession: true }, error: null };
    },

    signUp: async (
      creds: AuthCredentials
    ): Promise<StoreResult<AuthSessionResult>> => {
      if (!creds.email || !creds.password) {
        return {
          data: null,
          error: new Error("Email dan password wajib diisi."),
        };
      }
      const user: AuthUser = { id: `user-${Date.now()}`, email: creds.email };
      this.state.currentUser = user;
      return { data: { user, hasSession: true }, error: null };
    },

    signOut: async (): Promise<StoreResult<void>> => {
      this.state.currentUser = null;
      return { data: undefined, error: null };
    },

    createInitialInvitation: async (): Promise<StoreResult<Invitation>> => {
      if (!this.state.currentUser) {
        return {
          data: null,
          error: new Error("User tidak terautentikasi."),
          unauthenticated: true,
        };
      }
      const randomSuffix = Math.random().toString(36).substring(2, 7);
      const slug = `undangan-${this.state.currentUser.id.slice(0, 8)}-${randomSuffix}`;
      const newInv: Invitation = {
        id: `inv-${Date.now()}`,
        user_id: this.state.currentUser.id,
        slug,
        active_template: "modern-minimalist",
        show_love_story: true,
        show_gallery: true,
        show_gift: true,
        active_music_url: null,
        content: createStarterInvitationContent(),
      };
      this.state.invitations.set(newInv.id, newInv);
      return { data: newInv, error: null };
    },
  };

  wishes = {
    submit: async (input: WishInput): Promise<StoreResult<Wish>> => {
      if (input.guest_name.trim().length < 2) {
        return { data: null, error: new Error("Nama minimal 2 karakter.") };
      }
      if (input.message.trim().length < 2) {
        return {
          data: null,
          error: new Error("Tulis doa atau ucapan dulu ya."),
        };
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

    toggleHidden: async (
      id: string,
      current: boolean
    ): Promise<StoreResult<void>> => {
      const wish = this.state.wishes.find((w) => w.id === id);
      if (!wish) {
        return { data: null, error: new Error("Ucapan tidak ditemukan") };
      }
      wish.is_hidden = !current;
      return { data: null, error: null };
    },

    remove: async (id: string): Promise<StoreResult<void>> => {
      const idx = this.state.wishes.findIndex((w) => w.id === id);
      if (idx === -1) {
        return { data: null, error: new Error("Ucapan tidak ditemukan") };
      }
      this.state.wishes.splice(idx, 1);
      return { data: null, error: null };
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

    toggleSent: async (
      id: string,
      current: boolean
    ): Promise<StoreResult<void>> => {
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
    update: async (
      id: string,
      patch: Partial<Invitation>
    ): Promise<StoreResult<void>> => {
      const existing = this.state.invitations.get(id);
      if (existing) {
        this.state.invitations.set(id, { ...existing, ...patch });
      }
      return { data: null, error: null };
    },
  };

  media = {
    listTracks: async (): Promise<StoreResult<TrackItem[]>> => {
      return { data: [...this.state.tracks], error: null };
    },

    uploadTrack: async (
      file: File,
      options?: { invitationId?: string }
    ): Promise<StoreResult<TrackItem>> => {
      if (!/\.mp3$/i.test(file.name)) {
        return { data: null, error: new Error("Format musik harus .mp3") };
      }
      const cleanName = file.name.replace(/\.mp3$/i, "").replace(/^\d+-/, "");
      const tenantPrefix = options?.invitationId
        ? `${this.state.currentUser?.id ?? "anonymous"}/${options.invitationId}/`
        : "";
      const newTrack: TrackItem = {
        name: cleanName,
        url: `https://mock-storage.local/music/${tenantPrefix}${Date.now()}-${file.name}`,
      };
      this.state.tracks.push(newTrack);
      return { data: newTrack, error: null };
    },

    uploadPhoto: async (
      folder: PhotoFolder,
      file: File,
      options?: { invitationId?: string }
    ): Promise<StoreResult<string>> => {
      const tenantPrefix = options?.invitationId
        ? `${this.state.currentUser?.id ?? "anonymous"}/${options.invitationId}/`
        : "";
      const url = `https://mock-storage.local/photos/${tenantPrefix}${folder}/${Date.now()}-${file.name}`;
      this.state.photos.set(`${tenantPrefix}${folder}/${file.name}`, url);
      return { data: url, error: null };
    },

    uploadPhotos: async (
      folder: "gallery",
      files: File[],
      options?: { invitationId?: string }
    ): Promise<StoreResult<string[]>> => {
      const urls: string[] = [];
      for (const file of files) {
        const res = await this.media.uploadPhoto(folder, file, options);
        if (res.data) urls.push(res.data);
      }
      return { data: urls, error: null };
    },
  };

  // Helper inspeksi untuk unit test
  getState(): InMemoryState {
    return this.state;
  }
}
