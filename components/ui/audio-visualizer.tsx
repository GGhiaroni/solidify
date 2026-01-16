"use client";

import { cn } from "@/lib/utils";

export const AudioVisualizer = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <div className="flex items-center gap-1 h-8">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1.5 bg-blue-400 rounded-full transition-all duration-300",
            isPlaying ? "animate-music-bar" : "h-1.5 opacity-50"
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            height: isPlaying ? undefined : "4px",
          }}
        />
      ))}
    </div>
  );
};
