"use client";

import React, { useState, useRef, useEffect } from "react";
import Crosshair from "./Crosshair";

export default function InteractiveCrosshair() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Calculate rotation based on mouse position relative to the center of the element
      const rotY = ((mouseX - centerX) / (window.innerWidth / 2)) * 60;
      const rotX = -((mouseY - centerY) / (window.innerHeight / 2)) * 60;
      
      animationFrameId = requestAnimationFrame(() => {
        setRotation({ x: rotX, y: rotY });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative flex justify-center items-center w-24 h-24 mb-6 cursor-crosshair group animate-hero-rise-1"
      style={{ perspective: "1000px" }}
    >
      <div 
        className="relative flex justify-center items-center w-full h-full transition-transform duration-100 ease-out preserve-3d group-hover:scale-110"
        style={{ 
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: "preserve-3d"
        }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes rgb-shift {
            0% { filter: hue-rotate(0deg) drop-shadow(0 0 15px rgba(255,0,0,0.8)); color: #ff3366; }
            33% { filter: hue-rotate(120deg) drop-shadow(0 0 15px rgba(0,255,0,0.8)); color: #33ff66; }
            66% { filter: hue-rotate(240deg) drop-shadow(0 0 15px rgba(0,0,255,0.8)); color: #3366ff; }
            100% { filter: hue-rotate(360deg) drop-shadow(0 0 15px rgba(255,0,0,0.8)); color: #ff3366; }
          }
          .animate-rgb {
            animation: rgb-shift 3s linear infinite;
          }
        `}} />
        
        {/* Subtle translucent background instead of heavy glow */}
        <div 
          className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-sm transition-all duration-300"
          style={{ transform: "translateZ(-10px)" }}
        />
        
        {/* The Crosshair itself with RGB animation */}
        <div 
          className="transition-colors duration-300 animate-rgb"
          style={{ transform: "translateZ(40px)" }}
        >
          <Crosshair size={42} strokeWidth={2.5} />
        </div>
        
        {/* Front floating ring (Subtle white instead of RGB) */}
        <div 
          className="absolute rounded-full border border-white/10 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ transform: "translateZ(60px)" }}
        />
      </div>
    </div>
  );
}
