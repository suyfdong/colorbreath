/**
 * Regenerate breakfast-table with stronger black-and-white-only constraint.
 * Run: node scripts/regenerate-failed.mjs
 */

import { writeFileSync } from "fs";
import { join } from "path";

const API_TOKEN = process.env.REPLICATE_API_TOKEN;
if (!API_TOKEN) { console.error("Set REPLICATE_API_TOKEN env var"); process.exit(1); }
const MODEL = "black-forest-labs/flux-1.1-pro";
const OUT = join(import.meta.dirname, "../public/coloring");

function makePrompt(sceneDescription) {
  return `Black and white line drawing only, in the style of a professional adult coloring book by Johanna Basford, ${sceneDescription}, drawn with uniform thin black ink outlines on pure white paper, every enclosed shape is empty white space meant to be filled with color, absolutely no color no yellow no blue no red no green no brown, no gradients no shading no texture no solid black areas no filled leaves no filled shapes, only pure black lines on pure white background, the entire image is composed of clean closed outlines creating distinct colorable sections, edge to edge full bleed illustration filling the entire canvas`;
}

const pages = [
  {
    slug: "breakfast-table",
    prompt: makePrompt("a cheerful breakfast table scene, a geometric patterned tablecloth, a plate of croissants and pastries drawn as outlines, a bowl of round fruit drawn as empty circles, a French press coffee maker drawn as outline only, a steaming mug, a small vase with a single flower, checkered floor tiles, morning light from a window, detailed with many sections to color, strictly black and white only no color fills anywhere"),
  },
];

async function createPrediction(prompt) {
  const res = await fetch(
    `https://api.replicate.com/v1/models/${MODEL}/predictions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: { prompt, width: 1024, height: 1024 },
      }),
    }
  );
  const data = await res.json();
  if (data.error) throw new Error(`API error: ${data.error}`);
  return data.id;
}

async function waitForPrediction(id) {
  while (true) {
    const res = await fetch(
      `https://api.replicate.com/v1/predictions/${id}`,
      { headers: { Authorization: `Bearer ${API_TOKEN}` } }
    );
    const data = await res.json();
    if (data.status === "succeeded") return data.output;
    if (data.status === "failed" || data.status === "canceled") {
      throw new Error(`Prediction ${id} ${data.status}: ${data.error}`);
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
}

async function downloadImage(url, slug) {
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  const file = join(OUT, `${slug}.webp`);
  writeFileSync(file, buffer);
  return file;
}

async function main() {
  console.log(`Regenerating ${pages.length} page(s)...\n`);

  for (const p of pages) {
    const id = await createPrediction(p.prompt);
    console.log(`⏳ ${p.slug} → prediction ${id}`);
    const url = await waitForPrediction(id);
    const file = await downloadImage(url, p.slug);
    console.log(`✓ ${p.slug} → ${file}`);
  }

  console.log("\nDone!");
}

main();
