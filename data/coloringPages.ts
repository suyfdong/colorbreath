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
  return `/coloring/${slug}.webp`;
}

/** Get audio file path for a mood */
export function getMoodAudio(mood: Mood): string {
  return `/audio/${mood}.mp3`;
}

/** Get default volume for a mood (sleep is quieter) */
export function getMoodVolume(mood: Mood): number {
  if (mood === "sleep") return 0.2;
  if (mood === "calm") return 0.3;
  return 0.35;
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
    slug: "reading-nook",
    title: "Reading Nook",
    mood: "calm",
    style: "mandala",
    difficulty: 2,
    description: "A cozy alcove with a round mandala rug, floor cushions, and shelves of well-loved books. Settle in.",
    audioTitle: "Gentle Rain & Piano",
    audioDuration: "22 min",
    bgImage: "/bg/reading-nook.jpg",
  },
  {
    slug: "window-garden",
    title: "Window Garden",
    mood: "calm",
    style: "floral",
    difficulty: 2,
    description: "A wide windowsill overflowing with flowering plants, a watering can, and morning sunshine.",
    audioTitle: "Forest Stream",
    audioDuration: "18 min",
    bgImage: "/bg/window-garden.jpg",
  },
  {
    slug: "bath-time",
    title: "Bath Time",
    mood: "calm",
    style: "geometric",
    difficulty: 1,
    description: "A clawfoot tub on patterned tiles, candles flickering, a book on the bath tray. Pure stillness.",
    audioTitle: "Lake Ambience",
    audioDuration: "25 min",
    bgImage: "/bg/bath-time.jpg",
  },
  {
    slug: "indoor-jungle",
    title: "Indoor Jungle",
    mood: "calm",
    style: "nature",
    difficulty: 2,
    description: "A sunlit room corner alive with tropical houseplants, hanging planters, and macrame.",
    audioTitle: "Soft Wind & Leaves",
    audioDuration: "20 min",
    bgImage: "/bg/indoor-jungle.jpg",
  },
  // — Sleep —
  {
    slug: "lavender-bedroom",
    title: "Lavender Bedroom",
    mood: "sleep",
    style: "floral",
    difficulty: 1,
    description: "A soft bed with lavender in vases, fairy lights, and a bedside lamp glowing warm. Time to rest.",
    audioTitle: "Night Cricket Lullaby",
    audioDuration: "30 min",
    bgImage: "/bg/lavender-bedroom.jpg",
  },
  {
    slug: "dreamcatcher-room",
    title: "Dreamcatcher Room",
    mood: "sleep",
    style: "mandala",
    difficulty: 1,
    description: "A peaceful bedroom with a dreamcatcher above the bed, a round mirror, and a moon-shaped nightlight.",
    audioTitle: "Deep Sleep Waves",
    audioDuration: "35 min",
    bgImage: "/bg/dreamcatcher-room.jpg",
  },
  {
    slug: "rainy-window",
    title: "Rainy Window",
    mood: "sleep",
    style: "nature",
    difficulty: 1,
    description: "A window seat with rain streaming down the glass, a sleeping cat, and a dim lamp. No rush, just rain.",
    audioTitle: "White Noise & Breathing",
    audioDuration: "40 min",
    bgImage: "/bg/rainy-window.jpg",
  },
  // — Energy —
  {
    slug: "breakfast-table",
    title: "Breakfast Table",
    mood: "energy",
    style: "geometric",
    difficulty: 3,
    description: "A cheerful morning spread — patterned tablecloth, fresh pastries, fruit, and a steaming cup of coffee.",
    audioTitle: "Upbeat Lo-fi Morning",
    audioDuration: "15 min",
    bgImage: "/bg/breakfast-table.jpg",
  },
  {
    slug: "sunlit-studio",
    title: "Sunlit Studio",
    mood: "energy",
    style: "floral",
    difficulty: 3,
    description: "An artist's workspace bathed in light — paint palettes, brushes in jars, and a vase of sunflowers.",
    audioTitle: "Acoustic Guitar & Birds",
    audioDuration: "18 min",
    bgImage: "/bg/sunlit-studio.jpg",
  },
  {
    slug: "vinyl-corner",
    title: "Vinyl Corner",
    mood: "energy",
    style: "mandala",
    difficulty: 3,
    description: "A music lover's nook — turntable spinning, records on the wall, a guitar, and a cup of coffee.",
    audioTitle: "Lo-fi Focus Beat",
    audioDuration: "20 min",
    bgImage: "/bg/vinyl-corner.jpg",
  },
  // — Comfort —
  {
    slug: "blanket-fort",
    title: "Blanket Fort",
    mood: "comfort",
    style: "geometric",
    difficulty: 2,
    description: "A cozy blanket fort with string lights, patterned quilts, pillows, and a bowl of snacks. Be a kid again.",
    audioTitle: "Fireplace Crackle",
    audioDuration: "25 min",
    bgImage: "/bg/blanket-fort.jpg",
  },
  {
    slug: "afternoon-tea",
    title: "Afternoon Tea",
    mood: "comfort",
    style: "floral",
    difficulty: 2,
    description: "A beautiful tea setting — floral teacups, a tiered cake stand with scones, and fresh flowers on the table.",
    audioTitle: "Warm Piano & Rain",
    audioDuration: "22 min",
    bgImage: "/bg/afternoon-tea.jpg",
  },
  {
    slug: "fireplace-nook",
    title: "Fireplace Nook",
    mood: "comfort",
    style: "mandala",
    difficulty: 1,
    description: "A glowing fireplace with a circular rug, a rocking chair, knitting basket, and a mug of hot cocoa.",
    audioTitle: "Soft Guitar Hum",
    audioDuration: "20 min",
    bgImage: "/bg/fireplace-nook.jpg",
  },
  {
    slug: "herb-kitchen",
    title: "Herb Kitchen",
    mood: "comfort",
    style: "nature",
    difficulty: 2,
    description: "A kitchen counter with potted herbs, hanging dried bundles, a mortar and pestle, and an open recipe book.",
    audioTitle: "Woodland Ambience",
    audioDuration: "28 min",
    bgImage: "/bg/herb-kitchen.jpg",
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
