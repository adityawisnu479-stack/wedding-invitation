"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { DataStore } from "./types";
import { SupabaseDataStore } from "./supabase-data-store";

const DataStoreContext = createContext<DataStore | null>(null);

export function DataStoreProvider({
  children,
  store,
}: {
  children: React.ReactNode;
  store?: DataStore;
}) {
  const activeStore = useMemo(() => store ?? new SupabaseDataStore(), [store]);

  return <DataStoreContext.Provider value={activeStore}>{children}</DataStoreContext.Provider>;
}

export function useDataStore(): DataStore {
  const ctx = useContext(DataStoreContext);
  if (!ctx) {
    // Fallback jika komponen dirender di luar provider
    return new SupabaseDataStore();
  }
  return ctx;
}
