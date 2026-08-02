"use client";

import React, { useEffect, useState } from "react";

export default function CursorGlow() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const updatePosition = () => {
      // Lerp smoothing
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      setPosition({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed top-0 left-0 w-[450px] h-[450px] pointer-events-none z-30 transition-opacity duration-500 -translate-x-1/2 -translate-y-1/2"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        background: "radial-gradient(circle, rgba(167, 139, 250, 0.12) 0%, rgba(244, 114, 182, 0.05) 45%, rgba(0, 0, 0, 0) 70%)"
      }}
    />
  );
}
