"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ExternalLink,
  Globe,
  ImagePlus,
  Loader2,
  Music2,
  Pause,
  Play,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDataStore } from "@/lib/store";
import type { PhotoFolder, TrackItem } from "@/lib/store/types";
import type { Invitation, TemplateId } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";
import { validateSlug } from "@/lib/format";
import { useDashboardStore } from "./DashboardStoreContext";
import { cardClass, ghostBtn, labelClass, primaryBtn } from "./styles";

const TEMPLATES: { id: TemplateId; name: string; desc: string; swatch: string }[] = [
  {
    id: "modern-minimalist",
    name: "Modern Minimalist",
    desc: "Cerah, bersih, tipografi serif klasik dengan aksen sage.",
    swatch: "bg-[linear-gradient(135deg,#faf6f0,#dfe6dc_60%,#c2a878)]",
  },
  {
    id: "classic-luxury",
    name: "Classic Luxury",
    desc: "Nuansa gelap kehijauan dengan ornamen emas yang megah.",
    swatch: "bg-[linear-gradient(135deg,#0d1a16,#1d3a2f_60%,#c2a878)]",
  },
];

export function AppearanceTab() {
  const toast = useToast();
  const { invitation, actions, savingKey } = useDashboardStore();

  const update = async (patch: Partial<Invitation>, key: string) => {
    const res = await actions.updateInvitation(patch, key);
    if (!res.success) return toast(res.error || "Gagal menyimpan perubahan", "error");
    toast("Perubahan disimpan");
  };

  const updateContent = (patch: Partial<Invitation["content"]>, key: string) =>
    actions.updateContent(patch, key);

  const [customSlug, setCustomSlug] = useState(invitation.slug);
  const [slugError, setSlugError] = useState("");

  const handleSaveSlug = async () => {
    const { valid, slug, error } = validateSlug(customSlug);
    if (!valid) {
      setSlugError(error || "Format slug tidak valid");
      return;
    }
    setSlugError("");
    const res = await actions.updateInvitation({ slug }, "slug");
    if (!res.success) {
      const msg = res.error?.includes("unique") || res.error?.includes("duplicate")
        ? "Slug ini sudah dipakai pasangan lain. Pilih nama slug lain."
        : res.error || "Gagal mengubah slug";
      setSlugError(msg);
      return toast(msg, "error");
    }
    setCustomSlug(slug);
    toast("Tautan undangan berhasil diperbarui!");
  };

  return (
    <div className="space-y-4">
      {/* Tautan URL Undangan */}
      <section className={cardClass}>
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-sage" />
          <h2 className="text-sm font-semibold">Tautan Undangan Kamu</h2>
        </div>
        <p className="mt-1 text-xs text-ink/45">
          Tentukan nama unik untuk link undangan pernikahanmu (contoh: andi-siti).
        </p>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center rounded-xl border border-ink/10 bg-white px-3 py-1.5 focus-within:border-sage focus-within:ring-2 focus-within:ring-sage/20">
            <span className="text-xs font-medium text-ink/40 select-none">/u/</span>
            <input
              type="text"
              value={customSlug}
              onChange={(e) => {
                setCustomSlug(e.target.value);
                setSlugError("");
              }}
              placeholder="nama-pasangan"
              className="ml-1 flex-1 bg-transparent text-xs font-semibold text-ink outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleSaveSlug}
            disabled={savingKey === "slug" || customSlug === invitation.slug}
            className={`${primaryBtn} min-h-9 px-4 text-xs disabled:opacity-50`}
          >
            {savingKey === "slug" ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
            Simpan Tautan
          </button>
        </div>

        {slugError ? (
          <p className="mt-2 text-[11px] font-medium text-rose-500">{slugError}</p>
        ) : (
          <p className="mt-2 text-[11px] text-ink/40">
            Hanya huruf kecil, angka, dan tanda strip.
          </p>
        )}
      </section>

      {/* Template */}
      <section className={cardClass}>
        <h2 className="text-sm font-semibold">Desain undangan</h2>
        <p className="mt-1 text-xs text-ink/45">Pilih tampilan yang dipakai tamu saat membuka link.</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {TEMPLATES.map((template) => {
            const active = invitation.active_template === template.id;
            return (
              <div
                key={template.id}
                className={`overflow-hidden rounded-xl border transition ${
                  active ? "border-sage ring-2 ring-sage/20" : "border-ink/10"
                }`}
              >
                <div className={`h-20 ${template.swatch}`} />
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{template.name}</p>
                    {active ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-sage/10 px-2 py-0.5 text-[10px] text-sage">
                        <Check size={10} /> aktif
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-ink/50">{template.desc}</p>
                  <div className="mt-3 flex gap-2">
                    <a
                      href={`/undangan?preview_template=${template.id}&to=Preview`}
                      target="_blank"
                      rel="noreferrer"
                      className={`${ghostBtn} min-h-9 flex-1 px-2 text-xs`}
                    >
                      <ExternalLink size={13} /> Preview
                    </a>
                    {!active ? (
                      <button
                        type="button"
                        onClick={() => update({ active_template: template.id }, "template")}
                        disabled={savingKey === "template"}
                        className={`${ghostBtn} min-h-9 flex-1 px-2 text-xs`}
                      >
                        {savingKey === "template" ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                        Pakai
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section toggles */}
      <section className={cardClass}>
        <h2 className="text-sm font-semibold">Bagian undangan</h2>
        <p className="mt-1 text-xs text-ink/45">Matikan bagian yang tidak ingin ditampilkan.</p>
        <div className="mt-2 divide-y divide-ink/5">
          <Toggle
            label="Love story"
            hint="Timeline perjalanan hubungan kalian."
            checked={invitation.show_love_story}
            onChange={(value) => update({ show_love_story: value }, "love")}
            busy={savingKey === "love"}
          />
          <Toggle
            label="Galeri foto"
            hint="Grid foto prewedding."
            checked={invitation.show_gallery}
            onChange={(value) => update({ show_gallery: value }, "gallery")}
            busy={savingKey === "gallery"}
          />
          <Toggle
            label="Amplop digital"
            hint="Nomor rekening & alamat kirim hadiah."
            checked={invitation.show_gift}
            onChange={(value) => update({ show_gift: value }, "gift")}
            busy={savingKey === "gift"}
          />
        </div>
      </section>

      <MusicPicker />

      {/* Photos */}
      <section className={cardClass}>
        <h2 className="text-sm font-semibold">Foto</h2>
        <p className="mt-1 text-xs text-ink/45">Upload ke Supabase Storage. Format JPG/PNG, maksimal ~5 MB.</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <PhotoUploader
            label="Foto sampul"
            folder="cover"
            value={invitation.content.photos.cover}
            onUploaded={(url) =>
              updateContent({ photos: { ...invitation.content.photos, cover: url } }, "photo-cover")
            }
          />
          <PhotoUploader
            label="Mempelai pria"
            folder="groom"
            value={invitation.content.photos.groom}
            onUploaded={(url) =>
              updateContent({ photos: { ...invitation.content.photos, groom: url } }, "photo-groom")
            }
          />
          <PhotoUploader
            label="Mempelai wanita"
            folder="bride"
            value={invitation.content.photos.bride}
            onUploaded={(url) =>
              updateContent({ photos: { ...invitation.content.photos, bride: url } }, "photo-bride")
            }
          />
        </div>

        <GalleryUploader
          photos={invitation.content.gallery}
          onChange={(gallery) => updateContent({ gallery }, "gallery-photos")}
        />
      </section>
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
  busy,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  busy?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-ink/45">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        disabled={busy}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-60 ${
          checked ? "bg-sage" : "bg-ink/15"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className={`absolute top-1 size-5 rounded-full bg-white shadow ${checked ? "left-6" : "left-1"}`}
        />
      </button>
    </div>
  );
}

function MusicPicker() {
  const toast = useToast();
  const store = useDataStore();
  const { invitation, actions } = useDashboardStore();
  const [tracks, setTracks] = useState<TrackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewing, setPreviewing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const reload = async () => {
    setLoading(true);
    const res = await store.media.listTracks();
    setTracks(res.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    store.media.listTracks().then((res) => {
      if (cancelled) return;
      setTracks(res.data ?? []);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [store]);

  const preview = (url: string) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (previewing === url) {
      audio.pause();
      setPreviewing(null);
      return;
    }
    audio.src = url;
    audio.play().then(() => setPreviewing(url)).catch(() => toast("Lagu tidak bisa diputar", "error"));
  };

  const use = async (url: string) => {
    setSaving(true);
    const res = await actions.updateInvitation({ active_music_url: url }, "music");
    setSaving(false);
    if (!res.success) return toast(res.error || "Gagal menyimpan lagu", "error");
    toast("Musik latar diperbarui");
  };

  const upload = async (file: File) => {
    setUploading(true);
    const res = await store.media.uploadTrack(file);
    setUploading(false);
    if (res.error) return toast(res.error.message || "Gagal mengunggah musik", "error");
    toast("Musik terunggah");
    await reload();
  };

  return (
    <section className={cardClass}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Musik latar</h2>
          <p className="mt-1 text-xs text-ink/45">Pilih lagu bawaan, atau unggah lagu baru (mp3).</p>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className={`${ghostBtn} min-h-9 px-3 text-xs`}
        >
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
          Upload mp3
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".mp3,audio/mpeg"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) upload(file);
            event.target.value = "";
          }}
        />
      </div>
      <audio ref={audioRef} onEnded={() => setPreviewing(null)} className="hidden" />

      {loading ? (
        <div className="mt-4 space-y-2">
          {[0, 1, 2].map((row) => (
            <div key={row} className="skeleton h-12 rounded-xl text-ink/20" />
          ))}
        </div>
      ) : tracks.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-ink/15 py-8 text-center">
          <Music2 className="mx-auto text-ink/25" size={26} />
          <p className="mt-2 text-sm text-ink/50">Belum ada musik di storage.</p>
          <p className="text-xs text-ink/35">Upload mp3 pertama, atau pakai script bawaan untuk lagu default.</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-1.5">
          {tracks.map((track) => {
            const active = invitation.active_music_url === track.url;
            return (
              <li
                key={track.url}
                className={`flex items-center gap-2 rounded-xl border px-2 py-1.5 ${
                  active ? "border-sage/40 bg-sage/5" : "border-transparent hover:bg-ink/[0.03]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => preview(track.url)}
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ink/5 text-ink/70 transition active:scale-95"
                  aria-label={previewing === track.url ? "Jeda" : "Dengarkan"}
                >
                  {previewing === track.url ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <p className="min-w-0 flex-1 truncate text-sm">{track.name}</p>
                {active ? (
                  <span className="shrink-0 rounded-full bg-sage/10 px-2 py-0.5 text-[10px] font-medium text-sage">
                    dipakai
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => use(track.url)}
                    disabled={saving}
                    className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-sage transition hover:bg-sage/10"
                  >
                    Pakai
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function PhotoUploader({
  label,
  folder,
  value,
  onUploaded,
}: {
  label: string;
  folder: PhotoFolder;
  value?: string;
  onUploaded: (url: string) => void;
}) {
  const toast = useToast();
  const store = useDataStore();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    const res = await store.media.uploadPhoto(folder, file);
    setUploading(false);
    if (res.error || !res.data) return toast(res.error?.message || "Gagal mengunggah foto", "error");
    onUploaded(res.data);
    toast(`${label} diperbarui`);
  };

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="group relative mt-1.5 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-ink/15 bg-ink/[0.02] transition hover:border-sage/50"
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt={label} className="size-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
              Ganti foto
            </span>
          </>
        ) : (
          <span className="flex flex-col items-center gap-1 text-ink/40">
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={20} />}
            <span className="text-xs">{uploading ? "Mengunggah..." : "Pilih foto"}</span>
          </span>
        )}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) upload(file);
          event.target.value = "";
        }}
      />
    </div>
  );
}

function GalleryUploader({ photos, onChange }: { photos: string[]; onChange: (photos: string[]) => void }) {
  const toast = useToast();
  const store = useDataStore();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (files: FileList) => {
    setUploading(true);
    const res = await store.media.uploadPhotos("gallery", Array.from(files));
    setUploading(false);
    if (res.error) {
      toast(res.error.message || "Gagal mengunggah foto", "error");
      return;
    }
    const uploaded = res.data ?? [];
    if (uploaded.length > 0) {
      onChange([...photos, ...uploaded]);
      toast(`${uploaded.length} foto ditambahkan`);
    }
  };

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <span className={labelClass}>Galeri ({photos.length})</span>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className={`${ghostBtn} min-h-9 px-3 text-xs`}
        >
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />}
          Tambah foto
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files?.length) upload(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {photos.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-ink/15 py-6 text-center text-xs text-ink/40">
          Belum ada foto galeri.
        </p>
      ) : (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          <AnimatePresence initial={false}>
            {photos.map((photo) => (
              <motion.div
                key={photo}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative aspect-square overflow-hidden rounded-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="Foto galeri" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => onChange(photos.filter((item) => item !== photo))}
                  className="absolute right-1 top-1 rounded-md bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                  aria-label="Hapus foto"
                >
                  <Trash2 size={12} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
