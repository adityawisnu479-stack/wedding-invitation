"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { attendanceLabel, relativeTime } from "@/lib/format";
import { useDataStore } from "@/lib/store";
import type { Wish } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";
import { toneStyles, type Tone } from "./theme";

const ATTENDANCE = [
  { value: "hadir", label: "Hadir" },
  { value: "tidak_hadir", label: "Tidak hadir" },
  { value: "masih_ragu", label: "Masih ragu" },
] as const;

export function RsvpWishes({
  invitationId,
  initialWishes,
  guestName,
  tone = "light",
}: {
  invitationId: string;
  initialWishes: Wish[];
  guestName?: string;
  tone?: Tone;
}) {
  const s = toneStyles[tone];
  const toast = useToast();
  const store = useDataStore();
  const [wishes, setWishes] = useState(initialWishes);
  const [name, setName] = useState(guestName ?? "");
  const [attendance, setAttendance] = useState<(typeof ATTENDANCE)[number]["value"]>("hadir");
  const [pax, setPax] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [justSent, setJustSent] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    setPending(true);
    const { data, error: submitError } = await store.wishes.submit({
      invitation_id: invitationId,
      guest_name: name,
      attendance,
      pax,
      message,
    });
    setPending(false);

    if (submitError) {
      setError(submitError.message);
      toast(submitError.message, "error");
      return;
    }

    if (data) {
      setWishes((prev) => [data, ...prev]);
    }
    setMessage("");
    setJustSent(true);
    toast("Terima kasih! Doa & konfirmasi sudah terkirim");
    setTimeout(() => setJustSent(false), 2400);
  };

  const attended = wishes.filter((wish) => wish.attendance === "hadir").length;

  return (
    <div className="mx-auto grid max-w-3xl gap-6 lg:grid-cols-[1fr_1fr]">
      <form onSubmit={submit} className={`rounded-3xl p-5 sm:p-6 ${s.card}`} noValidate>
        <div className="space-y-4">
          <label className="block">
            <span className={`text-xs uppercase tracking-[0.2em] ${s.muted}`}>Nama</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nama kamu"
              className={`mt-1.5 min-h-11 w-full rounded-xl px-3 text-sm outline-none transition ${s.input}`}
            />
          </label>

          <div>
            <span className={`text-xs uppercase tracking-[0.2em] ${s.muted}`}>Konfirmasi kehadiran</span>
            <div className="mt-1.5 flex gap-2">
              {ATTENDANCE.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setAttendance(option.value)}
                  className={`min-h-11 flex-1 rounded-xl px-2 text-xs font-medium transition active:scale-[0.97] ${
                    attendance === option.value ? s.chipActive : s.chip
                  }`}
                  aria-pressed={attendance === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence initial={false}>
            {attendance === "hadir" ? (
              <motion.label
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="block overflow-hidden"
              >
                <span className={`text-xs uppercase tracking-[0.2em] ${s.muted}`}>Jumlah orang</span>
                <select
                  value={pax}
                  onChange={(event) => setPax(Number(event.target.value))}
                  className={`mt-1.5 min-h-11 w-full rounded-xl px-3 text-sm outline-none transition ${s.input}`}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <option key={value} value={value} className="text-ink">
                      {value} orang
                    </option>
                  ))}
                </select>
              </motion.label>
            ) : null}
          </AnimatePresence>

          <label className="block">
            <span className={`text-xs uppercase tracking-[0.2em] ${s.muted}`}>Ucapan & doa</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
              placeholder="Tulis doa terbaikmu untuk kami..."
              className={`mt-1.5 w-full resize-none rounded-xl px-3 py-2.5 text-sm outline-none transition ${s.input}`}
            />
          </label>

          {error ? (
            <motion.p
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: [0, -6, 6, -3, 0] }}
              transition={{ duration: 0.4 }}
              className="rounded-xl bg-rose-500/10 px-3 py-2 text-xs text-rose-500"
              role="alert"
            >
              {error}
            </motion.p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition active:scale-[0.98] disabled:opacity-70 ${s.primary}`}
          >
            {pending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : justSent ? (
              <CheckCircle2 size={16} />
            ) : (
              <Send size={16} />
            )}
            {pending ? "Mengirim..." : justSent ? "Terkirim" : "Kirim ucapan"}
          </button>
        </div>
      </form>

      <div className={`rounded-3xl p-5 sm:p-6 ${s.card}`}>
        <div className="flex items-baseline justify-between">
          <p className={`font-serif text-lg ${tone === "light" ? "text-ink" : "text-cream"}`}>Ucapan & doa</p>
          <p className={`text-xs ${s.muted}`}>{attended} hadir</p>
        </div>

        <div className="mt-4 max-h-[360px] space-y-3 overflow-y-auto pr-1">
          {wishes.length === 0 ? (
            <p className={`py-10 text-center text-sm ${s.faint}`}>
              Belum ada ucapan. Jadilah yang pertama memberikan doa.
            </p>
          ) : (
            <AnimatePresence initial={false}>
              {wishes.map((wish) => (
                <motion.article
                  key={wish.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`rounded-2xl px-4 py-3 ${
                    tone === "light" ? "bg-cream/80" : "bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-semibold ${tone === "light" ? "text-ink" : "text-cream"}`}>
                      {wish.guest_name}
                    </p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${s.badge}`}>
                      {attendanceLabel(wish.attendance)}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm leading-relaxed ${s.muted}`}>{wish.message}</p>
                  <p className={`mt-1.5 text-[10px] uppercase tracking-wider ${s.faint}`}>
                    {relativeTime(wish.created_at)}
                  </p>
                </motion.article>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
