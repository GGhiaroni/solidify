"use client";

import { cn } from "@/lib/utils";
import { Pause, Play, SkipForward } from "lucide-react";
import { useLofi } from "../context/LofiContext";

export default function LofiPlayer() {
  const { isPlaying, togglePlay, currentStation, nextStation } = useLofi();

  if (!currentStation && !isPlaying) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[50] animate-in slide-in-from-bottom-10 duration-700 group">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-[9px] font-black tracking-widest text-white px-2 py-0.5 rounded-full shadow-lg border border-blue-400/50 z-20 uppercase">
        Lofi Radio
      </div>

      <div className="relative bg-[#161b22]/90 backdrop-blur-xl border border-white/10 p-3 pr-5 rounded-2xl shadow-2xl flex items-center gap-4 hover:border-white/20 transition-all group-hover:scale-105">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 shadow-lg bg-black flex items-center justify-center">
          <div
            className={cn(
              "w-full h-full absolute inset-0 bg-gradient-to-tr from-zinc-800 to-zinc-900",
              isPlaying && "animate-spin [animation-duration:3s]"
            )}
          >
            <div className="absolute inset-[2px] rounded-full border border-white/5" />
            <div className="absolute inset-[8px] rounded-full border border-white/5" />
          </div>

          <div className="relative z-10 bg-blue-500/20 w-4 h-4 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
            <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-bold text-white max-w-[100px] truncate leading-tight">
            {currentStation?.name || "Chill Hop"}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={togglePlay}
              className="text-white/60 hover:text-white transition-colors"
            >
              {isPlaying ? (
                <Pause size={14} fill="currentColor" />
              ) : (
                <Play size={14} fill="currentColor" />
              )}
            </button>
            <button
              onClick={nextStation}
              className="text-white/60 hover:text-white transition-colors"
            >
              <SkipForward size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
