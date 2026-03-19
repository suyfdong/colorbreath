/**
 * A/B test: 3 scenes × 3 prompt strategies = 9 images
 * Run: node scripts/test-prompts.mjs
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const API_TOKEN = process.env.REPLICATE_API_TOKEN;
if (!API_TOKEN) { console.error("Set REPLICATE_API_TOKEN env var"); process.exit(1); }
const MODEL = "black-forest-labs/flux-1.1-pro";
const OUT = join(import.meta.dirname, "../public/coloring/test");
mkdirSync(OUT, { recursive: true });

// ── Prompt Strategies ──────────────────────────────────────────

const SUFFIX_A = "clean outlines, no shading no fill no color, white background, printable coloring book illustration for adults, complete scene composition, edge to edge full bleed illustration filling the entire canvas, no border no margin no empty space around edges";

const SUFFIX_B = "clean outlines, no shading no fill no color, pure white background, printable coloring book illustration for adults, complete scene composition, edge to edge full bleed illustration filling the entire canvas, no border no margin no empty space around edges, ABSOLUTELY NO black filled areas, NO dark shading, NO hatching, NO cross-hatching, EVERY area must be white and empty and ready to be colored in, think of stained glass window with all glass removed leaving only the lead lines, large simple shapes easy to color with colored pencils";

// Strategy C uses a different prompt structure entirely
function makePromptC(sceneDescription) {
  return `Line drawing in the style of a professional adult coloring book by Johanna Basford, ${sceneDescription}, drawn with uniform thin black ink outlines on pure white paper, every enclosed shape is empty white space meant to be filled with color, no gradients no shading no texture no solid black areas, the entire image is composed of clean closed outlines creating distinct colorable sections, edge to edge full bleed illustration filling the entire canvas`;
}

// ── Scene Descriptions ─────────────────────────────────────────

const scenes = [
  {
    name: "warm-blanket",
    descA: `Black and white coloring page, cozy window seat scene on a rainy day, a warm knit blanket draped over cushioned window bench, steaming tea cup on windowsill, rain drops on window glass, view of rainy garden outside, curtains on both sides, potted plants on windowsill, books stacked nearby, moderate detail with clear sections to color, ${SUFFIX_A}`,
    descB: `Black and white coloring page, cozy window seat scene on a rainy day, a warm knit blanket draped over cushioned window bench, steaming tea cup on windowsill, rain drops on window glass, view of rainy garden outside, curtains on both sides, potted plants on windowsill, books stacked nearby, moderate detail with clear sections to color, ${SUFFIX_B}`,
    descC_scene: "cozy window seat scene on a rainy day, a warm knit blanket draped over cushioned window bench, steaming tea cup on windowsill, rain drops on window glass, view of garden outside, curtains on both sides, potted plants on windowsill, books stacked nearby, moderate detail with clear sections to color",
  },
  {
    name: "moonlit-garden",
    descA: `Black and white coloring page, moonlit night garden scene, full moon in sky, a wooden garden gate slightly open, night-blooming flowers along a stone path, fireflies as small circles of light, a garden lantern, picket fence, stars in sky, simple minimal detail with large open areas, easy beginner level, ${SUFFIX_A}`,
    descB: `Black and white coloring page, moonlit night garden scene, full moon in sky, a wooden garden gate slightly open, night-blooming flowers along a stone path, fireflies as small circles of light, a garden lantern, picket fence, stars in sky, the sky must be WHITE not black, simple minimal detail with large open areas, easy beginner level, ${SUFFIX_B}`,
    descC_scene: "moonlit night garden scene, full moon in sky, a wooden garden gate slightly open, night-blooming flowers along a stone path, fireflies as small dots, a garden lantern, picket fence, stars in sky, simple minimal detail with large open areas",
  },
  {
    name: "kitchen-morning",
    descA: `Black and white coloring page, cozy morning kitchen scene, sunlight streaming through a window above the sink, a kettle on the stove, breakfast items on a wooden counter, a cat sitting on a kitchen stool, hanging herbs drying from the ceiling, open shelves with jars and mugs, a small potted plant on the windowsill, checkered floor tiles, moderate detail with clear sections to color, ${SUFFIX_A}`,
    descB: `Black and white coloring page, cozy morning kitchen scene, sunlight streaming through a window above the sink, a kettle on the stove, breakfast items on a wooden counter, a cat sitting on a kitchen stool, hanging herbs drying from the ceiling, open shelves with jars and mugs, a small potted plant on the windowsill, checkered floor tiles, moderate detail with clear sections to color, ${SUFFIX_B}`,
    descC_scene: "cozy morning kitchen scene, sunlight streaming through a window above the sink, a kettle on the stove, breakfast items on a wooden counter, a cat sitting on a kitchen stool, hanging herbs drying from the ceiling, open shelves with jars and mugs, a small potted plant on the windowsill, checkered floor tiles, moderate detail",
  },
];

// ── Build test matrix ──────────────────────────────────────────

const tests = [];
for (const scene of scenes) {
  tests.push({ slug: `${scene.name}-A`, prompt: scene.descA });
  tests.push({ slug: `${scene.name}-B`, prompt: scene.descB });
  tests.push({ slug: `${scene.name}-C`, prompt: makePromptC(scene.descC_scene) });
}

// ── Replicate API helpers ──────────────────────────────────────

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

// ── Main ───────────────────────────────────────────────────────

async function main() {
  console.log(`\n🧪 A/B Test: ${tests.length} images (3 scenes × 3 strategies)\n`);

  // Submit all predictions in parallel
  const predictions = await Promise.all(
    tests.map(async (t) => {
      const id = await createPrediction(t.prompt);
      console.log(`⏳ ${t.slug} → prediction ${id}`);
      return { ...t, predictionId: id };
    })
  );

  console.log(`\n✅ All ${predictions.length} predictions submitted. Waiting...\n`);

  // Wait and download
  let done = 0;
  await Promise.all(
    predictions.map(async (p) => {
      try {
        const url = await waitForPrediction(p.predictionId);
        const file = await downloadImage(url, p.slug);
        done++;
        console.log(`✓ [${done}/${tests.length}] ${p.slug} → ${file}`);
      } catch (e) {
        console.error(`✗ ${p.slug}: ${e.message}`);
      }
    })
  );

  console.log(`\n🏁 Done! ${done}/${tests.length} images generated.`);
  console.log(`📂 Output: ${OUT}/`);
  console.log(`\nFiles:`);
  for (const scene of scenes) {
    console.log(`  ${scene.name}-A.webp  (baseline)`);
    console.log(`  ${scene.name}-B.webp  (强化负面约束)`);
    console.log(`  ${scene.name}-C.webp  (Johanna Basford 风格)`);
  }
}

main();
