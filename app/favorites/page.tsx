import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlashlightCursor from "@/components/FlashlightCursor";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Our Favorites — Best Coloring Supplies for Adults",
  description:
    "Hand-picked colored pencils, markers, paper, and ambiance items for adult coloring. Curated by the ColorBreath team for the best mindful coloring experience.",
  alternates: { canonical: "/favorites" },
};

export default function FavoritesPage() {
  return (
    <>
      <FlashlightCursor />
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center px-6 pt-32 pb-20">
        {/* Header */}
        <ScrollReveal animation="blur-in">
          <p className="mb-4 text-center text-xs font-light tracking-[0.3em] text-accent-amber/60 uppercase">
            Our Favorites
          </p>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" delay={100}>
          <h1 className="mb-6 text-center font-[family-name:var(--font-heading)] text-4xl font-normal text-text-primary md:text-5xl">
            Tools we love
          </h1>
        </ScrollReveal>
        <ScrollReveal animation="fade-in" delay={200}>
          <p className="mb-16 max-w-md text-center font-[family-name:var(--font-guidance)] text-lg font-light italic leading-relaxed text-text-secondary">
            We&apos;re curating a collection of supplies that make the coloring ritual more beautiful — colored pencils, markers, paper, and ambiance essentials.
          </p>
        </ScrollReveal>

        {/* Coming Soon card */}
        <ScrollReveal animation="scale-up" delay={300}>
          <div className="flex flex-col items-center gap-8 rounded-3xl border border-bg-surface/50 bg-bg-elevated/30 px-12 py-14 backdrop-blur-sm">
            {/* Icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-amber/10">
              <svg className="h-7 w-7 text-accent-amber/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>

            <div className="flex flex-col items-center gap-3">
              <p className="text-lg font-light tracking-wide text-text-primary">
                Coming soon
              </p>
              <p className="max-w-xs text-center text-sm font-light leading-relaxed text-text-secondary">
                We&apos;re testing and selecting the best tools for your coloring practice. Every recommendation will be something we genuinely use and love.
              </p>
            </div>

            <div className="h-px w-12 bg-accent-amber/20" />

            <p className="max-w-xs text-center text-xs font-light leading-relaxed text-text-muted">
              In the meantime, any colored pencils and decent paper will work beautifully with our coloring pages.
            </p>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal animation="fade-up" delay={500}>
          <div className="mt-16 flex flex-col items-center gap-6">
            <p className="max-w-sm text-center font-[family-name:var(--font-guidance)] text-base font-light italic text-text-secondary">
              The best tools are the ones already in your hand.
            </p>
            <Link
              href="/today"
              className="inline-flex items-center gap-2 rounded-full border border-text-muted/30 px-6 py-3 text-sm font-light tracking-wide text-text-secondary transition-all duration-500 hover:border-text-secondary/50 hover:text-text-primary"
            >
              Start coloring today
            </Link>
          </div>
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
