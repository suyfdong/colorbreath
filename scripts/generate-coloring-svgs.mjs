/**
 * Generate unique coloring page SVG line art for each of the 14 pages.
 * Black lines on white background, suitable for flood-fill coloring.
 * Run: node scripts/generate-coloring-svgs.mjs
 */

import { writeFileSync } from "fs";
import { join } from "path";

const OUT = join(import.meta.dirname, "../public/coloring");
const SIZE = 800;
const C = SIZE / 2; // center

// ── Helpers ──

function circle(cx, cy, r) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" />`;
}

function ellipse(cx, cy, rx, ry, rotate = 0) {
  const t = rotate ? ` transform="rotate(${rotate} ${cx} ${cy})"` : "";
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"${t} />`;
}

function line(x1, y1, x2, y2) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
}

function path(d) {
  return `<path d="${d}" />`;
}

function polarXY(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function petalPath(cx, cy, r, angleDeg, petalLen, petalWidth) {
  const rad = (angleDeg * Math.PI) / 180;
  const tipX = cx + (r + petalLen) * Math.cos(rad);
  const tipY = cy + (r + petalLen) * Math.sin(rad);
  const baseX = cx + r * Math.cos(rad);
  const baseY = cy + r * Math.sin(rad);
  const perpRad = rad + Math.PI / 2;
  const hw = petalWidth / 2;
  const lx = baseX + hw * Math.cos(perpRad);
  const ly = baseY + hw * Math.sin(perpRad);
  const rx = baseX - hw * Math.cos(perpRad);
  const ry = baseY - hw * Math.sin(perpRad);
  const cp1x = (lx + tipX) / 2 + hw * 0.3 * Math.cos(perpRad);
  const cp1y = (ly + tipY) / 2 + hw * 0.3 * Math.sin(perpRad);
  const cp2x = (rx + tipX) / 2 - hw * 0.3 * Math.cos(perpRad);
  const cp2y = (ry + tipY) / 2 - hw * 0.3 * Math.sin(perpRad);
  return `M${lx},${ly} Q${cp1x},${cp1y} ${tipX},${tipY} Q${cp2x},${cp2y} ${rx},${ry} Z`;
}

function wrap(content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" fill="none" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
${content}
</svg>`;
}

// Seeded random for reproducibility
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ── Mandala Generators ──

function mandalaLotus() {
  const parts = [];
  // Outer border
  parts.push(circle(C, C, 370));
  parts.push(circle(C, C, 360));

  // Outer petal ring - 16 large petals
  for (let i = 0; i < 16; i++) {
    const a = (360 / 16) * i;
    parts.push(path(petalPath(C, C, 200, a, 140, 60)));
    // Inner line on each petal
    parts.push(path(petalPath(C, C, 210, a, 110, 25)));
  }

  // Middle ring - 12 medium petals
  for (let i = 0; i < 12; i++) {
    const a = (360 / 12) * i + 15;
    parts.push(path(petalPath(C, C, 120, a, 90, 45)));
    parts.push(path(petalPath(C, C, 130, a, 65, 18)));
  }

  // Inner ring - 8 small petals
  for (let i = 0; i < 8; i++) {
    const a = (360 / 8) * i;
    parts.push(path(petalPath(C, C, 55, a, 60, 35)));
  }

  // Concentric circles
  [340, 200, 120, 55, 30].forEach(r => parts.push(circle(C, C, r)));

  // Center flower
  for (let i = 0; i < 6; i++) {
    const a = (360 / 6) * i;
    parts.push(path(petalPath(C, C, 12, a, 20, 14)));
  }
  parts.push(circle(C, C, 10));

  // Decorative dots between outer petals
  for (let i = 0; i < 16; i++) {
    const a = (360 / 16) * i + 360 / 32;
    const [x, y] = polarXY(C, C, 345, a);
    parts.push(circle(x, y, 4));
  }

  return wrap(parts.join("\n"));
}

function mandalaStarfield() {
  const parts = [];
  parts.push(circle(C, C, 370));

  // Star points - outer ring of 8-pointed stars
  for (let i = 0; i < 8; i++) {
    const a = (360 / 8) * i;
    const [ox, oy] = polarXY(C, C, 290, a);
    // Each star
    for (let j = 0; j < 8; j++) {
      const sa = (360 / 8) * j;
      const [sx, sy] = polarXY(ox, oy, 45, sa);
      parts.push(line(ox, oy, sx, sy));
    }
    parts.push(circle(ox, oy, 30));
    parts.push(circle(ox, oy, 15));
  }

  // Middle ring - crescent moons
  for (let i = 0; i < 12; i++) {
    const a = (360 / 12) * i;
    const [mx, my] = polarXY(C, C, 180, a);
    parts.push(circle(mx, my, 18));
    parts.push(`<circle cx="${mx + 6}" cy="${my - 6}" r="15" fill="white" stroke="black" stroke-width="1.5" />`);
  }

  // Radiating lines
  for (let i = 0; i < 24; i++) {
    const a = (360 / 24) * i;
    const [x1, y1] = polarXY(C, C, 100, a);
    const [x2, y2] = polarXY(C, C, 145, a);
    parts.push(line(x1, y1, x2, y2));
  }

  // Inner circles
  [370, 340, 240, 145, 100, 60, 20].forEach(r => parts.push(circle(C, C, r)));

  // Center star
  for (let i = 0; i < 12; i++) {
    const a = (360 / 12) * i;
    const [sx, sy] = polarXY(C, C, 50, a);
    parts.push(line(C, C, sx, sy));
  }

  // Tiny dots scattered
  const rng = seededRandom(42);
  for (let i = 0; i < 40; i++) {
    const a = rng() * 360;
    const r = 240 + rng() * 100;
    const [x, y] = polarXY(C, C, r, a);
    parts.push(circle(x, y, 2));
  }

  return wrap(parts.join("\n"));
}

function mandalaKaleidoscope() {
  const parts = [];
  parts.push(circle(C, C, 375));
  parts.push(circle(C, C, 365));

  // 6-fold symmetry with complex geometry
  const N = 6;
  for (let i = 0; i < N; i++) {
    const a = (360 / N) * i;
    // Large diamond
    const [p1x, p1y] = polarXY(C, C, 350, a);
    const [p2x, p2y] = polarXY(C, C, 250, a + 30);
    const [p3x, p3y] = polarXY(C, C, 200, a);
    const [p4x, p4y] = polarXY(C, C, 250, a - 30);
    parts.push(path(`M${p1x},${p1y} L${p2x},${p2y} L${p3x},${p3y} L${p4x},${p4y} Z`));

    // Inner triangle
    const [t1x, t1y] = polarXY(C, C, 300, a);
    const [t2x, t2y] = polarXY(C, C, 230, a + 18);
    const [t3x, t3y] = polarXY(C, C, 230, a - 18);
    parts.push(path(`M${t1x},${t1y} L${t2x},${t2y} L${t3x},${t3y} Z`));

    // Flame shapes between main sections
    const midA = a + 360 / N / 2;
    parts.push(path(petalPath(C, C, 150, midA, 120, 50)));
    parts.push(path(petalPath(C, C, 160, midA, 80, 22)));
  }

  // Nested hexagons
  [200, 150, 100].forEach(r => {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const [x, y] = polarXY(C, C, r, (360 / 6) * i - 90);
      pts.push(`${x},${y}`);
    }
    parts.push(`<polygon points="${pts.join(" ")}" />`);
  });

  // Radiating lines (12)
  for (let i = 0; i < 12; i++) {
    const a = (360 / 12) * i;
    const [x1, y1] = polarXY(C, C, 60, a);
    const [x2, y2] = polarXY(C, C, 100, a);
    parts.push(line(x1, y1, x2, y2));
  }

  // Center ornament
  parts.push(circle(C, C, 55));
  for (let i = 0; i < 6; i++) {
    const a = (360 / 6) * i;
    parts.push(path(petalPath(C, C, 15, a, 30, 18)));
  }
  parts.push(circle(C, C, 12));

  return wrap(parts.join("\n"));
}

function mandalaNesting() {
  const parts = [];

  // Multiple nested circles with varying decorations
  const rings = [350, 310, 270, 230, 190, 150, 110, 70, 40];
  rings.forEach(r => parts.push(circle(C, C, r)));

  // Scalloped edges on some rings
  [350, 270, 190, 110].forEach(r => {
    const n = Math.round(r / 12);
    for (let i = 0; i < n; i++) {
      const a = (360 / n) * i;
      const [x, y] = polarXY(C, C, r, a);
      parts.push(circle(x, y, 8));
    }
  });

  // Petal arcs between rings
  [310, 230, 150].forEach((r, ri) => {
    const n = 8 + ri * 4;
    for (let i = 0; i < n; i++) {
      const a = (360 / n) * i;
      parts.push(path(petalPath(C, C, r - 15, a, 25, 16)));
    }
  });

  // Dot ring
  for (let i = 0; i < 24; i++) {
    const a = (360 / 24) * i;
    const [x, y] = polarXY(C, C, 330, a);
    parts.push(circle(x, y, 5));
  }

  // Center
  parts.push(circle(C, C, 15));

  return wrap(parts.join("\n"));
}

// ── Floral Generators ──

function flower(cx, cy, petalCount, petalLen, petalWidth, innerR) {
  const parts = [];
  for (let i = 0; i < petalCount; i++) {
    const a = (360 / petalCount) * i;
    parts.push(path(petalPath(cx, cy, innerR, a, petalLen, petalWidth)));
  }
  parts.push(circle(cx, cy, innerR));
  // Stamen dots
  for (let i = 0; i < petalCount; i++) {
    const a = (360 / petalCount) * i + 360 / petalCount / 2;
    const [x, y] = polarXY(cx, cy, innerR * 0.6, a);
    parts.push(circle(x, y, 2));
  }
  return parts.join("\n");
}

function leaf(cx, cy, length, angle, width) {
  const rad = (angle * Math.PI) / 180;
  const tipX = cx + length * Math.cos(rad);
  const tipY = cy + length * Math.sin(rad);
  const perpRad = rad + Math.PI / 2;
  const hw = width / 2;
  const cp1x = (cx + tipX) / 2 + hw * Math.cos(perpRad);
  const cp1y = (cy + tipY) / 2 + hw * Math.sin(perpRad);
  const cp2x = (cx + tipX) / 2 - hw * Math.cos(perpRad);
  const cp2y = (cy + tipY) / 2 - hw * Math.sin(perpRad);
  let d = `M${cx},${cy} Q${cp1x},${cp1y} ${tipX},${tipY} Q${cp2x},${cp2y} ${cx},${cy}`;
  // midrib
  d += ` M${cx},${cy} L${tipX},${tipY}`;
  return path(d);
}

function floralRoses() {
  const parts = [];

  // Center large rose - layered petals
  for (let layer = 0; layer < 4; layer++) {
    const r = 20 + layer * 30;
    const n = 5 + layer * 2;
    const offset = layer * 15;
    for (let i = 0; i < n; i++) {
      const a = (360 / n) * i + offset;
      parts.push(path(petalPath(C, C, r, a, 35 + layer * 8, 28 + layer * 5)));
    }
  }
  parts.push(circle(C, C, 15));

  // Surrounding smaller roses
  const rosePositions = [
    [180, 180], [620, 180], [180, 620], [620, 620],
    [400, 120], [400, 680], [120, 400], [680, 400],
  ];
  rosePositions.forEach(([rx, ry]) => {
    for (let layer = 0; layer < 3; layer++) {
      const r = 10 + layer * 18;
      const n = 5 + layer;
      for (let i = 0; i < n; i++) {
        const a = (360 / n) * i + layer * 20;
        parts.push(path(petalPath(rx, ry, r, a, 22 + layer * 5, 18 + layer * 3)));
      }
    }
    parts.push(circle(rx, ry, 8));
  });

  // Leaves connecting roses
  rosePositions.forEach(([rx, ry]) => {
    const angle = Math.atan2(ry - C, rx - C) * 180 / Math.PI + 180;
    const mx = (rx + C) / 2;
    const my = (ry + C) / 2;
    parts.push(leaf(mx, my, 40, angle + 40, 20));
    parts.push(leaf(mx, my, 40, angle - 40, 20));
  });

  // Dewdrop circles scattered
  const rng = seededRandom(101);
  for (let i = 0; i < 20; i++) {
    const x = 80 + rng() * 640;
    const y = 80 + rng() * 640;
    parts.push(circle(x, y, 3 + rng() * 4));
  }

  // Border vine
  parts.push(circle(C, C, 380));

  return wrap(parts.join("\n"));
}

function floralMoonlit() {
  const parts = [];

  // Crescent moon top center
  parts.push(circle(C, 150, 60));
  parts.push(`<circle cx="${C + 20}" cy="135" r="55" fill="white" stroke="black" stroke-width="1.5" />`);

  // Night-blooming flowers - sparse, simple
  const flowerPos = [
    [200, 400, 5, 45, 30, 15],
    [600, 350, 6, 40, 25, 12],
    [350, 600, 5, 50, 35, 18],
    [500, 550, 4, 35, 28, 10],
    [150, 600, 5, 38, 26, 12],
    [650, 580, 4, 32, 22, 10],
  ];
  flowerPos.forEach(([fx, fy, n, pl, pw, ir]) => {
    parts.push(flower(fx, fy, n, pl, pw, ir));
  });

  // Stems rising up
  flowerPos.forEach(([fx, fy]) => {
    parts.push(path(`M${fx},${fy + 15} Q${fx - 15},${fy + 60} ${fx + 5},${fy + 100}`));
    // Small leaves on stems
    parts.push(leaf(fx - 5, fy + 50, 25, -30, 12));
    parts.push(leaf(fx + 5, fy + 70, 25, 210, 12));
  });

  // Stars - small asterisks
  const rng = seededRandom(77);
  for (let i = 0; i < 25; i++) {
    const x = 50 + rng() * 700;
    const y = 50 + rng() * 250;
    const sz = 4 + rng() * 6;
    parts.push(line(x - sz, y, x + sz, y));
    parts.push(line(x, y - sz, x, y + sz));
    parts.push(line(x - sz * 0.7, y - sz * 0.7, x + sz * 0.7, y + sz * 0.7));
    parts.push(line(x + sz * 0.7, y - sz * 0.7, x - sz * 0.7, y + sz * 0.7));
  }

  // Ground line
  parts.push(path(`M30,720 Q200,690 400,710 Q600,730 770,700`));

  return wrap(parts.join("\n"));
}

function floralWildflower() {
  const parts = [];
  const rng = seededRandom(55);

  // Dense wildflower meadow - many flowers of different types
  for (let i = 0; i < 18; i++) {
    const fx = 60 + rng() * 680;
    const fy = 60 + rng() * 680;
    const type = Math.floor(rng() * 3);

    if (type === 0) {
      // Daisy
      const n = 8 + Math.floor(rng() * 5);
      parts.push(flower(fx, fy, n, 25 + rng() * 20, 12 + rng() * 8, 8 + rng() * 5));
    } else if (type === 1) {
      // Tulip-like
      const a = -90 + rng() * 20 - 10;
      parts.push(path(petalPath(fx, fy, 0, a, 30 + rng() * 15, 22)));
      parts.push(path(petalPath(fx, fy, 0, a - 20, 25 + rng() * 10, 18)));
      parts.push(path(petalPath(fx, fy, 0, a + 20, 25 + rng() * 10, 18)));
    } else {
      // Bell-shaped
      const topY = fy - 20;
      parts.push(path(`M${fx - 15},${fy} Q${fx - 18},${topY} ${fx},${topY - 10} Q${fx + 18},${topY} ${fx + 15},${fy}`));
      parts.push(line(fx, fy, fx, fy + 5));
    }

    // Stems going down
    const stemLen = 50 + rng() * 80;
    const stemEndX = fx + (rng() - 0.5) * 30;
    parts.push(path(`M${fx},${fy + 8} Q${(fx + stemEndX) / 2 + 10},${fy + stemLen / 2} ${stemEndX},${fy + stemLen}`));

    // Occasional leaf
    if (rng() > 0.4) {
      const ly = fy + 20 + rng() * 30;
      const dir = rng() > 0.5 ? 1 : -1;
      parts.push(leaf(fx + dir * 3, ly, 20 + rng() * 15, 90 * dir + (rng() - 0.5) * 40, 10));
    }
  }

  // Butterflies
  for (let i = 0; i < 3; i++) {
    const bx = 100 + rng() * 600;
    const by = 80 + rng() * 300;
    // Wings
    parts.push(ellipse(bx - 12, by, 12, 8, -20));
    parts.push(ellipse(bx + 12, by, 12, 8, 20));
    parts.push(ellipse(bx - 8, by + 5, 8, 5, -15));
    parts.push(ellipse(bx + 8, by + 5, 8, 5, 15));
    // Body
    parts.push(line(bx, by - 8, bx, by + 12));
    // Antennae
    parts.push(path(`M${bx},${by - 8} Q${bx - 8},${by - 18} ${bx - 12},${by - 20}`));
    parts.push(path(`M${bx},${by - 8} Q${bx + 8},${by - 18} ${bx + 12},${by - 20}`));
  }

  return wrap(parts.join("\n"));
}

function floralTeaGarden() {
  const parts = [];

  // Chamomile cluster (top left)
  for (let i = 0; i < 4; i++) {
    const fx = 140 + i * 40 + (i % 2) * 20;
    const fy = 160 + (i % 2) * 50;
    parts.push(flower(fx, fy, 10, 25, 10, 10));
    parts.push(path(`M${fx},${fy + 10} Q${fx + 5},${fy + 50} ${fx - 5},${fy + 80}`));
  }

  // Lavender sprigs (right side)
  for (let i = 0; i < 5; i++) {
    const sx = 550 + i * 35;
    const baseY = 650;
    parts.push(path(`M${sx},${baseY} Q${sx + 3},${baseY - 100} ${sx - 2},${baseY - 200}`));
    // Tiny buds along stem
    for (let j = 0; j < 8; j++) {
      const by = baseY - 50 - j * 18;
      const bx = sx + (j % 2 === 0 ? -6 : 6);
      parts.push(ellipse(bx, by, 5, 3, j % 2 === 0 ? -20 : 20));
    }
  }

  // Mint leaves (bottom left)
  for (let i = 0; i < 6; i++) {
    const lx = 120 + (i % 3) * 70;
    const ly = 520 + Math.floor(i / 3) * 80;
    parts.push(leaf(lx, ly, 40, -60 + (i % 2) * 30, 22));
    // Vein pattern
    const rad = ((-60 + (i % 2) * 30) * Math.PI) / 180;
    for (let v = 0; v < 3; v++) {
      const vx = lx + (12 + v * 10) * Math.cos(rad);
      const vy = ly + (12 + v * 10) * Math.sin(rad);
      const perpRad = rad + Math.PI / 2;
      parts.push(line(vx, vy, vx + 8 * Math.cos(perpRad), vy + 8 * Math.sin(perpRad)));
      parts.push(line(vx, vy, vx - 8 * Math.cos(perpRad), vy - 8 * Math.sin(perpRad)));
    }
  }

  // Central teacup (simple)
  parts.push(path(`M320,340 Q310,420 340,460 L460,460 Q490,420 480,340 Z`));
  parts.push(path(`M480,370 Q520,370 520,400 Q520,430 480,430`)); // handle
  parts.push(path(`M310,460 Q400,480 490,460`)); // saucer
  // Steam
  parts.push(path(`M370,320 Q365,300 375,280 Q385,260 370,240`));
  parts.push(path(`M410,325 Q405,305 415,285 Q425,265 410,245`));

  // Scattered tea leaves
  const rng = seededRandom(33);
  for (let i = 0; i < 12; i++) {
    const x = 60 + rng() * 680;
    const y = 60 + rng() * 680;
    parts.push(leaf(x, y, 15 + rng() * 10, rng() * 360, 8));
  }

  // Decorative border - simple vine
  parts.push(path(`M20,20 Q400,40 780,20`));
  parts.push(path(`M20,780 Q400,760 780,780`));
  parts.push(path(`M20,20 Q40,400 20,780`));
  parts.push(path(`M780,20 Q760,400 780,780`));

  return wrap(parts.join("\n"));
}

// ── Geometric Generators ──

function geoStillWater() {
  const parts = [];

  // Concentric ripple rings from multiple centers
  const centers = [
    [C, C, 8],
    [200, 250, 5],
    [600, 300, 4],
    [300, 580, 4],
  ];
  centers.forEach(([cx, cy, n]) => {
    for (let i = 1; i <= n; i++) {
      parts.push(circle(cx, cy, i * 40));
    }
    parts.push(circle(cx, cy, 5)); // center dot
  });

  // Horizontal water lines
  for (let y = 50; y < SIZE; y += 60) {
    const amp = 8 + Math.sin(y * 0.02) * 5;
    let d = `M30,${y}`;
    for (let x = 30; x <= 770; x += 40) {
      d += ` Q${x + 20},${y + amp} ${x + 40},${y}`;
      amp > 0 ? -amp : amp;
    }
    parts.push(`<path d="${d}" opacity="0.3" />`);
  }

  return wrap(parts.join("\n"));
}

function geoSunrise() {
  const parts = [];

  // Radiating lines from bottom center (sunrise point)
  const sunX = C;
  const sunY = 650;

  for (let i = 0; i < 36; i++) {
    const a = -180 + (180 / 36) * i;
    const [ex, ey] = polarXY(sunX, sunY, 700, a);
    parts.push(line(sunX, sunY, ex, ey));
  }

  // Concentric arcs (half circles above horizon)
  [80, 160, 240, 320, 400, 500].forEach(r => {
    parts.push(`<path d="M${sunX - r},${sunY} A${r},${r} 0 0,1 ${sunX + r},${sunY}" />`);
  });

  // Horizon line
  parts.push(line(20, sunY, 780, sunY));

  // Geometric tessellation below horizon
  for (let row = 0; row < 3; row++) {
    const y = sunY + 20 + row * 40;
    for (let col = 0; col < 10; col++) {
      const x = 40 + col * 75;
      // Diamond
      parts.push(path(`M${x},${y} L${x + 37},${y + 20} L${x},${y + 40} L${x - 37},${y + 20} Z`));
    }
  }

  // Triangle patterns in sky
  for (let i = 0; i < 24; i++) {
    const a = -170 + (160 / 24) * i;
    const r1 = 200;
    const r2 = 280;
    const a2 = a + 160 / 24;
    const [x1, y1] = polarXY(sunX, sunY, r1, a);
    const [x2, y2] = polarXY(sunX, sunY, r2, a);
    const [x3, y3] = polarXY(sunX, sunY, r2, a2);
    parts.push(path(`M${x1},${y1} L${x2},${y2} L${x3},${y3} Z`));
  }

  // Sun semicircle
  parts.push(`<path d="M${sunX - 50},${sunY} A50,50 0 0,1 ${sunX + 50},${sunY}" />`);

  return wrap(parts.join("\n"));
}

function geoBlanketWeave() {
  const parts = [];
  const cellSize = 50;
  const margin = 25;

  // Interlocking weave pattern
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      const x = margin + col * cellSize;
      const y = margin + row * cellSize;

      if ((row + col) % 2 === 0) {
        // Horizontal band
        parts.push(`<rect x="${x}" y="${y + 15}" width="${cellSize}" height="${20}" rx="3" />`);
      } else {
        // Vertical band
        parts.push(`<rect x="${x + 15}" y="${y}" width="${20}" height="${cellSize}" rx="3" />`);
      }

      // Small diamond at intersections
      if (row > 0 && col > 0) {
        const ix = x;
        const iy = y;
        parts.push(path(`M${ix},${iy - 6} L${ix + 6},${iy} L${ix},${iy + 6} L${ix - 6},${iy} Z`));
      }
    }
  }

  // Border
  parts.push(`<rect x="15" y="15" width="770" height="770" rx="8" />`);
  parts.push(`<rect x="8" y="8" width="784" height="784" rx="12" />`);

  return wrap(parts.join("\n"));
}

// ── Nature Generators ──

function natureFerns() {
  const parts = [];

  // Generate fern fronds
  function fernFrond(startX, startY, length, baseAngle, leafCount) {
    const rad = (baseAngle * Math.PI) / 180;
    // Main stem
    const endX = startX + length * Math.cos(rad);
    const endY = startY + length * Math.sin(rad);
    const midX = (startX + endX) / 2 + 20 * Math.cos(rad + Math.PI / 2);
    const midY = (startY + endY) / 2 + 20 * Math.sin(rad + Math.PI / 2);
    parts.push(path(`M${startX},${startY} Q${midX},${midY} ${endX},${endY}`));

    // Leaflets along stem
    for (let i = 0; i < leafCount; i++) {
      const t = (i + 1) / (leafCount + 1);
      const px = startX + (endX - startX) * t + (midX - (startX + endX) / 2) * 4 * t * (1 - t);
      const py = startY + (endY - startY) * t + (midY - (startY + endY) / 2) * 4 * t * (1 - t);
      const leafLen = 15 + (1 - t) * 25;
      // Left leaflet
      parts.push(leaf(px, py, leafLen, baseAngle + 60, leafLen * 0.4));
      // Right leaflet
      parts.push(leaf(px, py, leafLen, baseAngle - 60, leafLen * 0.4));
    }
  }

  // Multiple fern fronds
  fernFrond(100, 750, 400, -80, 14);
  fernFrond(250, 780, 450, -75, 16);
  fernFrond(450, 760, 420, -85, 15);
  fernFrond(600, 770, 380, -95, 13);
  fernFrond(700, 750, 350, -100, 12);

  // Unfurling fiddleheads
  const fiddleheads = [[150, 350], [500, 300], [350, 250]];
  fiddleheads.forEach(([fx, fy]) => {
    // Spiral
    let d = `M${fx},${fy + 40}`;
    for (let a = 0; a < 540; a += 15) {
      const r = 20 - (a / 540) * 18;
      const rad = (a * Math.PI) / 180;
      const x = fx + r * Math.cos(rad);
      const y = fy + r * Math.sin(rad);
      d += ` L${x},${y}`;
    }
    parts.push(`<path d="${d}" />`);
    // Stem
    parts.push(path(`M${fx},${fy + 40} Q${fx + 5},${fy + 80} ${fx - 5},${fy + 120}`));
  });

  return wrap(parts.join("\n"));
}

function natureCloudDrift() {
  const parts = [];

  // Multiple cloud shapes - soft, overlapping circles
  function cloud(cx, cy, scale) {
    const s = scale;
    parts.push(circle(cx - 30 * s, cy, 35 * s));
    parts.push(circle(cx + 30 * s, cy, 30 * s));
    parts.push(circle(cx, cy - 15 * s, 40 * s));
    parts.push(circle(cx - 15 * s, cy + 10 * s, 25 * s));
    parts.push(circle(cx + 15 * s, cy + 10 * s, 28 * s));
    // Fill overlaps with white
    parts.push(`<ellipse cx="${cx}" cy="${cy + 5 * s}" rx="${50 * s}" ry="${25 * s}" fill="white" stroke="none" />`);
    // Re-draw bottom curve
    parts.push(`<path d="M${cx - 50 * s},${cy + 5 * s} Q${cx - 30 * s},${cy + 30 * s} ${cx},${cy + 28 * s} Q${cx + 30 * s},${cy + 30 * s} ${cx + 50 * s},${cy + 5 * s}" />`);
  }

  cloud(200, 150, 2.0);
  cloud(550, 120, 1.8);
  cloud(380, 250, 2.2);
  cloud(150, 350, 1.5);
  cloud(600, 320, 1.7);
  cloud(300, 430, 2.0);
  cloud(500, 480, 1.6);
  cloud(180, 550, 1.8);
  cloud(650, 540, 1.4);
  cloud(400, 620, 2.1);
  cloud(250, 700, 1.5);
  cloud(550, 680, 1.9);

  return wrap(parts.join("\n"));
}

function natureForestFloor() {
  const parts = [];
  const rng = seededRandom(88);

  // Mushrooms
  function mushroom(mx, my, capW, capH, stemW, stemH) {
    // Cap
    parts.push(`<path d="M${mx - capW},${my} Q${mx - capW},${my - capH * 1.5} ${mx},${my - capH} Q${mx + capW},${my - capH * 1.5} ${mx + capW},${my}" />`);
    // Cap underside line
    parts.push(line(mx - capW + 3, my, mx + capW - 3, my));
    // Dots on cap
    for (let i = 0; i < 3; i++) {
      const dx = mx - capW / 2 + (i * capW) / 2;
      const dy = my - capH * 0.6 - i % 2 * capH * 0.2;
      parts.push(circle(dx, dy, capW * 0.08));
    }
    // Stem
    parts.push(`<rect x="${mx - stemW / 2}" y="${my}" width="${stemW}" height="${stemH}" rx="${stemW * 0.3}" />`);
  }

  mushroom(200, 400, 50, 40, 20, 50);
  mushroom(500, 350, 60, 45, 22, 55);
  mushroom(350, 500, 40, 35, 16, 40);
  mushroom(620, 480, 35, 30, 14, 35);
  mushroom(150, 560, 45, 38, 18, 45);

  // Fallen leaves
  for (let i = 0; i < 15; i++) {
    const lx = 60 + rng() * 680;
    const ly = 550 + rng() * 180;
    const angle = rng() * 360;
    const len = 20 + rng() * 25;
    parts.push(leaf(lx, ly, len, angle, len * 0.5));
  }

  // Acorns
  for (let i = 0; i < 8; i++) {
    const ax = 80 + rng() * 640;
    const ay = 580 + rng() * 150;
    // Cap
    parts.push(`<path d="M${ax - 8},${ay} A8,6 0 0,1 ${ax + 8},${ay}" />`);
    // Body
    parts.push(`<path d="M${ax - 8},${ay} Q${ax - 10},${ay + 14} ${ax},${ay + 18} Q${ax + 10},${ay + 14} ${ax + 8},${ay}" />`);
    // Cap texture
    parts.push(line(ax - 4, ay - 2, ax - 4, ay + 1));
    parts.push(line(ax, ay - 3, ax, ay));
    parts.push(line(ax + 4, ay - 2, ax + 4, ay + 1));
  }

  // Ground texture - twigs
  for (let i = 0; i < 10; i++) {
    const tx = 40 + rng() * 720;
    const ty = 650 + rng() * 100;
    const ta = rng() * 60 - 30;
    const tl = 20 + rng() * 40;
    const rad = (ta * Math.PI) / 180;
    parts.push(line(tx, ty, tx + tl * Math.cos(rad), ty + tl * Math.sin(rad)));
  }

  // Tree trunk silhouettes at edges
  parts.push(path(`M30,0 Q50,200 40,400 Q30,500 45,800`));
  parts.push(path(`M60,0 Q75,250 65,500 Q55,600 70,800`));
  parts.push(path(`M740,0 Q720,300 735,600 Q745,700 730,800`));
  parts.push(path(`M770,0 Q755,250 765,500 Q775,650 760,800`));

  // Moss circles on ground
  for (let i = 0; i < 6; i++) {
    const mx = 100 + rng() * 600;
    const my = 620 + rng() * 120;
    parts.push(circle(mx, my, 6 + rng() * 8));
  }

  return wrap(parts.join("\n"));
}

// ── Generate All ──

const pages = [
  { slug: "lotus-meditation", gen: mandalaLotus },
  { slug: "morning-dew-roses", gen: floralRoses },
  { slug: "still-water-circles", gen: geoStillWater },
  { slug: "whispering-ferns", gen: natureFerns },
  { slug: "moonlit-garden", gen: floralMoonlit },
  { slug: "starfield-mandala", gen: mandalaStarfield },
  { slug: "cloud-drift", gen: natureCloudDrift },
  { slug: "sunrise-geometry", gen: geoSunrise },
  { slug: "wildflower-burst", gen: floralWildflower },
  { slug: "kaleidoscope-fire", gen: mandalaKaleidoscope },
  { slug: "warm-blanket-weave", gen: geoBlanketWeave },
  { slug: "tea-garden-botanicals", gen: floralTeaGarden },
  { slug: "nesting-circles", gen: mandalaNesting },
  { slug: "forest-floor", gen: natureForestFloor },
];

for (const p of pages) {
  const svg = p.gen();
  const file = join(OUT, `${p.slug}.svg`);
  writeFileSync(file, svg);
  console.log(`✓ ${p.slug}.svg`);
}
console.log(`\nDone! ${pages.length} SVGs generated in public/coloring/`);
