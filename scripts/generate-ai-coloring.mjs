/**
 * Batch generate 14 coloring page images via Replicate Flux 1.1 Pro.
 * Uses "Johanna Basford style" prompt strategy (Strategy C from A/B test).
 * Run: node scripts/generate-ai-coloring.mjs
 */

import { writeFileSync } from "fs";
import { join } from "path";

const API_TOKEN = process.env.REPLICATE_API_TOKEN;
if (!API_TOKEN) { console.error("Set REPLICATE_API_TOKEN env var"); process.exit(1); }
const MODEL = "black-forest-labs/flux-1.1-pro";
const OUT = join(import.meta.dirname, "../public/coloring");

/**
 * Strategy C prompt template — best result from A/B test.
 * Key principles:
 * - "Johanna Basford" style reference grounds the model
 * - Explicit "empty white space meant to be filled with color"
 * - No gradients/shading/texture/solid black
 * - "clean closed outlines creating distinct colorable sections"
 */
function makePrompt(sceneDescription) {
  return `Line drawing in the style of a professional adult coloring book by Johanna Basford, ${sceneDescription}, drawn with uniform thin black ink outlines on pure white paper, every enclosed shape is empty white space meant to be filled with color, no gradients no shading no texture no solid black areas, the entire image is composed of clean closed outlines creating distinct colorable sections, edge to edge full bleed illustration filling the entire canvas`;
}

const pages = [
  // — Calm —
  {
    slug: "reading-nook",
    prompt: makePrompt("a cozy reading nook alcove with a round decorative mandala rug on the floor, large floor cushions, a built-in bookshelf filled with books, a steaming cup of tea on a small side table, hanging plants from above, a soft throw blanket draped over a cushion, moderate detail with clear sections to color"),
  },
  {
    slug: "window-garden",
    prompt: makePrompt("a wide windowsill overflowing with flowering potted plants, roses and daisies in ceramic pots, a small watering can, gardening gloves, sunshine streaming through the window panes, lace curtains on the sides, a butterfly resting on a petal, moderate detail with clear sections to color"),
  },
  {
    slug: "bath-time",
    prompt: makePrompt("a clawfoot bathtub in a cozy bathroom, geometric patterned floor tiles, lit candles on the tub edge, a wooden bath tray with an open book and a cup of tea, potted plants on a shelf, a fluffy towel hanging nearby, a small window with curtains, simple and minimal with large open areas, easy beginner level"),
  },
  {
    slug: "indoor-jungle",
    prompt: makePrompt("a sunlit room corner filled with tropical houseplants, monstera and fiddle leaf fig in large pots, hanging planters with trailing vines, a macrame plant hanger, a small wooden stool with a watering can, sunlight casting through a large window, moderate detail with clear sections to color"),
  },
  // — Sleep —
  {
    slug: "lavender-bedroom",
    prompt: makePrompt("a peaceful bedroom scene, a cozy bed with soft pillows and a folded blanket, a bedside table with a vase of lavender flowers, a small lamp glowing, fairy lights draped along the headboard, a pair of slippers on the floor, a book on the nightstand, simple and minimal with large open areas, easy beginner level"),
  },
  {
    slug: "dreamcatcher-room",
    prompt: makePrompt("a serene bedroom with a decorative dreamcatcher hanging above the bed, a round mirror on the wall, a crescent moon shaped nightlight on the dresser, soft pillows on the bed, a potted plant on the windowsill, curtains gently parted, simple and minimal with large open areas, easy beginner level"),
  },
  {
    slug: "rainy-window",
    prompt: makePrompt("a cozy window seat on a rainy day, raindrops on the window glass, a sleeping cat curled up on a cushion, a warm blanket draped over the seat, a dim table lamp beside it, potted plants on the windowsill, a cup of tea, view of a garden through the rainy glass, simple and minimal with large open areas, easy beginner level"),
  },
  // — Energy —
  {
    slug: "breakfast-table",
    prompt: makePrompt("a cheerful breakfast table scene, a geometric patterned tablecloth, a plate of croissants and pastries, a bowl of fruit with oranges and berries, a French press coffee maker, a steaming mug, a small vase with a single flower, checkered floor tiles, morning light from a window, detailed with many sections to color"),
  },
  {
    slug: "sunlit-studio",
    prompt: makePrompt("an artist studio workspace bathed in sunlight from a large window, a wooden easel with a canvas, paint palette with brushes, jars of paintbrushes on a table, a vase of sunflowers, tubes of paint scattered, a stool, art supplies on shelves, detailed with many sections to color"),
  },
  {
    slug: "vinyl-corner",
    prompt: makePrompt("a cozy music corner in a living room, a vintage turntable on a wooden cabinet, vinyl records stored below and displayed on the wall, a guitar leaning against the wall, a pair of headphones, a cup of coffee on a coaster, a small potted plant, a comfortable armchair nearby, detailed with many sections to color"),
  },
  // — Comfort —
  {
    slug: "blanket-fort",
    prompt: makePrompt("a cozy blanket fort made with draped quilts and sheets, string lights hanging inside, geometric patterned pillows and blankets, a bowl of popcorn, a stack of books, a small lantern, seen from inside looking out, warm and inviting, moderate detail with clear sections to color"),
  },
  {
    slug: "afternoon-tea",
    prompt: makePrompt("an elegant afternoon tea setting on a round table, a floral teapot with matching teacups and saucers, a tiered cake stand with scones and petit fours, a small vase of fresh flowers, lace doily on the table, a window with curtains in the background, a cat sitting on a nearby chair, moderate detail with clear sections to color"),
  },
  {
    slug: "fireplace-nook",
    prompt: makePrompt("a cozy fireplace scene in a living room, a brick fireplace with gentle flames, a circular braided rug in front, a rocking chair with a knit blanket, a knitting basket on the floor, a mug of hot cocoa on a small table, bookshelves on either side, a sleeping dog on the rug, simple and minimal with large open areas, easy beginner level"),
  },
  {
    slug: "herb-kitchen",
    prompt: makePrompt("a warm kitchen counter scene, potted herbs in a row on the windowsill including basil rosemary and mint, bundles of dried herbs hanging from a rack above, a wooden cutting board with a mortar and pestle, an open recipe book, a ceramic bowl of lemons, a kitchen towel, tile backsplash, moderate detail with clear sections to color"),
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
  console.log(`Starting batch generation of ${pages.length} coloring pages...\n`);

  // Fire all predictions in parallel
  const predictions = await Promise.all(
    pages.map(async (p) => {
      const id = await createPrediction(p.prompt);
      console.log(`⏳ ${p.slug} → prediction ${id}`);
      return { ...p, predictionId: id };
    })
  );

  console.log(`\nAll ${predictions.length} predictions submitted. Waiting for results...\n`);

  // Wait and download all
  let done = 0;
  await Promise.all(
    predictions.map(async (p) => {
      try {
        const url = await waitForPrediction(p.predictionId);
        const file = await downloadImage(url, p.slug);
        done++;
        console.log(`✓ [${done}/${pages.length}] ${p.slug} → ${file}`);
      } catch (e) {
        console.error(`✗ ${p.slug}: ${e.message}`);
      }
    })
  );

  console.log(`\nDone! ${done}/${pages.length} images generated.`);
}

main();
