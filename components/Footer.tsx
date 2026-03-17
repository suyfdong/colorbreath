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
    <footer className="relative overflow-hidden px-6 pb-0 pt-24">
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

          {/* Social */}
          <div className="flex items-center gap-5">
            <a
              href="#"
              className="text-text-secondary transition-colors duration-300 hover:text-text-primary"
              aria-label="Instagram"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="#"
              className="text-text-secondary transition-colors duration-300 hover:text-text-primary"
              aria-label="Pinterest"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 4.1 2.5 7.6 6 9.2-.1-.7-.1-1.9 0-2.7.1-.7.9-4.8.9-4.8s-.2-.5-.2-1.2c0-1.1.7-2 1.5-2 .7 0 1 .5 1 1.1 0 .7-.4 1.7-.7 2.6-.2.7.4 1.3 1.1 1.3 1.4 0 2.4-1.5 2.4-3.6 0-1.9-1.4-3.2-3.3-3.2-2.3 0-3.6 1.7-3.6 3.4 0 .7.3 1.4.6 1.8.1.1.1.1 0 .3l-.2.9c0 .2-.1.2-.3.1-1-.5-1.7-1.9-1.7-3.1 0-2.5 1.8-4.8 5.2-4.8 2.7 0 4.9 2 4.9 4.6 0 2.7-1.7 4.9-4.1 4.9-.8 0-1.6-.4-1.8-.9l-.5 1.9c-.2.7-.7 1.6-1 2.1.8.2 1.6.4 2.4.4 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>
      </ScrollReveal>

      {/* Copyright */}
      <p className="mt-16 text-center text-xs font-light text-text-secondary/60">
        &copy; 2026 ColorBreath. All rights reserved.
      </p>

      {/* Watermark with gradient color wash */}
      <div className="pointer-events-none relative mt-4 flex justify-center overflow-hidden" style={{ height: "20rem" }}>
        <div
          className="absolute bottom-0 left-1/2 h-full w-[130%] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse 40% 60% at 30% 85%, rgba(181,167,200,0.2) 0%, transparent 55%), radial-gradient(ellipse 35% 55% at 55% 90%, rgba(201,168,124,0.18) 0%, transparent 50%), radial-gradient(ellipse 40% 60% at 75% 85%, rgba(139,165,131,0.15) 0%, transparent 55%), radial-gradient(ellipse 30% 50% at 45% 95%, rgba(126,141,181,0.12) 0%, transparent 45%)",
          }}
        />
        <span
          className="absolute bottom-[-1.5rem] font-[family-name:var(--font-heading)] text-[7rem] font-normal leading-none tracking-tight text-white/[0.09] md:text-[11rem] lg:text-[14rem]"
          aria-hidden="true"
        >
          ColorBreath
        </span>
      </div>
    </footer>
  );
}
