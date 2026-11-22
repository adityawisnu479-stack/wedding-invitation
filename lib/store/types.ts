import type { Guest, Invitation, Wish } from "../types";

export type WishInput = {
  invitation_id: string;
  guest_name: string;
  attendance: "hadir" | "tidak_hadir" | "masih_ragu";
  pax: number;
  message: string;
};

export type NewGuestInput = {
  name: string;
  category: string;
  phone: string | null;
  invitation_id?: string;
};

export type StoreResult<T> = {
  data: T | null;
  error: Error | null;
  unauthenticated?: boolean;
};

export type TrackItem = {
  name: string;
  url: string;
};

export type PhotoFolder = "cover" | "groom" | "bride" | "gallery";

export type AuthCredentials = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email?: string;
};

export type AuthSessionResult = {
  user: AuthUser | null;
  hasSession: boolean;
};

export interface DataStore {
  account: {
    signIn(creds: AuthCredentials): Promise<StoreResult<AuthSessionResult>>;
    signUp(creds: AuthCredentials): Promise<StoreResult<AuthSessionResult>>;
    signOut(): Promise<StoreResult<void>>;
    createInitialInvitation(): Promise<StoreResult<Invitation>>;
  };
  wishes: {
    submit(input: WishInput): Promise<StoreResult<Wish>>;
    toggleHidden(id: string, current: boolean): Promise<StoreResult<void>>;
    remove(id: string): Promise<StoreResult<void>>;
  };
  guests: {
    add(
      invitationId: string,
      rows: NewGuestInput[]
    ): Promise<StoreResult<Guest[]>>;
    toggleSent(id: string, current: boolean): Promise<StoreResult<void>>;
    remove(id: string): Promise<StoreResult<void>>;
  };
  invitation: {
    update(id: string, patch: Partial<Invitation>): Promise<StoreResult<void>>;
  };
  media: {
    listTracks(): Promise<StoreResult<TrackItem[]>>;
    uploadTrack(
      file: File,
      options?: { invitationId?: string }
    ): Promise<StoreResult<TrackItem>>;
    uploadPhoto(
      folder: PhotoFolder,
      file: File,
      options?: { invitationId?: string }
    ): Promise<StoreResult<string>>;
    uploadPhotos(
      folder: "gallery",
      files: File[],
      options?: { invitationId?: string }
    ): Promise<StoreResult<string[]>>;
  };
}
