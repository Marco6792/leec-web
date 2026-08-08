"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const FALLBACK_HERO_SUBTITLE =
  "Research in Engineering Sciences for the Local Community. Advancing African engineering through cutting-edge research, world-class facilities, and international collaboration.";

/**
 * Rotates through the admin-managed hero quotes with a clean crossfade +
 * gentle vertical drift. Falls back to a static subtitle when there are no
 * published quotes.
 */
export function HeroSubtitle({ quotes }: { quotes: string[] }) {
  const texts = quotes.length > 0 ? quotes : [FALLBACK_HERO_SUBTITLE];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (texts.length <= 1) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % texts.length),
      10000,
    );
    return () => clearInterval(timer);
  }, [texts.length]);

  // Keep a fixed band so the hero doesn't jump when quotes differ in length.
  return (
    <div className="flex h-52 sm:h-40 items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="text-lg sm:text-xl text-white/70 max-w-xl mx-auto leading-relaxed"
        >
          <span className="text-3xl sm:text-4xl font-serif leading-none mr-1 -mt-2 sm:-mt-3 text-white/50">"</span>
          {texts[index]}
          <span className="text-3xl sm:text-4xl font-serif leading-none ml-1 -mb-2 sm:-mb-3 text-white/50">"</span>
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
