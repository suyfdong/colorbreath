import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlashlightCursor from "@/components/FlashlightCursor";
import ScrollReveal from "@/components/ScrollReveal";

interface Product {
  name: string;
  brand: string;
  description: string;
  price: string;
  category: string;
  icon: string;
  link: string;
}

const products: Product[] = [
  // Colored Pencils
  {
    name: "Prismacolor Premier Soft Core",
    brand: "Prismacolor",
    description:
      "Rich, velvety color that blends beautifully. Our go-to for detailed mandala work — the soft core glides effortlessly and layers without wax buildup.",
    price: "$28",
    category: "Colored Pencils",
    icon: "✎",
    link: "#",
  },
  {
    name: "Faber-Castell Polychromos",
    brand: "Faber-Castell",
    description:
      "Oil-based for a smooth, break-resistant experience. Exceptional lightfastness means your finished pieces stay vibrant on the shelf for years.",
    price: "$45",
    category: "Colored Pencils",
    icon: "✎",
    link: "#",
  },
  {
    name: "Staedtler Ergosoft Colored Pencils",
    brand: "Staedtler",
    description:
      "Ergonomic triangular shape that reduces hand fatigue during long coloring sessions. Perfect for beginners and anyone who colors for relaxation.",
    price: "$18",
    category: "Colored Pencils",
    icon: "✎",
    link: "#",
  },
  // Markers
  {
    name: "Tombow Dual Brush Pens",
    brand: "Tombow",
    description:
      "Flexible brush tip for broad strokes and a fine tip for details. Water-based, blendable ink that won't bleed through quality paper.",
    price: "$32",
    category: "Markers",
    icon: "✒",
    link: "#",
  },
  // Paper
  {
    name: "HP Premium32 LaserJet Paper",
    brand: "HP",
    description:
      "Thick, ultra-smooth 32lb paper that handles colored pencils and markers without feathering. The weight makes every print feel substantial.",
    price: "$14",
    category: "Paper",
    icon: "☐",
    link: "#",
  },
  {
    name: "Neenah Exact Index Cardstock",
    brand: "Neenah",
    description:
      "110lb cardstock for when you want your coloring pages to feel like real art prints. Smooth surface, no bleeding, frame-worthy results.",
    price: "$12",
    category: "Paper",
    icon: "☐",
    link: "#",
  },
  // Ambiance
  {
    name: "Paddywax Apothecary Candle — Tobacco & Patchouli",
    brand: "Paddywax",
    description:
      "A warm, grounding scent that transforms your coloring corner into a ritual space. Hand-poured soy wax, 60-hour burn time.",
    price: "$24",
    category: "Ambiance",
    icon: "🕯",
    link: "#",
  },
  {
    name: "Vitruvi Stone Diffuser",
    brand: "Vitruvi",
    description:
      "Beautifully designed ceramic diffuser for essential oils. Quiet, elegant, and sets the mood for an evening coloring session.",
    price: "$119",
    category: "Ambiance",
    icon: "❋",
    link: "#",
  },
];

const categories = [...new Set(products.map((p) => p.category))];

export default function FavoritesPage() {
  return (
    <>
      <FlashlightCursor />
      <Navbar />
      <main className="min-h-screen pt-32 pb-20">
        {/* Header */}
        <section className="flex flex-col items-center px-6 pb-20">
          <ScrollReveal animation="blur-in">
            <p className="mb-4 text-xs font-light tracking-[0.3em] text-accent-amber/60 uppercase">
              Our Favorites
            </p>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100}>
            <h1 className="mb-6 text-center font-[family-name:var(--font-heading)] text-4xl font-normal text-text-primary md:text-5xl">
              Tools we love
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-in" delay={200}>
            <p className="max-w-lg text-center font-[family-name:var(--font-guidance)] text-lg font-light italic leading-relaxed text-text-secondary">
              A curated collection of supplies that make the coloring ritual more beautiful.
              Each one hand-picked, genuinely used, honestly recommended.
            </p>
          </ScrollReveal>
        </section>

        {/* Affiliate disclosure */}
        <ScrollReveal animation="fade-in" delay={300}>
          <p className="mx-auto mb-16 max-w-md px-6 text-center text-xs font-light leading-relaxed text-text-muted">
            Some links below are affiliate links — if you purchase through them, we earn a small commission at no extra cost to you. This helps keep ColorBreath ad-free.
          </p>
        </ScrollReveal>

        {/* Products by category */}
        <div className="mx-auto max-w-4xl px-6">
          {categories.map((category, ci) => (
            <section key={category} className="mb-20">
              <ScrollReveal animation="fade-up" delay={ci * 80}>
                <div className="mb-10 flex items-center gap-4">
                  <div className="h-px flex-1 bg-bg-surface" />
                  <h2 className="text-sm font-light tracking-[0.2em] text-accent-amber/70 uppercase">
                    {category}
                  </h2>
                  <div className="h-px flex-1 bg-bg-surface" />
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {products
                  .filter((p) => p.category === category)
                  .map((product, i) => (
                    <ScrollReveal key={product.name} animation="fade-up" delay={i * 100}>
                      <Link
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col gap-4 rounded-2xl bg-bg-elevated/50 p-6 transition-all duration-700 hover:-translate-y-1 hover:bg-bg-elevated hover:shadow-xl hover:shadow-black/30"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col gap-1">
                            <span className="font-[family-name:var(--font-heading)] text-lg text-text-primary">
                              {product.name}
                            </span>
                            <span className="text-xs font-light text-text-muted">
                              {product.brand}
                            </span>
                          </div>
                          <span className="rounded-full bg-bg-surface px-3 py-1 text-sm font-light text-accent-amber">
                            {product.price}
                          </span>
                        </div>

                        <p className="text-sm font-light leading-relaxed text-text-secondary">
                          {product.description}
                        </p>

                        <div className="mt-auto flex items-center gap-2 pt-2 text-xs font-light text-text-muted transition-colors duration-500 group-hover:text-accent-amber/70">
                          <span>View on Amazon</span>
                          <svg className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                        </div>
                      </Link>
                    </ScrollReveal>
                  ))}
              </div>
            </section>
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal animation="fade-up">
          <div className="flex flex-col items-center gap-6 px-6 pt-8">
            <div className="h-px w-16 bg-accent-amber/20" />
            <p className="max-w-sm text-center font-[family-name:var(--font-guidance)] text-base font-light italic text-text-secondary">
              The best tools are the ones already in your hand. Start coloring whenever you&apos;re ready.
            </p>
            <Link
              href="/today"
              className="inline-flex items-center gap-2 rounded-full border border-text-muted/30 px-6 py-3 text-sm font-light tracking-wide text-text-secondary transition-all duration-500 hover:border-text-secondary/50 hover:text-text-primary"
            >
              Today&apos;s coloring
            </Link>
          </div>
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
