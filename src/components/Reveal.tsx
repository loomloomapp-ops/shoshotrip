"use client";

import type { ElementType, ReactNode } from "react";
import { useReveal } from "@/lib/hooks";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  delay?: number; // seconds
  scale?: boolean;
  className?: string;
}

/** Scroll-triggered fade/slide-up wrapper (Webflow-style IX reveal). */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  scale = false,
  className = "",
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLElement>();
  return (
    <Tag
      ref={ref}
      className={`reveal${scale ? " reveal--scale" : ""}${visible ? " is-visible" : ""} ${className}`}
      style={{ ["--reveal-delay" as string]: `${delay}s` }}
    >
      {children}
    </Tag>
  );
}
