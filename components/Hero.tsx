import BreathingCircle from "./BreathingCircle";

const words = ["Breathe.", "Color.", "Be."];

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      {/* Background image — dark moody nature scene */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1920&q=80&auto=format')",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      />
      {/* Dark overlay — lighter to show more image */}
      <div className="pointer-events-none absolute inset-0 bg-bg-deep/50" />
      {/* Vignette — edges dark, center more open */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, rgba(13,11,9,0.4) 55%, rgba(13,11,9,0.9) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10">
        <BreathingCircle />

        {/* Title — staggered word reveal */}
        <h1 className="flex flex-wrap justify-center gap-x-5 gap-y-1 font-[family-name:var(--font-heading)] text-5xl font-normal tracking-tight text-white md:text-7xl lg:text-8xl">
          {words.map((word, i) => (
            <span
              key={word}
              className="animate-fade-up inline-block drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]"
              style={{ animationDelay: `${0.6 + i * 0.7}s` }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-up max-w-md text-center font-[family-name:var(--font-guidance)] text-xl font-light italic leading-relaxed text-text-primary/80 md:text-2xl"
          style={{ animationDelay: "2.8s" }}
        >
          A mindful coloring space for your quiet moments
        </p>
        <p
          className="animate-fade-up mt-3 max-w-sm text-center text-sm font-light text-text-muted/70"
          style={{ animationDelay: "3.0s" }}
        >
          Free printable adult coloring pages &middot; Ambient soundscapes &middot; No ads
        </p>

        {/* CTA Button — micro1 style white pill */}
        <div
          className="animate-fade-up mt-4"
          style={{ animationDelay: "3.4s" }}
        >
          <a
            href="#moods"
            className="group inline-flex items-center gap-3 rounded-full bg-white/95 px-8 py-4 text-bg-deep shadow-lg shadow-black/20 transition-all duration-500 hover:bg-white hover:shadow-xl hover:shadow-black/30"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-deep text-white transition-transform duration-500 group-hover:scale-110">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
              </svg>
            </span>
            <span className="text-sm font-medium tracking-wide">Begin your ritual</span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="animate-fade-in absolute bottom-10 flex flex-col items-center gap-2"
        style={{ animationDelay: "4.2s" }}
      >
        <svg
          className="animate-gentle-bounce h-5 w-5 text-white/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </section>
  );
}
