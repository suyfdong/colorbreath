import type { Metadata, Viewport } from "next";
import { Playfair_Display, Outfit, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://colorbreath.com"),
  title: {
    default: "ColorBreath — Mindful Adult Coloring Pages for Stress Relief",
    template: "%s | ColorBreath",
  },
  description:
    "Free printable adult coloring pages paired with ambient soundscapes. Mindfulness coloring for stress relief, better sleep, and gentle self-care. No ads, no rush — just breathe and color.",
  keywords: [
    "adult coloring pages",
    "mindfulness coloring",
    "printable coloring pages for adults",
    "stress relief coloring",
    "mandala coloring pages",
    "free adult coloring pages",
    "meditation coloring",
    "coloring pages printable",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ColorBreath",
    title: "ColorBreath — Mindful Adult Coloring Pages for Stress Relief",
    description:
      "Free printable coloring pages paired with ambient soundscapes. A mindful coloring space for stress relief, sleep, and self-care.",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${outfit.variable} ${cormorant.variable} antialiased min-w-0`}
      >
        {children}
      </body>
    </html>
  );
}
