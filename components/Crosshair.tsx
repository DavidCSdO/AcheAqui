"use client";

import React from "react";

interface CrosshairProps {
  className?: string;
  size?: number;
  spinning?: boolean;
  pulsing?: boolean;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

export default function Crosshair({
  className = "",
  size = 24,
  spinning = false,
  pulsing = false,
  strokeWidth = 1.5,
  style,
}: CrosshairProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${spinning ? "animate-slow-spin" : ""} ${pulsing ? "animate-pulse" : ""} ${className}`}
      style={style}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={strokeWidth} strokeOpacity="0.7" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth={strokeWidth * 0.8} strokeOpacity="0.45" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" fillOpacity="0.8" />
      <line x1="12" y1="1" x2="12" y2="5.5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="12" y1="18.5" x2="12" y2="23" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="1" y1="12" x2="5.5" y2="12" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="18.5" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}
