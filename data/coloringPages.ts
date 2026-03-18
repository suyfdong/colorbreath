export type Mood = "calm" | "sleep" | "energy" | "comfort";

export type Style = "mandala" | "floral" | "geometric" | "nature";

export interface ColoringPage {
  slug: string;
  title: string;
  mood: Mood;
  style: Style;
  difficulty: 1 | 2 | 3;
  description: string;
  audioTitle: string;
  audioDuration: string;
  /** Unsplash background for detail page ambiance */
  bgImage: string;
}

/** Get the coloring SVG path for a page */
export function getColoringImage(slug: string): string {
  return `/coloring/${slug}.svg`;
}

export const moodMeta: Record<Mood, { label: string; color: string; phrase: string }> = {
  calm: { label: "Calm", color: "#b5a7c8", phrase: "Find your center" },
  sleep: { label: "Sleep", color: "#7e8db5", phrase: "Evening peace" },
  energy: { label: "Energy", color: "#c9a87c", phrase: "Morning light" },
  comfort: { label: "Comfort", color: "#8ba583", phrase: "Gentle embrace" },
};

export const styleMeta: Record<Style, { label: string }> = {
  mandala: { label: "Mandala" },
  floral: { label: "Floral" },
  geometric: { label: "Geometric" },
  nature: { label: "Nature" },
};

export const coloringPages: ColoringPage[] = [
  // — Calm —
  {
    slug: "lotus-meditation",
    title: "Lotus Meditation",
    mood: "calm",
    style: "mandala",
    difficulty: 2,
    description: "A symmetrical lotus mandala designed for centered, meditative coloring. Let each petal guide your breath.",
    audioTitle: "Gentle Rain & Piano",
    audioDuration: "22 min",
    bgImage: "/bg/lotus-meditation.jpg",
  },
  {
    slug: "morning-dew-roses",
    title: "Morning Dew Roses",
    mood: "calm",
    style: "floral",
    difficulty: 2,
    description: "Delicate rose petals with dewdrops. A gentle, unhurried pattern for quiet mornings.",
    audioTitle: "Forest Stream",
    audioDuration: "18 min",
    bgImage: "/bg/morning-dew-roses.jpg",
  },
  {
    slug: "still-water-circles",
    title: "Still Water Circles",
    mood: "calm",
    style: "geometric",
    difficulty: 1,
    description: "Concentric ripples expanding outward. Simple, soothing, like watching rain on a pond.",
    audioTitle: "Lake Ambience",
    audioDuration: "25 min",
    bgImage: "/bg/still-water-circles.jpg",
  },
  {
    slug: "whispering-ferns",
    title: "Whispering Ferns",
    mood: "calm",
    style: "nature",
    difficulty: 2,
    description: "Unfurling fern fronds in a repeating pattern. Each leaf a quiet meditation.",
    audioTitle: "Soft Wind & Leaves",
    audioDuration: "20 min",
    bgImage: "/bg/whispering-ferns.jpg",
  },
  // — Sleep —
  {
    slug: "moonlit-garden",
    title: "Moonlit Garden",
    mood: "sleep",
    style: "floral",
    difficulty: 1,
    description: "Night-blooming flowers under a crescent moon. Soft, sparse lines to ease you into rest.",
    audioTitle: "Night Cricket Lullaby",
    audioDuration: "30 min",
    bgImage: "/bg/moonlit-garden.jpg",
  },
  {
    slug: "starfield-mandala",
    title: "Starfield Mandala",
    mood: "sleep",
    style: "mandala",
    difficulty: 1,
    description: "A simple mandala with star and moon motifs. Minimal detail, maximum calm.",
    audioTitle: "Deep Sleep Waves",
    audioDuration: "35 min",
    bgImage: "/bg/starfield-mandala.jpg",
  },
  {
    slug: "cloud-drift",
    title: "Cloud Drift",
    mood: "sleep",
    style: "nature",
    difficulty: 1,
    description: "Soft, billowing cloud shapes. No sharp edges, no complexity — just floating ease.",
    audioTitle: "White Noise & Breathing",
    audioDuration: "40 min",
    bgImage: "/bg/cloud-drift.jpg",
  },
  // — Energy —
  {
    slug: "sunrise-geometry",
    title: "Sunrise Geometry",
    mood: "energy",
    style: "geometric",
    difficulty: 3,
    description: "Bold radiating lines and tessellations inspired by the first light of day.",
    audioTitle: "Upbeat Lo-fi Morning",
    audioDuration: "15 min",
    bgImage: "/bg/sunrise-geometry.jpg",
  },
  {
    slug: "wildflower-burst",
    title: "Wildflower Burst",
    mood: "energy",
    style: "floral",
    difficulty: 3,
    description: "An exuberant explosion of wildflowers. Intricate petals and stamens for focused engagement.",
    audioTitle: "Acoustic Guitar & Birds",
    audioDuration: "18 min",
    bgImage: "/bg/wildflower-burst.jpg",
  },
  {
    slug: "kaleidoscope-fire",
    title: "Kaleidoscope Fire",
    mood: "energy",
    style: "mandala",
    difficulty: 3,
    description: "A complex kaleidoscope of angular shapes and flame-like forms. For when you want to feel alive.",
    audioTitle: "Lo-fi Focus Beat",
    audioDuration: "20 min",
    bgImage: "/bg/kaleidoscope-fire.jpg",
  },
  // — Comfort —
  {
    slug: "warm-blanket-weave",
    title: "Warm Blanket Weave",
    mood: "comfort",
    style: "geometric",
    difficulty: 2,
    description: "Interlocking weave patterns reminiscent of a cozy knit blanket. Repetitive and grounding.",
    audioTitle: "Fireplace Crackle",
    audioDuration: "25 min",
    bgImage: "/bg/warm-blanket-weave.jpg",
  },
  {
    slug: "tea-garden-botanicals",
    title: "Tea Garden Botanicals",
    mood: "comfort",
    style: "floral",
    difficulty: 2,
    description: "Chamomile, lavender, and mint leaves arranged in a garden pattern. Warmth in every stroke.",
    audioTitle: "Warm Piano & Rain",
    audioDuration: "22 min",
    bgImage: "/bg/tea-garden-botanicals.jpg",
  },
  {
    slug: "nesting-circles",
    title: "Nesting Circles",
    mood: "comfort",
    style: "mandala",
    difficulty: 1,
    description: "Simple, nested circular forms that feel like a warm embrace. No sharp corners, no rush.",
    audioTitle: "Soft Guitar Hum",
    audioDuration: "20 min",
    bgImage: "/bg/nesting-circles.jpg",
  },
  {
    slug: "forest-floor",
    title: "Forest Floor",
    mood: "comfort",
    style: "nature",
    difficulty: 2,
    description: "Mushrooms, fallen leaves, and acorns in a woodland floor scene. Earthy and nurturing.",
    audioTitle: "Woodland Ambience",
    audioDuration: "28 min",
    bgImage: "/bg/forest-floor.jpg",
  },
];

/** Get today's featured page based on date rotation */
export function getTodaysPick(): ColoringPage {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return coloringPages[dayOfYear % coloringPages.length];
}

/** Get pages filtered by mood */
export function getPagesByMood(mood: Mood): ColoringPage[] {
  return coloringPages.filter((p) => p.mood === mood);
}
