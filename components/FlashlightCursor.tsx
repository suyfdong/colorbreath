"use client";

import { useEffect, useRef } from "react";

export default function FlashlightCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const trailPos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Hide on touch devices
    if ("ontouchstart" in window) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      target.current = { x: -200, y: -200 };
    };

    let raf: number;
    const animate = () => {
      // Fast follow for cursor
      pos.current.x += (target.current.x - pos.current.x) * 0.2;
      pos.current.y += (target.current.y - pos.current.y) * 0.2;
      // Slow follow for trail
      trailPos.current.x += (target.current.x - trailPos.current.x) * 0.08;
      trailPos.current.y += (target.current.y - trailPos.current.y) * 0.08;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${pos.current.x - 160}px, ${pos.current.y - 160}px)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trailPos.current.x}px, ${trailPos.current.y}px)`;
      }
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Flashlight glow */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] h-[320px] w-[320px] rounded-full opacity-50 mix-blend-soft-light will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(255,245,230,0.22) 0%, rgba(255,245,230,0.06) 40%, transparent 65%)",
        }}
      />

      {/* Trail — soft blob that follows slowly */}
      <div
        ref={trailRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
        style={{ marginLeft: "-10px", marginTop: "-10px" }}
      >
        <div className="h-5 w-5 rounded-full bg-accent-amber/15 blur-sm" />
      </div>

      {/* Cursor — cute little flower/sparkle */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[10000] will-change-transform"
        style={{ marginLeft: "-12px", marginTop: "-12px" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          {/* Petals */}
          <ellipse cx="12" cy="6" rx="2.5" ry="4.5" fill="rgba(226,201,162,0.5)" />
          <ellipse cx="12" cy="18" rx="2.5" ry="4.5" fill="rgba(226,201,162,0.5)" />
          <ellipse cx="6" cy="12" rx="4.5" ry="2.5" fill="rgba(226,201,162,0.5)" />
          <ellipse cx="18" cy="12" rx="4.5" ry="2.5" fill="rgba(226,201,162,0.5)" />
          {/* Diagonal petals */}
          <ellipse cx="7.8" cy="7.8" rx="2" ry="4" transform="rotate(45 7.8 7.8)" fill="rgba(181,167,200,0.35)" />
          <ellipse cx="16.2" cy="16.2" rx="2" ry="4" transform="rotate(45 16.2 16.2)" fill="rgba(181,167,200,0.35)" />
          <ellipse cx="16.2" cy="7.8" rx="2" ry="4" transform="rotate(-45 16.2 7.8)" fill="rgba(139,165,131,0.35)" />
          <ellipse cx="7.8" cy="16.2" rx="2" ry="4" transform="rotate(-45 7.8 16.2)" fill="rgba(139,165,131,0.35)" />
          {/* Center */}
          <circle cx="12" cy="12" r="2.5" fill="rgba(255,255,255,0.7)" />
          <circle cx="12" cy="12" r="1" fill="rgba(255,255,255,0.9)" />
        </svg>
      </div>
    </>
  );
}
