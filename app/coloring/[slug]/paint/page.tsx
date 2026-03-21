import { coloringPages } from "@/data/coloringPages";
import PaintClient from "./PaintClient";

export function generateStaticParams() {
  return coloringPages.map((p) => ({ slug: p.slug }));
}

export default function PaintPage() {
  return <PaintClient />;
}
