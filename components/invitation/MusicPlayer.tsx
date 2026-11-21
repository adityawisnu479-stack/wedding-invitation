"use client";

import { Disc3, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function MusicPlayer({ src, shouldPlay }: { src: string | null; shouldPlay: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src || !shouldPlay) return;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [shouldPlay, src]);

  if (!src) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-4 z-[60]">
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Jeda musik" : "Putar musik"}
        className="relative flex size-12 items-center justify-center rounded-full bg-white/15 text-white shadow-xl ring-1 ring-white/30 backdrop-blur-md transition active:scale-95"
      >
        <Disc3 size={26} className={playing ? "animate-slow-spin opacity-90" : "opacity-70"} />
        <span className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-white text-ink shadow">
          {playing ? <Pause size={10} /> : <Play size={10} />}
        </span>
      </button>
    </div>
  );
}
