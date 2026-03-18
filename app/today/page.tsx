import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlashlightCursor from "@/components/FlashlightCursor";
import ScrollReveal from "@/components/ScrollReveal";
import MandalaSvg from "@/components/MandalaSvg";
import { coloringPages, getTodaysPick, moodMeta, styleMeta } from "@/data/coloringPages";

function WaveformBar() {
  const bars = 60;
  return (
    <div className="flex h-12 items-end gap-[2.5px]">
      {Array.from({ length: bars }).map((_, i) => {
        const center = bars / 2;
        const dist = Math.abs(i - center) / center;
        const height = Math.max(0.15, (1 - dist * dist) * (0.5 + Math.sin(i * 0.8) * 0.3));
        return (
          <div
            key={i}
            className="w-[2.5px] rounded-full bg-accent-amber/40"
            style={{
              height: `${height * 100}%`,
              animationName: "wave-bar",
              animationDuration: `${1.5 + Math.random() * 1.5}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDelay: `${i * 0.05}s`,
            }}
          />
        );
      })}
    </div>
  );
}

function BreathingGuide() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="h-px w-12 bg-accent-amber/20" />
      <p className="max-w-sm text-center font-[family-name:var(--font-guidance)] text-base font-light italic leading-relaxed text-text-secondary">
        Before you begin, take three slow breaths.
        <br />
        Feel the pen in your hand. Let everything else wait.
      </p>
      <div className="h-px w-12 bg-accent-amber/20" />
    </div>
  );
}

export default function TodayPage() {
  const page = getTodaysPick();
  const mood = moodMeta[page.mood];

  return (
    <>
      <FlashlightCursor />
      <Navbar />
      <main className="relative min-h-screen overflow-hidden">
        {/* Full-screen ambient background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url('${page.bgImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-bg-deep/60" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-6 pt-36 pb-24">
          {/* Date label */}
          <ScrollReveal animation="fade-in">
            <p className="mb-3 text-xs font-light tracking-[0.3em] text-accent-amber/50 uppercase">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </ScrollReveal>

          <ScrollReveal animation="blur-in" delay={100}>
            <p className="mb-4 text-xs font-light tracking-[0.3em] text-accent-amber/60 uppercase">
              Today&apos;s Coloring
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <h1 className="mb-6 text-center font-[family-name:var(--font-heading)] text-4xl font-normal text-text-primary md:text-5xl lg:text-6xl">
              {page.title}
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-in" delay={300}>
            <p className="mb-16 max-w-lg text-center text-base font-light leading-relaxed text-text-secondary md:mb-20">
              {page.description}
            </p>
          </ScrollReveal>

          {/* Mandala preview with glow */}
          <ScrollReveal animation="scale-up" delay={400}>
            <div className="relative mb-16 md:mb-20">
              <div
                className="absolute inset-0 scale-150 opacity-50 blur-3xl"
                style={{
                  background: `radial-gradient(circle, ${mood.color}40 0%, transparent 60%)`,
                }}
              />
              <MandalaSvg className="relative h-72 w-72 drop-shadow-[0_0_60px_rgba(237,232,226,0.08)] md:h-[22rem] md:w-[22rem]" />
            </div>
          </ScrollReveal>

          {/* Mood + style + difficulty */}
          <ScrollReveal animation="fade-up" delay={500}>
            <div className="mb-10 flex items-center gap-4">
              <span
                className="rounded-full border px-5 py-2 text-sm font-light tracking-wide"
                style={{ borderColor: `${mood.color}66`, color: mood.color }}
              >
                {mood.label}
              </span>
              <span className="text-sm font-light text-text-muted">
                {styleMeta[page.style].label}
              </span>
              <div className="flex gap-2">
                {[1, 2, 3].map((d) => (
                  <span
                    key={d}
                    className="h-1.5 w-5 rounded-full"
                    style={{
                      backgroundColor:
                        d <= page.difficulty
                          ? "rgba(201,168,124,0.5)"
                          : "rgba(201,168,124,0.2)",
                    }}
                  />
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Breathing guide */}
          <ScrollReveal animation="blur-in" delay={600}>
            <div className="mb-14">
              <BreathingGuide />
            </div>
          </ScrollReveal>

          {/* Waveform + audio */}
          <ScrollReveal animation="fade-in" delay={700}>
            <div className="mb-14 flex flex-col items-center">
              <WaveformBar />
              <p className="mt-4 text-center text-sm font-light text-text-secondary">
                {page.audioTitle} &middot; {page.audioDuration}
              </p>
            </div>
          </ScrollReveal>

          {/* Action buttons */}
          <ScrollReveal animation="fade-up" delay={800}>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
              {/* Primary CTA — detail/paint page */}
              <Link
                href={`/coloring/${page.slug}`}
                className="group inline-flex items-center gap-3 rounded-full bg-white/90 px-7 py-3.5 text-bg-deep shadow-lg shadow-black/15 transition-all duration-500 hover:bg-white hover:shadow-xl hover:shadow-black/25"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bg-deep text-white transition-transform duration-500 group-hover:scale-110">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
                <span className="text-sm font-medium tracking-wide">Begin your ritual</span>
              </Link>

              {/* Secondary — explore more */}
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-full border border-text-muted/30 px-6 py-3.5 text-sm font-light tracking-wide text-text-secondary transition-all duration-500 hover:border-text-secondary/50 hover:text-text-primary"
              >
                Explore all pages
              </Link>
            </div>
          </ScrollReveal>

          {/* Subtle separator before "More like this" */}
          <div className="mt-28 mb-16 h-px w-16 bg-accent-amber/20" />

          {/* More suggestions - tomorrow and day after */}
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="mb-8 text-center text-xs font-light tracking-[0.2em] text-text-muted uppercase">
              Coming up
            </p>
          </ScrollReveal>
          <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
            {[1, 2].map((offset) => {
              const dayOfYear = Math.floor(
                (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
              );
              const upcoming = coloringPages[(dayOfYear + offset) % coloringPages.length];
              if (!upcoming) return null;
              const upcomingMood = moodMeta[upcoming.mood];
              return (
                <ScrollReveal key={offset} animation="fade-up" delay={offset * 100}>
                  <div className="flex items-center gap-4 rounded-xl bg-bg-elevated/50 p-4 transition-colors duration-500 hover:bg-bg-elevated">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                      <MandalaSvg className="h-10 w-10 opacity-50" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-[family-name:var(--font-heading)] text-sm text-text-primary">
                        {upcoming.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-light"
                          style={{ color: upcomingMood.color }}
                        >
                          {upcomingMood.label}
                        </span>
                        <span className="text-xs text-text-muted">
                          {offset === 1 ? "Tomorrow" : "In 2 days"}
                        </span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
