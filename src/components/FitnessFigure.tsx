"use client";

import React from "react";

export type FitnessActivity = 
  | "running" 
  | "walking" 
  | "cycling" 
  | "yoga" 
  | "pilates"
  | "strength" 
  | "hiit" 
  | "swimming" 
  | "dance" 
  | "football"
  | "lifting"
  | "rest"
  | "healthy"
  | "warning"
  | "at-risk";

interface FitnessFigureProps {
  type: string | FitnessActivity;
  size?: number;
  className?: string;
}

const EMOJI_MAP: Record<string, string> = {
  cycling: "1F6B4",
  running: "1F3C3",
  walking: "1F6B6",
  yoga: "1F9D8",
  pilates: "1F938",
  strength: "1F4AA",
  hiit: "1F4A5",
  swimming: "1F3CA",
  dance: "1F483",
  football: "26BD",
  lifting: "1F3CB",
  rest: "1F4A4",
  healthy: "1F49A",
  warning: "26A0",
  "at-risk": "1F6A8",
  default: "1F4AA"
};

export function FitnessFigure({ type, size = 20, className = "" }: FitnessFigureProps) {
  const normalizedType = type.toLowerCase();
  const hex = EMOJI_MAP[normalizedType] || EMOJI_MAP.default;
  
  // Using Twemoji set from svgmoji CDN for a premium emoji look
  const src = `https://cdn.jsdelivr.net/npm/@svgmoji/twemoji@2.0.0/svg/${hex.toUpperCase()}.svg`;

  return (
    <img 
      src={src} 
      alt={type}
      width={size}
      height={size}
      className={`${className} shrink-0`}
      style={{ 
        display: 'inline-block', 
        verticalAlign: 'middle',
        objectFit: 'contain'
      }}
    />
  );
}
