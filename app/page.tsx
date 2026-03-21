import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MoodSelection from "@/components/MoodSelection";
import TodaysPick from "@/components/TodaysPick";
import Footer from "@/components/Footer";
import FlashlightCursor from "@/components/FlashlightCursor";

export const metadata: Metadata = {
  title: "ColorBreath — Breathe. Color. Be. | Free Mindful Coloring Pages",
  description:
    "A mindful coloring space for adults. Free printable coloring pages with ambient soundscapes — designed for stress relief, better sleep, and self-care. No ads, no rush.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ColorBreath",
    url: "https://colorbreath.com",
    description:
      "Free printable adult coloring pages paired with ambient soundscapes for mindfulness, stress relief, and better sleep.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FlashlightCursor />
      <Navbar />
      <main>
        <Hero />
        <MoodSelection />
        <TodaysPick />

        {/* SEO content section */}
        <section className="relative flex flex-col items-center px-6 py-24 md:py-32">
          <div className="max-w-2xl text-center">
            <h2 className="mb-8 font-[family-name:var(--font-heading)] text-2xl font-normal text-text-primary md:text-3xl">
              Free adult coloring pages for mindfulness
            </h2>
            <div className="flex flex-col gap-5 text-sm font-light leading-relaxed text-text-secondary">
              <p>
                ColorBreath offers free printable coloring pages designed for
                adults who want more than a children&apos;s activity. Each page
                is a hand-curated scene — from cozy reading nooks to sunlit
                studios — drawn in clean line art with large areas to fill,
                perfect for colored pencils or markers.
              </p>
              <p>
                Unlike traditional coloring page websites, we organize by mood
                rather than category. Looking for stress relief? Try our Calm
                collection. Need help winding down before bed? Our Sleep pages
                pair with ambient soundscapes like rain and soft piano. Every
                coloring page is free to print or color online — no account
                required, no ads, ever.
              </p>
              <p>
                Whether you call it meditation coloring, art therapy, or simply
                a quiet moment with a pen — this is your space. Mandala
                patterns, floral designs, geometric scenes, and nature-inspired
                illustrations, all crafted for the adult colorist who values
                calm over clutter.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
