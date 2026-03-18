"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { coloringPages, moodMeta } from "@/data/coloringPages";
import { useParams } from "next/navigation";

/* ── Flood fill (BFS, tolerance-based for anti-aliased edges) ── */
function floodFill(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  fillColor: [number, number, number, number],
  tolerance = 40
) {
  const { width, height } = ctx.canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const idx = (y: number, x: number) => (y * width + x) * 4;

  const si = idx(startY, startX);
  const targetR = data[si];
  const targetG = data[si + 1];
  const targetB = data[si + 2];
  const targetA = data[si + 3];

  // Don't fill if clicking on a very dark line (stroke)
  if (targetR < 30 && targetG < 30 && targetB < 30 && targetA > 200) return;

  // Don't fill if already the same color
  if (
    Math.abs(targetR - fillColor[0]) < 5 &&
    Math.abs(targetG - fillColor[1]) < 5 &&
    Math.abs(targetB - fillColor[2]) < 5
  )
    return;

  const matches = (i: number) =>
    Math.abs(data[i] - targetR) <= tolerance &&
    Math.abs(data[i + 1] - targetG) <= tolerance &&
    Math.abs(data[i + 2] - targetB) <= tolerance &&
    Math.abs(data[i + 3] - targetA) <= tolerance;

  const visited = new Uint8Array(width * height);
  const queue: [number, number][] = [[startX, startY]];
  visited[startY * width + startX] = 1;

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    const i = idx(y, x);

    data[i] = fillColor[0];
    data[i + 1] = fillColor[1];
    data[i + 2] = fillColor[2];
    data[i + 3] = fillColor[3];

    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
      const ni = ny * width + nx;
      if (visited[ni]) continue;
      visited[ni] = 1;
      if (matches(idx(ny, nx))) {
        queue.push([nx, ny]);
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

/* ── Preset palettes per mood ── */
const palettes: Record<string, string[]> = {
  calm: ["#E8D5F0", "#C4A8D8", "#B5A7C8", "#9B8FBB", "#D4C5E2", "#F2E6F7", "#A893C2", "#8B7AAD"],
  sleep: ["#B8C8E8", "#8BA4D0", "#7E8DB5", "#6B7DA8", "#A0B4D8", "#C5D3ED", "#5E6F99", "#D8E2F3"],
  energy: ["#F5DEB3", "#E8C98A", "#C9A87C", "#D4B896", "#F0D4A0", "#FFE8C2", "#B89665", "#E0C090"],
  comfort: ["#B5D4A8", "#94C485", "#8BA583", "#7DB06E", "#A3C898", "#C8E0BE", "#6EA360", "#D0E8C5"],
};

const CANVAS_SIZE = 800;
const MAX_HISTORY = 30;

export default function PaintPage() {
  const { slug } = useParams<{ slug: string }>();
  const page = coloringPages.find((p) => p.slug === slug);
  const mood = page ? moodMeta[page.mood] : moodMeta.calm;
  const colors = page ? palettes[page.mood] : palettes.calm;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeColor, setActiveColor] = useState(colors[0]);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [loaded, setLoaded] = useState(false);

  // Load mandala SVG onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // White background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw the mandala SVG
    const svgStr = buildMandalaSvg();
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
      URL.revokeObjectURL(url);

      // Try restore from localStorage
      const saved = localStorage.getItem(`colorbreath-paint-${slug}`);
      if (saved) {
        const restoreImg = new Image();
        restoreImg.onload = () => {
          ctx.drawImage(restoreImg, 0, 0);
          pushHistory(ctx);
          setLoaded(true);
        };
        restoreImg.src = saved;
      } else {
        pushHistory(ctx);
        setLoaded(true);
      }
    };
    img.src = url;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const pushHistory = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const data = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      setHistory((prev) => {
        const next = prev.slice(0, historyIdx + 1);
        next.push(data);
        if (next.length > MAX_HISTORY) next.shift();
        return next;
      });
      setHistoryIdx((prev) => Math.min(prev + 1, MAX_HISTORY - 1));
    },
    [historyIdx]
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_SIZE / rect.width;
      const scaleY = CANVAS_SIZE / rect.height;
      const x = Math.floor((e.clientX - rect.left) * scaleX);
      const y = Math.floor((e.clientY - rect.top) * scaleY);

      // Parse hex to RGBA
      const r = parseInt(activeColor.slice(1, 3), 16);
      const g = parseInt(activeColor.slice(3, 5), 16);
      const b = parseInt(activeColor.slice(5, 7), 16);

      floodFill(ctx, x, y, [r, g, b, 255]);
      pushHistory(ctx);

      // Auto-save
      localStorage.setItem(`colorbreath-paint-${slug}`, canvas.toDataURL());
    },
    [activeColor, pushHistory, slug]
  );

  const undo = useCallback(() => {
    if (historyIdx <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const newIdx = historyIdx - 1;
    ctx.putImageData(history[newIdx], 0, 0);
    setHistoryIdx(newIdx);
    localStorage.setItem(`colorbreath-paint-${slug}`, canvas.toDataURL());
  }, [history, historyIdx, slug]);

  const redo = useCallback(() => {
    if (historyIdx >= history.length - 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const newIdx = historyIdx + 1;
    ctx.putImageData(history[newIdx], 0, 0);
    setHistoryIdx(newIdx);
    localStorage.setItem(`colorbreath-paint-${slug}`, canvas.toDataURL());
  }, [history, historyIdx, slug]);

  const exportPng = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `colorbreath-${slug}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [slug]);

  const resetCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const svgStr = buildMandalaSvg();
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
      URL.revokeObjectURL(url);
      pushHistory(ctx);
      localStorage.removeItem(`colorbreath-paint-${slug}`);
    };
    img.src = url;
  }, [pushHistory, slug]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        exportPng();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, exportPng]);

  return (
    <div className="fixed inset-0 flex flex-col bg-bg-deep" style={{ cursor: "crosshair" }}>
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-bg-surface/50 px-4 py-3 md:px-6">
        <div className="flex items-center gap-4">
          <Link
            href={`/coloring/${slug}`}
            className="flex items-center gap-2 text-sm font-light text-text-secondary transition-colors hover:text-text-primary"
            style={{ cursor: "pointer" }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back
          </Link>
          {page && (
            <span className="hidden font-[family-name:var(--font-heading)] text-base text-text-primary md:block">
              {page.title}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={historyIdx <= 0}
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-surface hover:text-text-primary disabled:opacity-30"
            title="Undo (⌘Z)"
            style={{ cursor: historyIdx <= 0 ? "not-allowed" : "pointer" }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
          </button>
          <button
            onClick={redo}
            disabled={historyIdx >= history.length - 1}
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-surface hover:text-text-primary disabled:opacity-30"
            title="Redo (⌘⇧Z)"
            style={{ cursor: historyIdx >= history.length - 1 ? "not-allowed" : "pointer" }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
            </svg>
          </button>
          <div className="mx-1 h-5 w-px bg-bg-surface" />
          <button
            onClick={resetCanvas}
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-surface hover:text-text-primary"
            title="Reset"
            style={{ cursor: "pointer" }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
            </svg>
          </button>
          <button
            onClick={exportPng}
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-surface hover:text-text-primary"
            title="Export PNG (⌘S)"
            style={{ cursor: "pointer" }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </button>
        </div>
      </header>

      {/* Canvas area */}
      <div className="flex flex-1 items-center justify-center overflow-hidden p-4">
        {!loaded && (
          <p className="absolute text-sm font-light text-text-muted animate-fade-in">
            Loading...
          </p>
        )}
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onClick={handleCanvasClick}
          className="max-h-full max-w-full rounded-lg shadow-2xl shadow-black/40"
          style={{
            aspectRatio: "1/1",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.5s ease",
            imageRendering: "auto",
          }}
        />
      </div>

      {/* Bottom palette bar */}
      <footer className="border-t border-bg-surface/50 px-4 py-3 md:px-6">
        <div className="flex items-center justify-center gap-2 md:gap-3">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setActiveColor(color)}
              className="relative rounded-full transition-transform duration-300"
              style={{
                width: activeColor === color ? 36 : 28,
                height: activeColor === color ? 36 : 28,
                backgroundColor: color,
                boxShadow:
                  activeColor === color
                    ? `0 0 0 2px ${mood.color}, 0 0 16px ${color}60`
                    : "none",
                transform: activeColor === color ? "scale(1.1)" : "scale(1)",
                cursor: "pointer",
              }}
              title={color}
            />
          ))}

          {/* Custom color picker */}
          <div className="ml-2 flex items-center">
            <label
              className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-text-muted/40"
              style={{ cursor: "pointer" }}
            >
              <input
                type="color"
                value={activeColor}
                onChange={(e) => setActiveColor(e.target.value)}
                className="absolute inset-0 h-full w-full opacity-0"
                style={{ cursor: "pointer" }}
              />
              <svg className="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l1.5 1.5.75-.75V8.758l2.276-.61a3 3 0 1 0-3.675-3.675l-.61 2.277H12l-.75.75 1.5 1.5M15 11.25l-8.47 8.47c-.34.34-.8.53-1.28.53H3.75v-1.5c0-.48.19-.94.53-1.28l8.47-8.47M15 11.25l1.5 1.5" />
              </svg>
            </label>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Generate mandala SVG string (matches MandalaSvg component) ── */
function buildMandalaSvg(): string {
  const layers = [
    { r: 140, count: 12, petalW: 18, petalH: 55 },
    { r: 95, count: 8, petalW: 14, petalH: 40 },
    { r: 55, count: 6, petalW: 10, petalH: 28 },
  ];

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="800" height="800" fill="none" stroke="black" stroke-width="1.5">`;

  // Outer circles
  svg += `<circle cx="200" cy="200" r="185" opacity="0.6"/>`;
  svg += `<circle cx="200" cy="200" r="170" opacity="0.5"/>`;

  // Petal layers
  for (let li = 0; li < layers.length; li++) {
    const layer = layers[li];
    for (let i = 0; i < layer.count; i++) {
      const angle = (360 / layer.count) * i;
      const cy = 200 - layer.r + layer.petalH / 2;
      svg += `<ellipse cx="200" cy="${cy}" rx="${layer.petalW / 2}" ry="${layer.petalH / 2}" transform="rotate(${angle} 200 200)" opacity="${0.7 - li * 0.1}"/>`;
    }
  }

  // Guide circles
  svg += `<circle cx="200" cy="200" r="140" opacity="0.3"/>`;
  svg += `<circle cx="200" cy="200" r="95" opacity="0.3"/>`;
  svg += `<circle cx="200" cy="200" r="55" opacity="0.3"/>`;
  svg += `<circle cx="200" cy="200" r="25" opacity="0.5"/>`;

  // Rays
  for (let i = 0; i < 12; i++) {
    const angle = (360 / 12) * i;
    svg += `<line x1="200" y1="200" x2="200" y2="180" transform="rotate(${angle} 200 200)" opacity="0.4"/>`;
  }

  // Center
  svg += `<circle cx="200" cy="200" r="3" fill="black" stroke="none" opacity="0.6"/>`;
  svg += `</svg>`;

  return svg;
}
