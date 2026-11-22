"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Loader2, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDataStore } from "@/lib/store";

export function LoginForm() {
  const router = useRouter();
  const store = useDataStore();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setPending(true);

    if (mode === "signin") {
      const { error: authError } = await store.account.signIn({
        email: email.trim(),
        password,
      });

      if (authError) {
        setPending(false);
        setError(
          authError.message.toLowerCase().includes("invalid")
            ? "Email atau password salah."
            : `Gagal masuk: ${authError.message}`
        );
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } else {
      // Sign Up
      const { data, error: signUpError } = await store.account.signUp({
        email: email.trim(),
        password,
      });

      setPending(false);

      if (signUpError) {
        setError(`Gagal mendaftar: ${signUpError.message}`);
        return;
      }

      // Jika user langsung terautentikasi (email confirmation dimatikan di Supabase)
      if (data?.hasSession) {
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      setSuccess(
        "Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi atau coba masuk."
      );
      setMode("signin");
    }
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-sm rounded-2xl border border-ink/10 bg-white p-6 shadow-sm"
      noValidate
    >
      <div className="flex rounded-xl bg-ink/5 p-1">
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setError("");
            setSuccess("");
          }}
          className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
            mode === "signin"
              ? "bg-white text-ink shadow-xs"
              : "text-ink/50 hover:text-ink"
          }`}
        >
          Masuk
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError("");
            setSuccess("");
          }}
          className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
            mode === "signup"
              ? "bg-white text-ink shadow-xs"
              : "text-ink/50 hover:text-ink"
          }`}
        >
          Daftar Akun
        </button>
      </div>

      <h1 className="mt-5 font-serif text-2xl">
        {mode === "signin" ? "Masuk Dashboard" : "Buat Akun Pemilik"}
      </h1>
      <p className="mt-1 text-sm text-ink/50">
        {mode === "signin"
          ? "Kelola tamu, RSVP, desain, dan musik undangan."
          : "Daftar untuk mengelola undangan pernikahan Anda sendiri."}
      </p>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink/45">
            Email
          </span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="kamu@contoh.com"
            className="mt-1.5 min-h-11 w-full rounded-xl border border-ink/12 bg-white px-3 text-sm outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/20"
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink/45">
            Password
          </span>
          <input
            type="password"
            autoComplete={
              mode === "signin" ? "current-password" : "new-password"
            }
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimal 6 karakter"
            className="mt-1.5 min-h-11 w-full rounded-xl border border-ink/12 bg-white px-3 text-sm outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/20"
          />
        </label>

        {error ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [0, -6, 6, -3, 0] }}
            transition={{ duration: 0.35 }}
            className="rounded-xl bg-rose-500/10 px-3 py-2 text-xs text-rose-600"
            role="alert"
          >
            {error}
          </motion.p>
        ) : null}

        {success ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700"
            role="status"
          >
            {success}
          </motion.p>
        ) : null}

        <button
          type="submit"
          disabled={pending || !email || !password}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-sage text-sm font-semibold text-cream transition hover:bg-[#5c6c5f] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : mode === "signin" ? (
            <LogIn size={16} />
          ) : (
            <UserPlus size={16} />
          )}
          {pending
            ? "Memproses..."
            : mode === "signin"
              ? "Masuk"
              : "Daftar & Buat Undangan"}
        </button>
      </div>

      <Link
        href="/undangan"
        className="mt-5 inline-flex min-h-9 items-center gap-1.5 text-xs text-ink/45 transition hover:text-ink"
      >
        <ArrowLeft size={13} /> Lihat contoh undangan
      </Link>
    </motion.form>
  );
}
