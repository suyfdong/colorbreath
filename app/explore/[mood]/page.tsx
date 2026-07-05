import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlashlightCursor from "@/components/FlashlightCursor";
import ExploreBrowser from "@/components/ExploreBrowser";
import { moodMeta, type Mood } from "@/data/coloringPages";

interface MoodSeo {
  title: string;
  description: string;
  h1: string;
  intro: string;
  bottomHeading: string;
  bottomBody: string;
}

const moodSeo: Record<Mood, MoodSeo> = {
  sleep: {
    title: "Sleep Coloring Pages — Calm Your Mind Before Bed",
    description:
      "Wind down with free printable coloring pages made for sleep. Soft bedtime scenes paired with deep-sleep soundscapes to loosen a busy mind and help you drift off. Print or color online, no ads.",
    h1: "Coloring Pages for Sleep & Bedtime Calm",
    intro:
      "A quiet ritual for the end of the day. These gentle scenes — lavender bedrooms, rainy windows, dreamcatchers — pair with slow, low soundscapes to loosen a busy mind and ease you toward rest. No screens buzzing at you, no rush.",
    bottomHeading: "Why coloring helps you sleep",
    bottomBody:
      "Screens keep the mind alert; coloring does the opposite. The slow, repetitive motion quiets mental chatter — much like a bedtime meditation — making it easier to let go of the day. Keep the lights low, put on a deep-sleep soundscape, and color for a few minutes before bed.",
  },
  calm: {
    title: "Calming Coloring Pages for Anxiety & Stress Relief",
    description:
      "Free printable calming coloring pages to quiet anxiety and ease stress. Mandalas, florals, and cozy scenes paired with ambient sound — a simple mindfulness practice you can start in seconds.",
    h1: "Calming Coloring Pages for Anxiety Relief",
    intro:
      "When the mind is racing, one gentle focus helps it settle. These calm scenes — reading nooks, window gardens, quiet baths — give your attention somewhere soft to rest while ambient sound holds the space. Color at your own pace; there is nothing to finish.",
    bottomHeading: "Coloring as anxiety relief",
    bottomBody:
      "Focusing on a single, low-stakes task interrupts the loop of anxious thought, which is why coloring is often compared to mindfulness meditation. There is no wrong way to do it and nothing to achieve — just color, breathe, and let the pattern fill in.",
  },
  energy: {
    title: "Energizing Coloring Pages for Focus & Creativity",
    description:
      "Free printable coloring pages to lift your mood and spark focus. Bright morning scenes paired with upbeat lo-fi soundscapes — a gentle way to shake off the fog and find your flow.",
    h1: "Coloring Pages for Energy & Focus",
    intro:
      "A gentler alternative to another cup of coffee. These bright, lively scenes — sunlit studios, breakfast tables, vinyl corners — pair with upbeat lo-fi to wake up your attention and ease you into a focused, creative flow.",
    bottomHeading: "Color your way into focus",
    bottomBody:
      "A short creative warm-up can clear mental fog better than scrolling. A few minutes of coloring, paired with an upbeat soundscape, gives your mind a low-pressure runway into deeper focus — a small ritual to start the morning or reset a flat afternoon.",
  },
  comfort: {
    title: "Cozy Coloring Pages for Comfort & Self-Care",
    description:
      "Free printable cozy coloring pages for comfort and self-care. Warm, homey scenes paired with crackling-fire soundscapes — a small, kind ritual for the moments you need to feel held.",
    h1: "Cozy Coloring Pages for Comfort",
    intro:
      "For the days you just need something warm. These homey scenes — blanket forts, fireside nooks, afternoon tea — pair with crackling, soft soundscapes to wrap the moment in comfort. A small act of self-care, entirely at your pace.",
    bottomHeading: "A small ritual of comfort",
    bottomBody:
      "Comfort does not have to be complicated. Warm colors, a soft soundscape, and a few unhurried minutes with a cozy scene can steady a hard day — a gentle form of self-care that asks nothing of you but to show up and color.",
  },
};

export function generateStaticParams() {
  return (Object.keys(moodSeo) as Mood[]).map((mood) => ({ mood }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ mood: string }>;
}): Promise<Metadata> {
  const { mood } = await params;
  const seo = moodSeo[mood as Mood];
  if (!seo) return {};

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `/explore/${mood}` },
    openGraph: {
      title: seo.title,
      description: seo.description,
    },
  };
}

export default async function MoodExplorePage({
  params,
}: {
  params: Promise<{ mood: string }>;
}) {
  const { mood } = await params;
  const seo = moodSeo[mood as Mood];
  if (!seo) notFound();

  return (
    <>
      <FlashlightCursor />
      <Navbar />
      <Suspense>
        <ExploreBrowser
          initialMood={mood as Mood}
          eyebrow={moodMeta[mood as Mood].label}
          title={seo.h1}
          intro={seo.intro}
        >
          <h2 className="mb-5 font-[family-name:var(--font-heading)] text-xl font-normal text-text-primary">
            {seo.bottomHeading}
          </h2>
          <p className="text-sm font-light leading-relaxed text-text-secondary">
            {seo.bottomBody}
          </p>
        </ExploreBrowser>
      </Suspense>
      <Footer />
    </>
  );
}
