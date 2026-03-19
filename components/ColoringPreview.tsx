import { getColoringImage } from "@/data/coloringPages";

/**
 * Displays the coloring page line art for a given slug.
 * Line arts are black-on-white WebP images shown on a white "paper" card
 * that contrasts nicely against the dark UI — like a real sheet of paper.
 */
export default function ColoringPreview({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-xl bg-white shadow-lg shadow-black/20 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={getColoringImage(slug)}
        alt={`${slug.replace(/-/g, " ")} coloring page`}
        width={800}
        height={800}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
