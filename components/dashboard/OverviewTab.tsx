"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, MessageSquareHeart, Trash2, UserCheck, UserX, Users } from "lucide-react";
import { useState } from "react";
import { attendanceLabel, relativeTime } from "@/lib/format";
import type { Wish } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";
import { useDashboardStore } from "./DashboardStoreContext";
import { cardClass, iconBtn } from "./styles";

export function OverviewTab() {
  const toast = useToast();
  const { guests, wishes, actions } = useDashboardStore();
  const [busyId, setBusyId] = useState<string | null>(null);

  const hadir = wishes.filter((wish) => wish.attendance === "hadir");
  const datang = hadir.reduce((total, wish) => total + wish.pax, 0);
  const tidakHadir = wishes.filter((wish) => wish.attendance === "tidak_hadir").length;

  const stats = [
    { label: "Tamu diundang", value: guests.length, icon: Users, tint: "bg-sky-50 text-sky-600" },
    { label: "Konfirmasi hadir", value: datang, icon: UserCheck, tint: "bg-emerald-50 text-emerald-600" },
    { label: "Tidak hadir", value: tidakHadir, icon: UserX, tint: "bg-rose-50 text-rose-500" },
    {
      label: "Ucapan masuk",
      value: wishes.length,
      icon: MessageSquareHeart,
      tint: "bg-amber-50 text-amber-600",
    },
  ];

  const toggleHidden = async (wish: Wish) => {
    setBusyId(wish.id);
    const res = await actions.toggleWishHidden(wish);
    setBusyId(null);
    if (!res.success) return toast(res.error || "Gagal mengubah ucapan", "error");
    toast(wish.is_hidden ? "Ucapan ditampilkan lagi" : "Ucapan disembunyikan dari tamu");
  };

  const remove = async (wish: Wish) => {
    if (!window.confirm(`Hapus ucapan dari ${wish.guest_name}?`)) return;
    setBusyId(wish.id);
    const res = await actions.removeWish(wish);
    setBusyId(null);
    if (!res.success) return toast(res.error || "Gagal menghapus ucapan", "error");
    toast("Ucapan dihapus");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className={cardClass}
          >
            <div className={`inline-flex size-9 items-center justify-center rounded-xl ${stat.tint}`}>
              <stat.icon size={17} />
            </div>
            <p className="mt-3 text-2xl font-semibold tabular-nums">{stat.value}</p>
            <p className="text-xs text-ink/50">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className={cardClass}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">RSVP & ucapan terbaru</h2>
          <span className="text-xs text-ink/40">{wishes.length} total</span>
        </div>

        {wishes.length === 0 ? (
          <div className="py-14 text-center">
            <MessageSquareHeart className="mx-auto text-ink/20" size={32} />
            <p className="mt-3 text-sm text-ink/50">Belum ada ucapan yang masuk.</p>
            <p className="text-xs text-ink/35">Bagikan link undangan agar tamu bisa mengisi RSVP.</p>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-ink/5">
            {wishes.map((wish) => (
              <motion.li
                key={wish.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: busyId === wish.id ? 0.4 : 1 }}
                className="flex gap-3 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{wish.guest_name}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        wish.attendance === "hadir"
                          ? "bg-emerald-50 text-emerald-600"
                          : wish.attendance === "tidak_hadir"
                            ? "bg-rose-50 text-rose-500"
                            : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {attendanceLabel(wish.attendance)}
                      {wish.attendance === "hadir" && wish.pax > 1 ? ` · ${wish.pax} org` : ""}
                    </span>
                    {wish.is_hidden ? (
                      <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] text-ink/50">Disembunyikan</span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-ink/65">{wish.message}</p>
                  <p className="mt-1 text-[11px] text-ink/35">{relativeTime(wish.created_at)}</p>
                </div>
                <div className="flex shrink-0 items-start gap-1">
                  <button
                    type="button"
                    className={iconBtn}
                    onClick={() => toggleHidden(wish)}
                    disabled={busyId === wish.id}
                    aria-label={wish.is_hidden ? "Tampilkan ucapan" : "Sembunyikan ucapan"}
                    title={wish.is_hidden ? "Tampilkan" : "Sembunyikan"}
                  >
                    {wish.is_hidden ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    type="button"
                    className={`${iconBtn} hover:text-rose-600`}
                    onClick={() => remove(wish)}
                    disabled={busyId === wish.id}
                    aria-label="Hapus ucapan"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
