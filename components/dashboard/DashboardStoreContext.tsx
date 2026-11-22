"use client";

import React, { createContext, useContext, useState, useTransition } from "react";
import type { Guest, Invitation, Wish } from "@/lib/types";
import { useDataStore, type NewGuestInput } from "@/lib/store";

export interface DashboardStore {
  invitation: Invitation;
  guests: Guest[];
  wishes: Wish[];
  savingKey: string | null;
  actions: {
    addGuests: (rows: NewGuestInput[]) => Promise<{ success: boolean; error?: string }>;
    removeGuest: (guest: Guest) => Promise<{ success: boolean; error?: string }>;
    toggleGuestSent: (guest: Guest) => Promise<{ success: boolean; error?: string }>;
    toggleWishHidden: (wish: Wish) => Promise<{ success: boolean; error?: string }>;
    removeWish: (wish: Wish) => Promise<{ success: boolean; error?: string }>;
    updateInvitation: (patch: Partial<Invitation>, key?: string) => Promise<{ success: boolean; error?: string }>;
    updateContent: (patch: Partial<Invitation["content"]>, key?: string) => Promise<{ success: boolean; error?: string }>;
  };
}

const DashboardStoreContext = createContext<DashboardStore | null>(null);

export function DashboardProvider({
  initialInvitation,
  initialGuests,
  initialWishes,
  children,
}: {
  initialInvitation: Invitation;
  initialGuests: Guest[];
  initialWishes: Wish[];
  children: React.ReactNode;
}) {
  const store = useDataStore();
  const [invitation, setInvitation] = useState<Invitation>(initialInvitation);
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const actions: DashboardStore["actions"] = {
    addGuests: async (rows: NewGuestInput[]) => {
      const { data, error } = await store.guests.add(invitation.id, rows);
      if (error) {
        return { success: false, error: error.message };
      }
      if (data) {
        startTransition(() => {
          setGuests((prev) => [...prev, ...data]);
        });
      }
      return { success: true };
    },

    removeGuest: async (guest: Guest) => {
      const { error } = await store.guests.remove(guest.id);
      if (error) {
        return { success: false, error: error.message };
      }
      startTransition(() => {
        setGuests((prev) => prev.filter((item) => item.id !== guest.id));
      });
      return { success: true };
    },

    toggleGuestSent: async (guest: Guest) => {
      const { error } = await store.guests.toggleSent(guest.id, guest.is_sent);
      if (error) {
        return { success: false, error: error.message };
      }
      startTransition(() => {
        setGuests((prev) =>
          prev.map((item) => (item.id === guest.id ? { ...item, is_sent: !item.is_sent } : item)),
        );
      });
      return { success: true };
    },

    toggleWishHidden: async (wish: Wish) => {
      const { error } = await store.wishes.toggleHidden(wish.id, wish.is_hidden);
      if (error) {
        return { success: false, error: error.message };
      }
      startTransition(() => {
        setWishes((prev) =>
          prev.map((item) => (item.id === wish.id ? { ...item, is_hidden: !item.is_hidden } : item)),
        );
      });
      return { success: true };
    },

    removeWish: async (wish: Wish) => {
      const { error } = await store.wishes.remove(wish.id);
      if (error) {
        return { success: false, error: error.message };
      }
      startTransition(() => {
        setWishes((prev) => prev.filter((item) => item.id !== wish.id));
      });
      return { success: true };
    },

    updateInvitation: async (patch: Partial<Invitation>, key = "invitation") => {
      setSavingKey(key);
      const { error } = await store.invitation.update(invitation.id, patch);
      setSavingKey(null);
      if (error) {
        return { success: false, error: error.message };
      }
      startTransition(() => {
        setInvitation((prev) => ({ ...prev, ...patch }));
      });
      return { success: true };
    },

    updateContent: async (patch: Partial<Invitation["content"]>, key = "content") => {
      return actions.updateInvitation({ content: { ...invitation.content, ...patch } }, key);
    },
  };

  const value: DashboardStore = {
    invitation,
    guests,
    wishes,
    savingKey,
    actions,
  };

  return <DashboardStoreContext.Provider value={value}>{children}</DashboardStoreContext.Provider>;
}

export function useDashboardStore(): DashboardStore {
  const ctx = useContext(DashboardStoreContext);
  if (!ctx) {
    throw new Error("useDashboardStore harus digunakan di dalam DashboardProvider");
  }
  return ctx;
}
