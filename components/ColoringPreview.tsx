import { getColoringImage } from "@/data/coloringPages";

/**
 * Displays the unique coloring page line art for a given slug.
 * SVGs have transparent background with black lines.
 * `invert` makes them white lines on transparent — perfect for dark UI.
 * Uses plain <img> to preserve SVG transparency (Next Image rasterizes SVGs).
 */
export default function ColoringPreview({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={getColoringImage(slug)}
      alt={`${slug.replace(/-/g, " ")} coloring page`}
      width={800}
      height={800}
      className={`invert ${className}`}
      loading="lazy"
    />
  );
}
