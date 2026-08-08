"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SiteImage } from "@/components/site-image";

/**
 * Slow cinematic Ken Burns effect: the hero image zooms in while panning
 * horizontally, so it feels like a subtle video — while remaining a
 * full-cover background. Respects prefers-reduced-motion.
 */
export function HeroBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute inset-0"
      initial={
        reduceMotion
          ? { scale: 1.12 }
          : {
              scale: 1.12,
              x: 0,
            }
      }
      animate={
        reduceMotion
          ? { scale: 1.12 }
          : {
              scale: [1.12, 1.28, 1.12],
              x: [0, -120, 0, 120, 0],
            }
      }
      transition={{
        duration: 36,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <SiteImage
        src="/hero_page_image.jpeg"
        alt="LEEC Research Poster"
        fill
        priority
        sizes="100vw"
        quality={90}
      />
    </motion.div>
  );
}
