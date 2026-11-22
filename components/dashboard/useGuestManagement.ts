"use client";

import { useMemo, useState } from "react";
import { inviteUrl, parseGuestLines } from "@/lib/format";
import type { Guest } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";
import { useDashboardStore } from "./DashboardStoreContext";

export function useGuestManagement({ slug }: { slug: string }) {
  const toast = useToast();
  const { guests, actions } = useDashboardStore();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Reguler");
  const [phone, setPhone] = useState("");

  const [bulk, setBulk] = useState("");
  const [showBulk, setShowBulk] = useState(false);

  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);

  const origin = typeof window === "undefined" ? "" : window.location.origin;

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return guests;
    return guests.filter(
      (guest) =>
        guest.name.toLowerCase().includes(term) ||
        guest.category.toLowerCase().includes(term) ||
        (guest.phone ?? "").includes(term),
    );
  }, [guests, query]);

  const insert = async (rows: { name: string; category: string; phone: string | null }[]) => {
    if (rows.length === 0) {
      toast("Tidak ada nama yang bisa ditambahkan", "error");
      return;
    }

    setPending(true);
    const res = await actions.addGuests(rows);
    setPending(false);

    if (!res.success) {
      toast(res.error || "Gagal menambah tamu", "error");
      return;
    }
    toast(`${rows.length} tamu ditambahkan`);
  };

  const addSingle = async (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2) {
      toast("Nama tamu minimal 2 karakter", "error");
      return;
    }
    await insert([{ name: name.trim(), category: category.trim() || "Reguler", phone: phone.trim() || null }]);
    setName("");
    setPhone("");
  };

  const addBulk = async () => {
    const rows = parseGuestLines(bulk);
    await insert(rows);
    setBulk("");
    setShowBulk(false);
  };

  const copyLink = async (guest: Guest) => {
    try {
      await navigator.clipboard.writeText(inviteUrl(origin, slug, guest.name));
      toast(`Link ${guest.name} disalin`);
    } catch {
      toast("Gagal menyalin link", "error");
    }
  };

  const markSent = async (guest: Guest) => {
    const res = await actions.toggleGuestSent(guest);
    if (!res.success) {
      toast(res.error || "Gagal memperbarui status", "error");
    }
  };

  const remove = async (guest: Guest) => {
    if (!window.confirm(`Hapus ${guest.name} dari daftar tamu?`)) return;
    const res = await actions.removeGuest(guest);
    if (!res.success) {
      toast(res.error || "Gagal menghapus tamu", "error");
      return;
    }
    toast("Tamu dihapus");
  };

  return {
    query,
    setQuery,
    filteredGuests: filtered,
    pending,
    form: {
      name,
      setName,
      category,
      setCategory,
      phone,
      setPhone,
      submit: addSingle,
    },
    bulk: {
      text: bulk,
      setText: setBulk,
      isOpen: showBulk,
      setIsOpen: setShowBulk,
      submit: addBulk,
    },
    actions: {
      copyLink,
      markSent,
      remove,
    },
  };
}
