import Link from "next/link";
import ColoringPreview from "./ColoringPreview";
import ScrollReveal from "./ScrollReveal";
import { getTodaysPick, moodMeta } from "@/data/coloringPages";

function WaveformBar() {
  const bars = 40;
  return (
    <div className="flex h-8 items-end gap-[2px]">
      {Array.from({ length: bars }).map((_, i) => {
        const center = bars / 2;
        const dist = Math.abs(i - center) / center;
        const height = Math.max(0.15, (1 - dist * dist) * (0.5 + Math.sin(i * 0.8) * 0.3));
        return (
          <div
            key={i}
            className="w-[2px] rounded-full bg-accent-amber/40"
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

export default function TodaysPick() {
  const todayPage = getTodaysPick();
  const mood = moodMeta[todayPage.mood];

  return (
    <section className="relative flex flex-col items-center px-6 py-28 md:py-40">
      {/* Background scene */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url('/bg/lotus-meditation.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-bg-deep/50" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Separator line */}
        <ScrollReveal animation="fade-in">
          <div className="mb-24 h-px w-16 bg-accent-amber/30" />
        </ScrollReveal>

        {/* Section heading */}
        <ScrollReveal animation="blur-in">
          <p className="mb-4 text-center text-xs font-light tracking-[0.3em] text-accent-amber/60 uppercase">
            Today&apos;s Coloring
          </p>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={100}>
          <h2 className="mb-6 text-center font-[family-name:var(--font-heading)] text-3xl font-normal text-text-primary md:text-4xl">
            {todayPage.title}
          </h2>
        </ScrollReveal>

        {/* Description */}
        <ScrollReveal animation="fade-in" delay={150}>
          <p className="mb-12 max-w-md text-center text-sm font-light leading-relaxed text-text-secondary md:mb-14">
            {todayPage.description}
          </p>
        </ScrollReveal>

        {/* Card: preview + meta side by side on desktop, stacked on mobile */}
        <ScrollReveal animation="scale-up" delay={200}>
          <Link
            href="/today"
            className="group flex flex-col items-center gap-8 rounded-2xl bg-bg-elevated/60 p-6 backdrop-blur-sm transition-all duration-700 hover:-translate-y-1 hover:bg-bg-elevated/80 hover:shadow-2xl hover:shadow-black/40 sm:flex-row sm:gap-10 sm:p-8"
          >
            {/* Small preview */}
            <div className="relative flex-shrink-0">
              <div
                className="pointer-events-none absolute inset-0 scale-[1.6] opacity-20 blur-2xl"
                style={{
                  background: `radial-gradient(circle, ${mood.color}60 0%, transparent 60%)`,
                }}
              />
              <ColoringPreview slug={todayPage.slug} className="relative h-44 w-44 md:h-52 md:w-52" />
            </div>

            {/* Meta info */}
            <div className="flex flex-col items-center gap-4 sm:items-start">
              {/* Mood + difficulty */}
              <div className="flex items-center gap-3">
                <span
                  className="rounded-full border px-4 py-1.5 text-xs font-light tracking-wide"
                  style={{ borderColor: `${mood.color}66`, color: mood.color }}
                >
                  {mood.label}
                </span>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-4 rounded-full"
                      style={{
                        backgroundColor:
                          d <= todayPage.difficulty
                            ? "rgba(201,168,124,0.5)"
                            : "rgba(201,168,124,0.2)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Waveform + audio */}
              <div>
                <WaveformBar />
                <p className="mt-2 text-xs font-light text-text-muted">
                  {todayPage.audioTitle} &middot; {todayPage.audioDuration}
                </p>
              </div>

              {/* Inline CTA */}
              <div className="flex items-center gap-2 text-sm font-light tracking-wide text-text-secondary transition-colors duration-500 group-hover:text-accent-amber">
                <span>Begin your ritual</span>
                <svg className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
