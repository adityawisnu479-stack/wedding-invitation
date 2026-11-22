"use client";

import { motion } from "framer-motion";
import { ExternalLink, HeartHandshake, LayoutDashboard, LogOut, Settings2, Sparkles, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { weddingConfig } from "@/config/wedding.config";
import type { DashboardData } from "@/lib/data";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { Invitation } from "@/lib/types";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { AppearanceTab } from "./AppearanceTab";
import { ContentTab } from "./ContentTab";
import { DashboardProvider } from "./DashboardStoreContext";
import { GuestsTab } from "./GuestsTab";
import { OverviewTab } from "./OverviewTab";
import { cardClass, ghostBtn, primaryBtn } from "./styles";

const TABS = [
  { id: "overview", label: "Ringkasan", icon: LayoutDashboard },
  { id: "content", label: "Mempelai & Acara", icon: HeartHandshake },
  { id: "guests", label: "Tamu", icon: Users },
  { id: "appearance", label: "Tampilan", icon: Settings2 },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function DashboardShell({ data }: { data: DashboardData }) {
  return (
    <ToastProvider>
      <DashboardProvider
        initialInvitation={data.invitation}
        initialGuests={data.guests}
        initialWishes={data.wishes}
      >
        <DashboardInner data={data} />
      </DashboardProvider>
    </ToastProvider>
  );
}

function DashboardInner({ data }: { data: DashboardData }) {
  const router = useRouter();
  const toast = useToast();
  const [tab, setTab] = useState<TabId>("overview");
  const [invitation, setInvitation] = useState<Invitation>(data.invitation);
  const [creating, setCreating] = useState(false);

  const needsSetup = invitation.id === "local";

  const createInvitation = async () => {
    setCreating(true);
    const client = supabaseBrowser();
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    const { data: created, error } = await client
      .from("invitations")
      .insert({ user_id: user.id, slug: "default", content: weddingConfig })
      .select()
      .single();
    setCreating(false);
    if (error) return toast("Gagal membuat undangan", "error");
    setInvitation(created as Invitation);
    toast("Undangan berhasil dibuat");
  };

  const logout = async () => {
    await supabaseBrowser().auth.signOut();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef] pb-16">
      <header className="sticky top-0 z-40 border-b border-ink/5 bg-[#f7f4ef]/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-sage text-cream">
            <Sparkles size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Dashboard Undangan</p>
            <p className="truncate text-[11px] text-ink/40">{data.email}</p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink/50 transition hover:bg-ink/5 hover:text-ink"
            title="Lihat undangan"
          >
            <ExternalLink size={16} />
          </a>
          <button
            type="button"
            onClick={logout}
            className="inline-flex size-9 items-center justify-center rounded-lg text-ink/50 transition hover:bg-ink/5 hover:text-rose-600"
            title="Keluar"
          >
            <LogOut size={16} />
          </button>
        </div>

        <div className="mx-auto flex max-w-3xl gap-1 px-4 pb-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`relative flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition ${
                tab === item.id ? "text-ink" : "text-ink/45 hover:text-ink/70"
              }`}
            >
              {tab === item.id ? (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-lg bg-white shadow-sm ring-1 ring-ink/5"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative flex items-center gap-1.5">
                <item.icon size={14} /> {item.label}
              </span>
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-5">
        {needsSetup ? (
          <div className={`${cardClass} text-center`}>
            <Sparkles className="mx-auto text-sage" size={28} />
            <h1 className="mt-3 text-base font-semibold">Buat undangan pertamamu</h1>
            <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-ink/55">
              Data acara diambil dari <code className="rounded bg-ink/5 px-1 text-xs">config/wedding.config.ts</code>.
              Setelah dibuat, kamu bisa mengatur tamu, RSVP, desain, dan musik di sini.
            </p>
            <button type="button" onClick={createInvitation} disabled={creating} className={`${primaryBtn} mt-4`}>
              {creating ? "Membuat..." : "Buat undangan"}
            </button>
          </div>
        ) : (
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            {tab === "overview" ? <OverviewTab /> : null}
            {tab === "content" ? <ContentTab /> : null}
            {tab === "guests" ? (
              <GuestsTab
                waMessage={invitation.content.waMessage || weddingConfig.waMessage}
                slug={invitation.slug}
              />
            ) : null}
            {tab === "appearance" ? <AppearanceTab /> : null}
          </motion.div>
        )}

        <div className="mt-8 flex items-center justify-between gap-2">
          <a href="/undangan" target="_blank" rel="noreferrer" className={`${ghostBtn} min-h-10 px-3 text-xs`}>
            <ExternalLink size={14} /> Buka undangan
          </a>
          <p className="text-[11px] text-ink/30">Undangan pernikahan · {new Date().getFullYear()}</p>
        </div>
      </main>
    </div>
  );
}
