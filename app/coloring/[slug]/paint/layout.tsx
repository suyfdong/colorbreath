import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Online — Mindful Digital Coloring",
  description:
    "Color online with our digital coloring tool. Fill, brush, and blend — save your progress and export your artwork. A calming, ad-free coloring experience.",
  robots: { index: false },
};

export default function PaintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
