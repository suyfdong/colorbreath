"use client";

import { useRef, useState, useCallback } from "react";

interface AudioPlayerProps {
  src: string;
  title: string;
  duration: string;
  defaultVolume?: number;
  bars?: number;
  barHeight?: number;
  className?: string;
  /** Compact mode for small spaces like paint sidebar */
  compact?: boolean;
}

export default function AudioPlayer({
  src,
  title,
  duration,
  defaultVolume = 0.6,
  bars = 50,
  barHeight = 40,
  className = "",
  compact = false,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.volume = volume;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing, volume]);

  const handleVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  if (compact) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <audio ref={audioRef} src={src} loop preload="none" />
        <button
          onClick={toggle}
          className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${
            playing
              ? "bg-accent-amber/20 text-accent-amber"
              : "text-text-secondary hover:bg-bg-surface hover:text-text-primary"
          }`}
        >
          {playing ? (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
          <span>{playing ? "Pause" : "Play ambient"}</span>
        </button>
        {playing && (
          <div className="flex items-center gap-2 px-3">
            <svg className="h-3 w-3 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3z" />
            </svg>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={handleVolume}
              className="h-1 w-full appearance-none rounded-full bg-bg-surface accent-accent-amber"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <audio ref={audioRef} src={src} loop preload="none" />

      {/* Clickable waveform */}
      <button
        onClick={toggle}
        className="group relative flex items-end gap-[2px] cursor-pointer"
        style={{ height: barHeight }}
        aria-label={playing ? "Pause audio" : "Play audio"}
      >
        {Array.from({ length: bars }).map((_, i) => {
          const center = bars / 2;
          const dist = Math.abs(i - center) / center;
          const height = Math.max(
            0.15,
            (1 - dist * dist) * (0.5 + Math.sin(i * 0.8) * 0.3)
          );
          return (
            <div
              key={i}
              className={`w-[2px] rounded-full transition-colors duration-300 ${
                playing
                  ? "bg-accent-amber/60"
                  : "bg-accent-amber/30 group-hover:bg-accent-amber/50"
              }`}
              style={{
                height: `${height * 100}%`,
                ...(playing
                  ? {
                      animationName: "wave-bar",
                      animationDuration: `${1.5 + Math.random() * 1.5}s`,
                      animationTimingFunction: "ease-in-out",
                      animationIterationCount: "infinite",
                      animationDelay: `${i * 0.05}s`,
                    }
                  : {}),
              }}
            />
          );
        })}

        {/* Play/pause overlay icon */}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-amber/20 backdrop-blur-sm transition-all duration-300 group-hover:bg-accent-amber/30 group-hover:scale-110">
              <svg className="ml-0.5 h-3.5 w-3.5 text-accent-amber" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </button>

      {/* Title + hint */}
      <div className="mt-3 flex flex-col items-center gap-1">
        <p className="text-sm font-light text-text-secondary">
          {title} &middot; {duration}
        </p>
        {!playing && (
          <p className="text-xs font-light text-accent-amber/50 animate-pulse">
            Tap to play ambient sound
          </p>
        )}
      </div>

      {/* Volume slider — only show when playing */}
      {playing && (
        <div className="mt-2 flex items-center gap-2">
          <svg className="h-3 w-3 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3z" />
          </svg>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={handleVolume}
            className="h-1 w-20 appearance-none rounded-full bg-bg-surface accent-accent-amber"
          />
        </div>
      )}
    </div>
  );
}
