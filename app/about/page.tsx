import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlashlightCursor from "@/components/FlashlightCursor";
import ScrollReveal from "@/components/ScrollReveal";
import BreathingCircle from "@/components/BreathingCircle";

export const metadata: Metadata = {
  title: "About ColorBreath — A Mindful Coloring Space",
  description:
    "ColorBreath is a mindful coloring space for adults. No ads, no time pressure — just beautiful coloring pages and ambient sounds for your quiet moments.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <FlashlightCursor />
      <Navbar />
      <main className="min-h-screen">
        {/* Hero section */}
        <section className="relative flex flex-col items-center px-6 pt-36 pb-24">
          {/* Ambient background */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=60&auto=format')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-bg-deep/65" />

          <div className="relative z-10 flex flex-col items-center">
            <ScrollReveal animation="scale-up">
              <div className="mb-12">
                <BreathingCircle />
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <h1 className="mb-6 text-center font-[family-name:var(--font-heading)] text-4xl font-normal text-text-primary md:text-5xl lg:text-6xl">
                Breathe. Color. Be.
              </h1>
            </ScrollReveal>

            <ScrollReveal animation="fade-in" delay={400}>
              <p className="max-w-xl text-center font-[family-name:var(--font-guidance)] text-xl font-light italic leading-relaxed text-text-secondary">
                ColorBreath is a quiet corner of the internet where coloring becomes meditation.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Story section */}
        <section className="flex flex-col items-center px-6 py-24 md:py-32">
          <div className="max-w-2xl">
            <ScrollReveal animation="fade-up">
              <h2 className="mb-10 font-[family-name:var(--font-heading)] text-2xl font-normal text-text-primary md:text-3xl">
                Why we made this
              </h2>
            </ScrollReveal>

            <div className="flex flex-col gap-6 text-base font-light leading-relaxed text-text-secondary">
              <ScrollReveal animation="fade-up" delay={100}>
                <p>
                  We noticed something strange about coloring page websites. They&apos;re loud.
                  Banner ads flash at you. Pop-ups demand your email. The pages themselves are
                  buried under walls of SEO text. The experience feels like the opposite of
                  what coloring is supposed to be.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={200}>
                <p>
                  Coloring, at its best, is a form of meditation. It&apos;s the feeling of a
                  pen meeting paper, the quiet satisfaction of choosing the right shade of blue,
                  the way twenty minutes can pass like two. It deserves a space that honors that.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={300}>
                <p>
                  ColorBreath is that space. No ads, no clutter, no rush. Just beautifully
                  designed coloring pages, gentle ambient music, and a slow, intentional
                  experience that respects your time and attention.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={400}>
                <p>
                  We pair each page with ambient soundscapes — rain on a window, a crackling
                  fireplace, soft piano — because sound shapes how we feel. We organize by
                  mood, not category, because you don&apos;t search for &ldquo;mandala&rdquo;
                  when you can&apos;t sleep. You search for peace.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Values section */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <ScrollReveal animation="blur-in">
              <div className="mb-16 flex items-center gap-4">
                <div className="h-px flex-1 bg-bg-surface" />
                <h2 className="text-sm font-light tracking-[0.2em] text-accent-amber/70 uppercase">
                  What we believe
                </h2>
                <div className="h-px flex-1 bg-bg-surface" />
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  title: "No ads. Ever.",
                  text: "Advertising is the enemy of calm. We sustain ColorBreath through optional premium features and affiliate recommendations — never by selling your attention.",
                },
                {
                  title: "You set the pace",
                  text: "No countdowns, no streaks, no gamification. You color for five minutes or five hours. The only timer that matters is the one your body already has.",
                },
                {
                  title: "Real ink on real paper",
                  text: "We love our online coloring tool, but we believe the deepest calm comes from pen touching paper. Every page is designed to be printed and savored.",
                },
              ].map((value, i) => (
                <ScrollReveal key={value.title} animation="fade-up" delay={i * 120}>
                  <div className="flex flex-col gap-4 rounded-2xl bg-bg-elevated/30 p-6">
                    <h3 className="font-[family-name:var(--font-heading)] text-lg text-text-primary">
                      {value.title}
                    </h3>
                    <p className="text-sm font-light leading-relaxed text-text-secondary">
                      {value.text}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="flex flex-col items-center gap-8 px-6 py-24">
          <ScrollReveal animation="fade-in">
            <div className="h-px w-16 bg-accent-amber/20" />
          </ScrollReveal>
          <ScrollReveal animation="blur-in" delay={100}>
            <p className="max-w-md text-center font-[family-name:var(--font-guidance)] text-xl font-light italic text-text-secondary">
              Your quiet moment is waiting.
            </p>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
              <Link
                href="/today"
                className="group inline-flex items-center gap-3 rounded-full bg-white/90 px-7 py-3.5 text-bg-deep shadow-lg shadow-black/15 transition-all duration-500 hover:bg-white hover:shadow-xl hover:shadow-black/25"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bg-deep text-white transition-transform duration-500 group-hover:scale-110">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
                <span className="text-sm font-medium tracking-wide">Start coloring</span>
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-full border border-text-muted/30 px-6 py-3.5 text-sm font-light tracking-wide text-text-secondary transition-all duration-500 hover:border-text-secondary/50 hover:text-text-primary"
              >
                Browse all pages
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
