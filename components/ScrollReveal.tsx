"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Animation = "fade-up" | "fade-in" | "fade-left" | "fade-right" | "scale-up" | "blur-in";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

const animationStyles: Record<Animation, { from: string; to: string }> = {
  "fade-up": {
    from: "opacity: 0; transform: translateY(30px);",
    to: "opacity: 1; transform: translateY(0);",
  },
  "fade-in": {
    from: "opacity: 0;",
    to: "opacity: 1;",
  },
  "fade-left": {
    from: "opacity: 0; transform: translateX(-30px);",
    to: "opacity: 1; transform: translateX(0);",
  },
  "fade-right": {
    from: "opacity: 0; transform: translateX(30px);",
    to: "opacity: 1; transform: translateX(0);",
  },
  "scale-up": {
    from: "opacity: 0; transform: scale(0.9);",
    to: "opacity: 1; transform: scale(1);",
  },
  "blur-in": {
    from: "opacity: 0; filter: blur(8px);",
    to: "opacity: 1; filter: blur(0);",
  },
};

export default function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 900,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const style = animationStyles[animation];
    el.setAttribute("style", `${style.from} transition: all ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms;`);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("style", `${style.to} transition: all ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms;`);
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.setAttribute("style", `${style.from} transition: all ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms;`);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animation, delay, duration, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
