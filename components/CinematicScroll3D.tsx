"use client";

import React, { useEffect } from "react";

export default function CinematicScroll3D({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1. Dynamic anime.js load for stagger animations
    const initAnime = async () => {
      try {
        const animeModule = await import("animejs");
        const anime = (animeModule as any).default || animeModule;
        if (typeof anime === "function") {
          anime({
            targets: ".cinematic-tilt-card",
            translateY: [40, 0],
            opacity: [0, 1],
            delay: anime.stagger ? anime.stagger(120, { start: 200 }) : 200,
            duration: 900,
            easing: "cubicBezier(0.16, 1, 0.3, 1)"
          });
        }
      } catch (e) {
        // Fallback gracefully if animejs is module-variant
      }
    };

    initAnime();

    // 2. Mouse 3D Tilt interaction for all element cards with .cinematic-tilt
    const cards = document.querySelectorAll<HTMLElement>(".cinematic-tilt");

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8; // Max 8deg tilt
      const rotateY = ((x - centerX) / centerX) * 8;

      target.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      target.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    };

    cards.forEach((card) => {
      card.addEventListener("mousemove", handleMouseMove as EventListener);
      card.addEventListener("mouseleave", handleMouseLeave as EventListener);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mousemove", handleMouseMove as EventListener);
        card.removeEventListener("mouseleave", handleMouseLeave as EventListener);
      });
    };
  }, []);

  return <>{children}</>;
}
