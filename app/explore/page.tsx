"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlashlightCursor from "@/components/FlashlightCursor";
import ScrollReveal from "@/components/ScrollReveal";
import ColoringPreview from "@/components/ColoringPreview";
import { coloringPages, moodMeta, styleMeta, type Mood, type Style } from "@/data/coloringPages";

const allMoods = Object.keys(moodMeta) as Mood[];
const allStyles = Object.keys(styleMeta) as Style[];

function ExploreContent() {
  const searchParams = useSearchParams();
  const moodParam = searchParams.get("mood") as Mood | null;

  const initialMood = moodParam && allMoods.includes(moodParam) ? moodParam : null;
  const [activeMood, setActiveMood] = useState<Mood | null>(initialMood);
  const [activeStyle, setActiveStyle] = useState<Style | null>(null);

  useEffect(() => {
    if (moodParam && allMoods.includes(moodParam)) {
      setActiveMood(moodParam);
    }
  }, [moodParam]);

  const filtered = coloringPages.filter((p) => {
    if (activeMood && p.mood !== activeMood) return false;
    if (activeStyle && p.style !== activeStyle) return false;
    return true;
  });

  return (
    <main className="min-h-screen pt-32 pb-20">
      {/* Header */}
      <section className="flex flex-col items-center px-6 pb-16">
        <ScrollReveal animation="blur-in">
          <p className="mb-4 text-xs font-light tracking-[0.3em] text-accent-amber/60 uppercase">
            Explore
          </p>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={100}>
          <h1 className="mb-6 text-center font-[family-name:var(--font-heading)] text-4xl font-normal text-text-primary md:text-5xl">
            Find your moment
          </h1>
        </ScrollReveal>
        <ScrollReveal animation="fade-in" delay={200}>
          <p className="max-w-md text-center font-[family-name:var(--font-guidance)] text-lg font-light italic text-text-secondary">
            Choose a mood that speaks to you, then let the colors guide the rest.
          </p>
        </ScrollReveal>
      </section>

      {/* Filters */}
      <section className="flex flex-col items-center gap-5 px-6 pb-16">
        {/* Mood filters */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setActiveMood(null)}
            className={`rounded-full border px-5 py-2 text-sm font-light tracking-wide transition-all duration-500 ${
              activeMood === null
                ? "border-accent-amber/60 bg-accent-amber/10 text-accent-amber"
                : "border-bg-surface text-text-muted hover:border-text-muted hover:text-text-secondary"
            }`}
          >
            All moods
          </button>
          {allMoods.map((mood) => {
            const meta = moodMeta[mood];
            const isActive = activeMood === mood;
            return (
              <button
                key={mood}
                onClick={() => setActiveMood(isActive ? null : mood)}
                className={`rounded-full border px-5 py-2 text-sm font-light tracking-wide transition-all duration-500 ${
                  !isActive
                    ? "border-bg-surface text-text-muted hover:border-text-muted hover:text-text-secondary"
                    : ""
                }`}
                style={
                  isActive
                    ? {
                        borderColor: `${meta.color}99`,
                        backgroundColor: `${meta.color}18`,
                        color: meta.color,
                      }
                    : undefined
                }
              >
                {meta.label}
              </button>
            );
          })}
        </div>

        {/* Style filters */}
        <div className="flex flex-wrap justify-center gap-3">
          {allStyles.map((style) => {
            const isActive = activeStyle === style;
            return (
              <button
                key={style}
                onClick={() => setActiveStyle(isActive ? null : style)}
                className={`rounded-full border px-4 py-1.5 text-xs font-light tracking-wide transition-all duration-500 ${
                  isActive
                    ? "border-text-secondary/40 bg-bg-surface text-text-primary"
                    : "border-bg-surface text-text-muted hover:border-text-muted hover:text-text-secondary"
                }`}
              >
                {styleMeta[style].label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-6">
        {filtered.length === 0 ? (
          <p className="py-20 text-center font-[family-name:var(--font-guidance)] text-lg italic text-text-muted">
            No pages match this combination. Try a different filter.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((page, i) => {
              const mood = moodMeta[page.mood];
              return (
                <ScrollReveal key={page.slug} animation="fade-up" delay={i * 80}>
                  <Link
                    href={`/coloring/${page.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-2xl bg-bg-elevated transition-all duration-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40"
                  >
                    {/* Preview area */}
                    <div className="relative flex items-center justify-center bg-white/[0.03] p-8">
                      <ColoringPreview slug={page.slug} className="relative h-44 w-44 transition-all duration-700 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-black/40" />
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <h3 className="font-[family-name:var(--font-heading)] text-xl font-normal text-text-primary">
                        {page.title}
                      </h3>
                      <p className="text-sm font-light leading-relaxed text-text-secondary line-clamp-2">
                        {page.description}
                      </p>

                      {/* Meta row */}
                      <div className="mt-auto flex items-center gap-3 pt-3">
                        <span
                          className="rounded-full border px-3 py-1 text-xs font-light"
                          style={{ borderColor: `${mood.color}50`, color: mood.color }}
                        >
                          {mood.label}
                        </span>
                        <span className="text-xs font-light text-text-muted">
                          {styleMeta[page.style].label}
                        </span>
                        <div className="ml-auto flex gap-1.5">
                          {[1, 2, 3].map((d) => (
                            <span
                              key={d}
                              className="h-1.5 w-4 rounded-full"
                              style={{
                                backgroundColor:
                                  d <= page.difficulty
                                    ? "rgba(201,168,124,0.5)"
                                    : "rgba(201,168,124,0.15)",
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Audio hint */}
                      <div className="flex items-center gap-2 pt-1">
                        <svg
                          className="h-3.5 w-3.5 text-text-muted"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 19V6l12-3v13M9 19c0 1.1-1.3 2-3 2s-3-.9-3-2 1.3-2 3-2 3 .9 3 2zm12-3c0 1.1-1.3 2-3 2s-3-.9-3-2 1.3-2 3-2 3 .9 3 2z"
                          />
                        </svg>
                        <span className="text-xs font-light text-text-muted">
                          {page.audioTitle} &middot; {page.audioDuration}
                        </span>
                      </div>
                    </div>

                    {/* Bottom glow on hover */}
                    <div
                      className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: mood.color, boxShadow: `0 0 20px ${mood.color}` }}
                    />
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default function ExplorePage() {
  return (
    <>
      <FlashlightCursor />
      <Navbar />
      <Suspense>
        <ExploreContent />
      </Suspense>
      <Footer />
    </>
  );
}
