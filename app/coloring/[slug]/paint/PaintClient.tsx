"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { coloringPages, getColoringImage, getMoodAudio, getMoodVolume } from "@/data/coloringPages";
import AudioPlayer from "@/components/AudioPlayer";
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

  if (targetR < 30 && targetG < 30 && targetB < 30 && targetA > 200) return;
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
      if (matches(idx(ny, nx))) queue.push([nx, ny]);
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

/* ── Color palette ── */
const paletteColors = [
  // Row 1: warm
  "#F9E4E4", "#F4A0A0", "#E06060", "#C94040", "#8B2020",
  "#FEF0D5", "#F5C28A", "#E8A050", "#D4845A", "#8B5E3C",
  "#FFF8D6", "#F5E6A0", "#E8D060", "#D4B840", "#8B7A28",
  // Row 2: cool
  "#E0F0E0", "#A8D8A0", "#70B868", "#4A9848", "#2A6828",
  "#D8EAF8", "#A0C8E8", "#6098D0", "#4070B0", "#284880",
  "#EAD8F0", "#C8A8E0", "#9878C0", "#7050A0", "#482878",
  // Row 3: neutrals
  "#FFFFFF", "#E8E0D8", "#B0A898", "#787068", "#383028",
];

type Tool = "fill" | "brush";

const CANVAS_SIZE = 800;
const MAX_HISTORY = 30;

export default function PaintPage() {
  const { slug } = useParams<{ slug: string }>();
  const page = coloringPages.find((p) => p.slug === slug);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeColor, setActiveColor] = useState("#F4A0A0");
  const [tool, setTool] = useState<Tool>("fill");
  const [brushSize, setBrushSize] = useState(8);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [loaded, setLoaded] = useState(false);
  const [isPainting, setIsPainting] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showTips, setShowTips] = useState(true);

  // Set paint mode on html element — disables flashlight cursor and restores native cursor
  useEffect(() => {
    document.documentElement.setAttribute("data-paint-mode", "");
    // Clear any inline cursor style left by FlashlightCursor
    document.documentElement.style.cursor = "";
    return () => {
      document.documentElement.removeAttribute("data-paint-mode");
    };
  }, []);

  // Load coloring image onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Clear any old saved state

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
      pushHistory(ctx);
      setLoaded(true);
    };
    img.src = getColoringImage(slug);
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

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;
    return {
      x: Math.floor((e.clientX - rect.left) * scaleX),
      y: Math.floor((e.clientY - rect.top) * scaleY),
    };
  };

  const parseColor = (hex: string): [number, number, number] => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];

  const drawBrushDot = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = activeColor;
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleCanvasDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      const { x, y } = getCanvasPos(e);

      if (tool === "fill") {
        const [r, g, b] = parseColor(activeColor);
        floodFill(ctx, x, y, [r, g, b, 255]);
        pushHistory(ctx);
      } else {
        setIsPainting(true);
        drawBrushDot(ctx, x, y);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeColor, tool, brushSize, pushHistory, slug]
  );

  const handleCanvasMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isPainting || tool !== "brush") return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d")!;
      const { x, y } = getCanvasPos(e);

      ctx.fillStyle = activeColor;
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fill();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPainting, tool, activeColor, brushSize]
  );

  const handleCanvasUp = useCallback(() => {
    if (isPainting) {
      setIsPainting(false);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d")!;
        pushHistory(ctx);
      }
    }
  }, [isPainting, pushHistory, slug]);

  const undo = useCallback(() => {
    if (historyIdx <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const newIdx = historyIdx - 1;
    ctx.putImageData(history[newIdx], 0, 0);
    setHistoryIdx(newIdx);

  }, [history, historyIdx, slug]);

  const redo = useCallback(() => {
    if (historyIdx >= history.length - 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const newIdx = historyIdx + 1;
    ctx.putImageData(history[newIdx], 0, 0);
    setHistoryIdx(newIdx);

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
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
      pushHistory(ctx);
      };
    img.src = getColoringImage(slug);
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
    <div className="fixed inset-0 flex bg-bg-deep">
      {/* ── Left sidebar: tools ── */}
      <aside className="flex w-56 flex-shrink-0 flex-col border-r border-bg-surface/50 bg-bg-primary/80 md:w-64">
        {/* Back + title */}
        <div className="border-b border-bg-surface/50 px-4 py-3">
          <Link
            href={`/coloring/${slug}`}
            className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back
          </Link>
          {page && (
            <p className="mt-2 font-[family-name:var(--font-heading)] text-sm text-text-primary">
              {page.title}
            </p>
          )}
        </div>

        {/* Tool selection */}
        <div className="border-b border-bg-surface/50 px-4 py-4">
          <p className="mb-3 text-[10px] font-medium tracking-[0.15em] text-text-muted uppercase">Tool</p>
          <div className="flex gap-2">
            <button
              onClick={() => setTool("fill")}
              className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${
                tool === "fill"
                  ? "bg-accent-amber/20 text-accent-amber"
                  : "text-text-secondary hover:bg-bg-surface hover:text-text-primary"
              }`}
            >
              {/* Fill bucket icon */}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
              </svg>
              Fill
            </button>
            <button
              onClick={() => setTool("brush")}
              className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${
                tool === "brush"
                  ? "bg-accent-amber/20 text-accent-amber"
                  : "text-text-secondary hover:bg-bg-surface hover:text-text-primary"
              }`}
            >
              {/* Brush icon */}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
              Brush
            </button>
          </div>
        </div>

        {/* Brush size (only shown for brush tool) */}
        {tool === "brush" && (
          <div className="border-b border-bg-surface/50 px-4 py-4">
            <p className="mb-3 text-[10px] font-medium tracking-[0.15em] text-text-muted uppercase">
              Brush size: {brushSize}px
            </p>
            <input
              type="range"
              min={2}
              max={30}
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full cursor-pointer accent-accent-amber"
            />
            <div className="mt-2 flex items-center justify-center">
              <div
                className="rounded-full"
                style={{
                  width: brushSize * 2,
                  height: brushSize * 2,
                  backgroundColor: activeColor,
                }}
              />
            </div>
          </div>
        )}

        {/* Color palette */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <p className="mb-3 text-[10px] font-medium tracking-[0.15em] text-text-muted uppercase">Colors</p>

          {/* Current color preview */}
          <div className="mb-4 flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-lg border border-bg-surface shadow-inner"
              style={{ backgroundColor: activeColor }}
            />
            <span className="text-xs text-text-muted">{activeColor}</span>
            <label className="relative ml-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-dashed border-text-muted/40 transition-colors hover:border-text-secondary">
              <input
                type="color"
                value={activeColor}
                onChange={(e) => setActiveColor(e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <svg className="h-3 w-3 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l1.5 1.5.75-.75V8.758l2.276-.61a3 3 0 1 0-3.675-3.675l-.61 2.277H12l-.75.75 1.5 1.5M15 11.25l-8.47 8.47c-.34.34-.8.53-1.28.53H3.75v-1.5c0-.48.19-.94.53-1.28l8.47-8.47M15 11.25l1.5 1.5" />
              </svg>
            </label>
          </div>

          {/* Color grid */}
          <div className="grid grid-cols-5 gap-1.5">
            {paletteColors.map((color) => (
              <button
                key={color}
                onClick={() => setActiveColor(color)}
                className="cursor-pointer rounded-md transition-all duration-150"
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  backgroundColor: color,
                  outline:
                    activeColor === color
                      ? "2px solid #c9a87c"
                      : color === "#FFFFFF"
                        ? "1px solid rgba(107,99,91,0.3)"
                        : "none",
                  outlineOffset: activeColor === color ? "1px" : "0px",
                  transform: activeColor === color ? "scale(1.1)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Audio player */}
        {page && (
          <div className="border-t border-bg-surface/50 px-4 py-3">
            <AudioPlayer
              src={getMoodAudio(page.mood)}
              title={page.audioTitle}
              duration={page.audioDuration}
              defaultVolume={getMoodVolume(page.mood)}
              bars={24}
              barHeight={24}
              compact
            />
          </div>
        )}

        {/* Actions at bottom */}
        <div className="border-t border-bg-surface/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <button
                onClick={undo}
                disabled={historyIdx <= 0}
                className="cursor-pointer rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-surface hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-30"
                title="Undo (⌘Z)"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
              </button>
              <button
                onClick={redo}
                disabled={historyIdx >= history.length - 1}
                className="cursor-pointer rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-surface hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-30"
                title="Redo (⌘⇧Z)"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
                </svg>
              </button>
            </div>
            <div className="flex gap-1">
              <button
                onClick={resetCanvas}
                className="cursor-pointer rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-surface hover:text-text-primary"
                title="Reset"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                </svg>
              </button>
              <button
                onClick={exportPng}
                className="cursor-pointer rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-surface hover:text-text-primary"
                title="Export PNG (⌘S)"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main canvas area ── */}
      <main className="relative flex flex-1 items-center justify-center overflow-auto p-6">
        {!loaded && (
          <p className="absolute text-sm font-light text-text-muted">Loading...</p>
        )}

        {/* Help tips — bottom left, shown by default */}
        <div className="absolute left-4 bottom-4 z-20">
          {showTips ? (
            <div className="w-56 rounded-xl bg-bg-deep/90 px-5 py-4 shadow-xl backdrop-blur-sm">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-medium text-text-primary">How to color</p>
                <button
                  onClick={() => setShowTips(false)}
                  className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors hover:bg-bg-surface hover:text-text-primary"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col gap-1.5 text-[11px] font-light text-text-secondary">
                <p>1. Pick a color from the palette</p>
                <p>2. Tap a white area to fill it</p>
                <p>3. Switch to Brush for freehand</p>
                <p>4. Use + / − to zoom into details</p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowTips(true)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-bg-primary/80 text-text-secondary backdrop-blur-sm transition-colors hover:bg-bg-surface hover:text-text-primary"
              title="Help"
            >
              <span className="text-sm font-medium">?</span>
            </button>
          )}
        </div>

        {/* Zoom controls */}
        <div className="absolute right-4 top-4 z-10 flex flex-col gap-1">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.5, 3))}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-bg-primary/80 text-text-secondary backdrop-blur-sm transition-colors hover:bg-bg-surface hover:text-text-primary"
            title="Zoom in"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
          <span className="text-center text-[10px] text-text-muted">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.5, 1))}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-bg-primary/80 text-text-secondary backdrop-blur-sm transition-colors hover:bg-bg-surface hover:text-text-primary"
            title="Zoom out"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
            </svg>
          </button>
        </div>

        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onMouseDown={handleCanvasDown}
          onMouseMove={handleCanvasMove}
          onMouseUp={handleCanvasUp}
          onMouseLeave={handleCanvasUp}
          className="rounded-lg shadow-2xl shadow-black/40"
          style={{
            maxHeight: zoom === 1 ? "100%" : "none",
            maxWidth: zoom === 1 ? "100%" : "none",
            height: zoom > 1 ? `${zoom * 100}%` : undefined,
            aspectRatio: "1/1",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.5s ease",
            imageRendering: "auto",
            cursor: "crosshair",
          }}
        />
      </main>
    </div>
  );
}
