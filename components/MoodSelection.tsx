"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

const moods = [
  {
    name: "Calm",
    phrase: "Find your center",
    color: "#b5a7c8",
    bgImage:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=400&q=80&auto=format",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1}>
        <circle cx="24" cy="24" r="18" />
        <circle cx="24" cy="24" r="11" opacity={0.5} />
        <circle cx="24" cy="24" r="5" opacity={0.3} />
      </svg>
    ),
  },
  {
    name: "Sleep",
    phrase: "Evening peace",
    color: "#7e8db5",
    bgImage:
      "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=400&q=80&auto=format",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1}>
        <path d="M32 26A14 14 0 0 1 20 6a14 14 0 1 0 12 20z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Energy",
    phrase: "Morning light",
    color: "#c9a87c",
    bgImage:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=400&q=80&auto=format",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1}>
        <circle cx="24" cy="24" r="7" />
        <path d="M24 6v5M24 37v5M6 24h5M37 24h5M11.4 11.4l3.5 3.5M33.1 33.1l3.5 3.5M11.4 36.6l3.5-3.5M33.1 14.9l3.5-3.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Comfort",
    phrase: "Gentle embrace",
    color: "#8ba583",
    bgImage:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80&auto=format",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1}>
        <path d="M16 40C10 36 4 30 4 22a10 10 0 0 1 20 0" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M32 40c6-4 12-10 12-18a10 10 0 0 0-20 0" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function MoodSelection() {
  return (
    <section id="moods" className="relative flex flex-col items-center px-6 py-32 md:py-44">
      {/* Section heading */}
      <ScrollReveal animation="blur-in">
        <p className="mb-20 font-[family-name:var(--font-guidance)] text-2xl font-light italic text-text-secondary md:mb-24 md:text-3xl">
          How are you feeling tonight?
        </p>
      </ScrollReveal>

      {/* Mood cards */}
      <div className="grid w-full max-w-5xl grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
        {moods.map((mood, i) => (
          <ScrollReveal key={mood.name} animation="fade-up" delay={i * 120}>
            <Link
              href={`/explore?mood=${mood.name.toLowerCase()}`}
              className="group relative flex flex-col items-center justify-end overflow-hidden rounded-2xl transition-all duration-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40"
              style={{ aspectRatio: "3/4" }}
            >
              {/* Background image */}
              <div
                className="absolute inset-0 scale-105 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${mood.bgImage}')` }}
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 transition-opacity duration-500 group-hover:from-black/70 group-hover:via-black/30" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-3 px-4 pb-8">
                <div style={{ color: mood.color }} className="mb-1 transition-transform duration-500 group-hover:scale-110">
                  {mood.icon}
                </div>
                <span className="font-[family-name:var(--font-heading)] text-xl font-normal tracking-wide text-white">
                  {mood.name}
                </span>
                <span className="text-sm font-light text-white/60 transition-colors duration-500 group-hover:text-white/80">
                  {mood.phrase}
                </span>
              </div>

              {/* Colored bottom glow */}
              <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: mood.color, boxShadow: `0 0 20px ${mood.color}` }}
              />
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
