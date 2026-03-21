import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Coloring Pages — Browse by Mood & Style",
  description:
    "Browse our collection of free adult coloring pages. Filter by mood — Calm, Sleep, Energy, Comfort — or by style. Printable mindfulness coloring pages for stress relief and relaxation.",
  alternates: { canonical: "/explore" },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
