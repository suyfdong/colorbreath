"use client";

import { useEffect, useRef } from "react";

export default function FlashlightCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide on touch devices
    if ("ontouchstart" in window) return;

    // Force-hide native cursor via a persistent style tag with a 1x1 transparent PNG.
    // cursor:none is unreliable — browsers restore the default arrow after clicks/focus.
    // A transparent cursor image is rendered faithfully at all times.
    const transparentCursor = `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=") 0 0, none`;
    const style = document.createElement("style");
    style.id = "hide-native-cursor";
    style.textContent = `html, *, *::before, *::after { cursor: ${transparentCursor} !important; }`;
    document.head.appendChild(style);

    const onMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX - 100}px`;
        glowRef.current.style.top = `${e.clientY - 100}px`;
      }
    };

    const onLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
      if (glowRef.current) glowRef.current.style.opacity = "0";
    };
    const onEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
      if (glowRef.current) glowRef.current.style.opacity = "0.4";
    };

    // Re-enforce transparent cursor whenever the window regains focus
    const onFocus = () => {
      document.documentElement.style.cursor = transparentCursor;
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("focus", onFocus);
      style.remove();
    };
  }, []);

  return (
    <>
      {/* Soft glow around cursor */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed z-[9997] h-[200px] w-[200px] rounded-full opacity-40 mix-blend-soft-light"
        style={{
          top: -200,
          left: -200,
          background:
            "radial-gradient(circle, rgba(255,245,230,0.18) 0%, transparent 60%)",
        }}
      />

      {/* Cursor — chunky white arrow with 3D feel */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed z-[10000]"
        style={{ top: -100, left: -100 }}
      >
        <svg width="36" height="42" viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shadow layer for depth */}
          <path
            d="M5 3L5 33L12 26L19 38L23 36L16 24L25 22L5 3Z"
            fill="rgba(0,0,0,0.25)"
            transform="translate(2, 2)"
          />
          {/* Main arrow body */}
          <path
            d="M5 3L5 33L12 26L19 38L23 36L16 24L25 22L5 3Z"
            fill="white"
            stroke="rgba(60,55,50,0.5)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Highlight for 3D */}
          <path
            d="M5 3L5 30"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          {/* Subtle blush for cuteness */}
          <circle cx="11" cy="18" r="2.5" fill="rgba(201,168,124,0.2)" />
        </svg>
      </div>
    </>
  );
}
