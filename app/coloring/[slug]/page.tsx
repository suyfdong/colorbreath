import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlashlightCursor from "@/components/FlashlightCursor";
import ScrollReveal from "@/components/ScrollReveal";
import ColoringPreview from "@/components/ColoringPreview";
import { coloringPages, moodMeta, styleMeta } from "@/data/coloringPages";

export function generateStaticParams() {
  return coloringPages.map((p) => ({ slug: p.slug }));
}

function WaveformBar() {
  const bars = 50;
  return (
    <div className="flex h-10 items-end gap-[2px]">
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

export default async function ColoringDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = coloringPages.find((p) => p.slug === slug);
  if (!page) notFound();

  const mood = moodMeta[page.mood];
  const related = coloringPages
    .filter((p) => p.mood === page.mood && p.slug !== page.slug)
    .slice(0, 3);

  return (
    <>
      <FlashlightCursor />
      <Navbar />
      <main className="relative min-h-screen overflow-hidden">
        {/* Ambient background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url('${page.bgImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-bg-deep/65" />

        <div className="relative z-10 flex flex-col items-center px-6 pt-36 pb-24">
          {/* Breadcrumb */}
          <ScrollReveal animation="fade-in">
            <div className="mb-12 flex items-center gap-2 text-xs font-light text-text-muted">
              <Link href="/explore" className="transition-colors hover:text-text-secondary">
                Explore
              </Link>
              <span>/</span>
              <span className="text-text-secondary">{page.title}</span>
            </div>
          </ScrollReveal>

          {/* Title */}
          <ScrollReveal animation="fade-up" delay={100}>
            <h1 className="mb-4 text-center font-[family-name:var(--font-heading)] text-4xl font-normal text-text-primary md:text-5xl lg:text-6xl">
              {page.title}
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-in" delay={200}>
            <p className="mb-16 max-w-lg text-center text-base font-light leading-relaxed text-text-secondary md:mb-20">
              {page.description}
            </p>
          </ScrollReveal>

          {/* Large preview */}
          <ScrollReveal animation="scale-up" delay={300}>
            <div className="relative mb-16 md:mb-20">
              <div
                className="pointer-events-none absolute inset-0 scale-[1.4] opacity-30 blur-3xl"
                style={{
                  background: `radial-gradient(circle, ${mood.color}50 0%, transparent 60%)`,
                }}
              />
              <ColoringPreview slug={page.slug} className="relative h-80 w-80 md:h-[26rem] md:w-[26rem]" />
            </div>
          </ScrollReveal>

          {/* Meta badges */}
          <ScrollReveal animation="fade-up" delay={400}>
            <div className="mb-12 flex flex-wrap items-center justify-center gap-4">
              <span
                className="rounded-full border px-5 py-2 text-sm font-light tracking-wide"
                style={{ borderColor: `${mood.color}66`, color: mood.color }}
              >
                {mood.label}
              </span>
              <span className="rounded-full border border-bg-surface px-4 py-2 text-sm font-light text-text-secondary">
                {styleMeta[page.style].label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-light text-text-muted">Difficulty</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-5 rounded-full"
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
            </div>
          </ScrollReveal>

          {/* Breathing guide */}
          <ScrollReveal animation="blur-in" delay={500}>
            <div className="mb-14 flex flex-col items-center gap-5">
              <div className="h-px w-12 bg-accent-amber/20" />
              <p className="max-w-sm text-center font-[family-name:var(--font-guidance)] text-base font-light italic leading-relaxed text-text-secondary">
                Take a moment. Settle in.
                <br />
                This is your time — there is no rush.
              </p>
              <div className="h-px w-12 bg-accent-amber/20" />
            </div>
          </ScrollReveal>

          {/* Audio section */}
          <ScrollReveal animation="fade-in" delay={600}>
            <div className="mb-16 flex flex-col items-center">
              <WaveformBar />
              <p className="mt-4 text-center text-sm font-light text-text-secondary">
                {page.audioTitle} &middot; {page.audioDuration}
              </p>
            </div>
          </ScrollReveal>

          {/* Action buttons */}
          <ScrollReveal animation="fade-up" delay={700}>
            <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
              {/* Paint online */}
              <Link
                href={`/coloring/${page.slug}/paint`}
                className="group inline-flex items-center gap-3 rounded-full bg-white/90 px-7 py-3.5 text-bg-deep shadow-lg shadow-black/15 transition-all duration-500 hover:bg-white hover:shadow-xl hover:shadow-black/25"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bg-deep text-white transition-transform duration-500 group-hover:scale-110">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                  </svg>
                </span>
                <span className="text-sm font-medium tracking-wide">Color online</span>
              </Link>

              {/* Download PDF */}
              <button
                className="group inline-flex items-center gap-3 rounded-full border border-text-muted/30 px-7 py-3.5 text-sm font-light tracking-wide text-text-secondary transition-all duration-500 hover:border-text-secondary/50 hover:text-text-primary"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download PDF
              </button>
            </div>
          </ScrollReveal>

          {/* Related pages */}
          {related.length > 0 && (
            <>
              <div className="mt-24 mb-12 h-px w-16 bg-accent-amber/20" />
              <ScrollReveal animation="fade-up">
                <p className="mb-8 text-center text-xs font-light tracking-[0.2em] text-text-muted uppercase">
                  More {mood.label} pages
                </p>
              </ScrollReveal>

              <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
                {related.map((r, i) => {
                  const rMood = moodMeta[r.mood];
                  return (
                    <ScrollReveal key={r.slug} animation="fade-up" delay={i * 100}>
                      <Link
                        href={`/coloring/${r.slug}`}
                        className="group flex flex-col items-center gap-4 rounded-xl bg-bg-elevated/50 p-6 transition-all duration-500 hover:-translate-y-1 hover:bg-bg-elevated hover:shadow-xl hover:shadow-black/30"
                      >
                        <ColoringPreview slug={r.slug} className="h-24 w-24 transition-transform duration-500 group-hover:-translate-y-1" />
                        <span className="font-[family-name:var(--font-heading)] text-sm text-text-primary">
                          {r.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-light" style={{ color: rMood.color }}>
                            {rMood.label}
                          </span>
                          <span className="text-xs text-text-muted">
                            {styleMeta[r.style].label}
                          </span>
                        </div>
                      </Link>
                    </ScrollReveal>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
