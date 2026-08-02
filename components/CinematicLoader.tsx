"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function CinematicLoader({ onComplete }: { onComplete?: () => void }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Show logo for 1.4 seconds with smooth pulse, then fade out
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsMounted(false);
        if (onComplete) onComplete();
      }, 900);
    }, 1400);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#080711] flex items-center justify-center select-none overflow-hidden transition-all duration-900 ease-in-out ${
        isFadingOut ? "opacity-0 scale-110 pointer-events-none filter blur-xl" : "opacity-100 scale-100"
      }`}
    >
      {/* Cinematic Soft Ambient Backdrop Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-gradient-to-r from-violet-600/25 via-pink-500/20 to-blue-500/25 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      {/* Central Pristine Logo Display */}
      <div className="relative flex items-center justify-center">
        {/* Soft Radial Ambient Ring */}
        <div className="absolute w-44 h-44 rounded-full bg-violet-500/20 blur-2xl animate-pulse" />

        {/* Logo Card Glass Container */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-white/[0.07] backdrop-blur-2xl border border-white/20 p-5 shadow-[0_0_60px_rgba(167,139,250,0.35)] flex items-center justify-center animate-float">
          <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-[0_0_20px_rgba(167,139,250,0.8)]">
            <Image
              src="/images/iconsf.png"
              alt="AcheAqui Logo"
              width={100}
              height={100}
              className="object-contain transition-transform duration-700 hover:scale-110"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
