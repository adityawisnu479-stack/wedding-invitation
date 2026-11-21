export type GuestInput = { name: string; category: string; phone: string | null };

/** Parse paste massal dari Excel (tab) atau ketikan manual (koma). Satu baris satu tamu. */
export function parseGuestLines(text: string): GuestInput[] {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const result: GuestInput[] = [];

  for (const row of rows) {
    const cols = (row.includes("\t") ? row.split("\t") : row.split(",")).map((c) => c.trim());
    const name = cols[0];
    if (!name || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());

    const category = cols.length >= 3 && cols[1] ? cols[1] : "Reguler";
    const phone = (cols.length >= 3 ? cols[2] : cols[1]) || null;
    result.push({ name, category, phone: phone ? normalizePhone(phone) : null });
  }

  return result;
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits.slice(1);
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  return `62${digits}`;
}

export function waShareUrl(phone: string | null, message: string): string {
  const text = encodeURIComponent(message);
  return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
}

export function inviteUrl(origin: string, slug: string, guestName?: string): string {
  const base = `${origin}/undangan`;
  return guestName ? `${base}?to=${encodeURIComponent(guestName)}` : base;
}

export function messageForGuest(template: string, guest: string, url: string): string {
  return template.replaceAll("{guest}", guest).replaceAll("{url}", url);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}

export function formatTime(iso: string): string {
  return `${new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso))} WIB`;
}

export function countdownParts(target: string, now: number = Date.now()) {
  const diff = Math.max(0, new Date(target).getTime() - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds, done: diff === 0 };
}

export function relativeTime(iso: string, now: number = Date.now()): string {
  const diff = Math.floor((now - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86_400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86_400)} hari lalu`;
}

export function attendanceLabel(value: string): string {
  if (value === "hadir") return "Hadir";
  if (value === "tidak_hadir") return "Tidak hadir";
  return "Masih ragu";
}
