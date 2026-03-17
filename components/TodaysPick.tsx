import Link from "next/link";
import MandalaSvg from "./MandalaSvg";
import ScrollReveal from "./ScrollReveal";

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

export default function TodaysPick() {
  return (
    <section className="relative flex flex-col items-center px-6 py-28 md:py-40">
      {/* Background scene */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1920&q=60&auto=format')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-bg-deep/75" />

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
          <h2 className="mb-16 text-center font-[family-name:var(--font-heading)] text-3xl font-normal text-text-primary md:mb-20 md:text-4xl">
            Lotus Meditation
          </h2>
        </ScrollReveal>

        {/* Mandala preview with glow */}
        <ScrollReveal animation="scale-up" delay={200}>
          <div className="relative mb-16 md:mb-20">
            <div
              className="absolute inset-0 scale-150 opacity-50 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(201,168,124,0.25) 0%, transparent 60%)",
              }}
            />
            <MandalaSvg className="relative h-72 w-72 drop-shadow-[0_0_60px_rgba(237,232,226,0.08)] md:h-[22rem] md:w-[22rem]" />
          </div>
        </ScrollReveal>

        {/* Mood tag + difficulty */}
        <ScrollReveal animation="fade-up" delay={300}>
          <div className="mb-10 flex items-center gap-4">
            <span className="rounded-full border border-mood-calm/40 px-5 py-2 text-sm font-light tracking-wide text-mood-calm">
              Calm
            </span>
            <div className="flex gap-2">
              <span className="h-1.5 w-5 rounded-full bg-accent-amber/50" />
              <span className="h-1.5 w-5 rounded-full bg-accent-amber/50" />
              <span className="h-1.5 w-5 rounded-full bg-accent-amber/20" />
            </div>
          </div>
        </ScrollReveal>

        {/* Waveform */}
        <ScrollReveal animation="fade-in" delay={400}>
          <div className="mb-14">
            <WaveformBar />
            <p className="mt-4 text-center text-sm font-light text-text-secondary">
              Gentle Rain &amp; Piano &middot; 22 min
            </p>
          </div>
        </ScrollReveal>

        {/* CTA Button */}
        <ScrollReveal animation="fade-up" delay={500}>
          <Link
            href="/today"
            className="group inline-flex items-center gap-3 rounded-full bg-white/90 px-7 py-3.5 text-bg-deep shadow-lg shadow-black/15 transition-all duration-500 hover:bg-white hover:shadow-xl hover:shadow-black/25"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bg-deep text-white transition-transform duration-500 group-hover:scale-110">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </span>
            <span className="text-sm font-medium tracking-wide">Begin your ritual</span>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
