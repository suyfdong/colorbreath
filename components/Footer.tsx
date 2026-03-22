import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

const footerLinks = [
  { label: "Today", href: "/today" },
  { label: "Explore", href: "/explore" },
  { label: "Favorites", href: "/favorites" },
  { label: "About", href: "/about" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-bg-deep px-6 pb-0 pt-24">
      <ScrollReveal animation="fade-in">
        <div className="mx-auto mb-16 h-px w-16 bg-text-muted/30" />
      </ScrollReveal>

      <ScrollReveal animation="fade-up">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <span className="font-[family-name:var(--font-heading)] text-xl tracking-wide text-text-primary">
              ColorBreath
            </span>
            <span className="font-[family-name:var(--font-guidance)] text-sm italic text-text-secondary">
              Breathe. Color. Be.
            </span>
          </div>

          {/* Links */}
          <div className="flex gap-8">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-light text-text-primary/70 transition-colors duration-300 hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

        </div>
      </ScrollReveal>

      {/* Copyright */}
      <p className="mt-16 text-center text-xs font-light text-text-secondary/60">
        &copy; 2026 ColorBreath. All rights reserved.
      </p>

      {/* Watermark with vibrant gradient color wash */}
      <div className="pointer-events-none relative mt-4 flex justify-center overflow-hidden" style={{ height: "22rem" }}>
        <div
          className="absolute bottom-0 left-1/2 h-full w-[140%] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse 45% 65% at 25% 80%, rgba(181,167,200,0.35) 0%, transparent 55%), radial-gradient(ellipse 40% 60% at 50% 85%, rgba(201,168,124,0.3) 0%, transparent 50%), radial-gradient(ellipse 45% 65% at 75% 80%, rgba(139,165,131,0.28) 0%, transparent 55%), radial-gradient(ellipse 35% 55% at 45% 90%, rgba(126,141,181,0.22) 0%, transparent 45%)",
          }}
        />
        <span
          className="absolute bottom-[-1.5rem] font-[family-name:var(--font-heading)] text-[7rem] font-normal leading-none tracking-tight md:text-[11rem] lg:text-[14rem]"
          aria-hidden="true"
          style={{
            background: "linear-gradient(135deg, rgba(181,167,200,0.25) 0%, rgba(237,232,226,0.18) 30%, rgba(201,168,124,0.25) 60%, rgba(139,165,131,0.2) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ColorBreath
        </span>
      </div>
    </footer>
  );
}
