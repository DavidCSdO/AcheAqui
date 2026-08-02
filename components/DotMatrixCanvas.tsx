"use client";

import React, { useEffect, useRef } from "react";

export default function DotMatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    const gap = 26;
    const baseRadius = 1;
    let hoverX = -1000;
    let hoverY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      hoverX = e.clientX - rect.left;
      hoverY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      hoverX = -1000;
      hoverY = -1000;
    };

    const parent = canvas.parentElement;
    parent?.addEventListener("mousemove", handleMouseMove);
    parent?.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / gap);
      const rows = Math.ceil(height / gap);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gap + gap / 2;
          const y = j * gap + gap / 2;

          const dx = hoverX - x;
          const dy = hoverY - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const wave = Math.sin(time + (x + y) * 0.006) * 0.25 + 0.75;

          let radius = baseRadius * wave;
          let opacity = 0.12 * wave;
          let isAccent = false;

          if (dist < 130) {
            const factor = 1 - dist / 130;
            radius = baseRadius + factor * 2.2;
            opacity = 0.18 + factor * 0.7;
            if (dist < 45) isAccent = true;
          }

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);

          if (isAccent) {
            ctx.fillStyle = `rgba(167, 139, 250, ${opacity})`;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          }

          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      parent?.removeEventListener("mousemove", handleMouseMove);
      parent?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10">
      <canvas ref={canvasRef} className="w-full h-full block opacity-70" />
    </div>
  );
}
