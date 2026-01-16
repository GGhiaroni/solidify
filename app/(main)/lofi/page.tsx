"use client";

import { useLofi } from "@/app/context/LofiContext";
import { cn } from "@/lib/utils";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import Image from "next/image";

export default function LofiPage() {
  const {
    isPlaying,
    togglePlay,
    currentStation,
    nextStation,
    prevStation,
    volume,
    setVolume,
  } = useLofi();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value) / 100;
    setVolume(newValue);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#0F1117] p-8">
      <div className="w-full max-w-md flex flex-col gap-8 animate-in fade-in duration-500">
        <div className="w-full aspect-square relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-zinc-900">
          <Image
            src="/lofi.png"
            alt="Capa Lofi"
            fill
            className={cn(
              "object-cover transition-all duration-700",
              !isPlaying && "grayscale opacity-80"
            )}
            priority
            unoptimized
          />
        </div>

        <div className="flex flex-col items-start gap-1">
          <h1 className="text-3xl font-bold text-white leading-tight">
            {currentStation?.name || "Lofi Station"}
          </h1>
          <p className="text-blue-400 font-medium tracking-wide text-sm uppercase">
            Solidify Radio
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full w-1/3 bg-blue-500 rounded-full",
                isPlaying && "animate-pulse"
              )}
            />
          </div>

          <div className="flex items-center justify-center gap-8">
            <button
              onClick={prevStation}
              className="text-neutral-400 hover:text-white transition-colors hover:scale-110 active:scale-95"
            >
              <SkipBack size={32} />
            </button>

            <button
              onClick={togglePlay}
              className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10"
            >
              {isPlaying ? (
                <Pause size={28} fill="currentColor" />
              ) : (
                <Play size={28} fill="currentColor" className="ml-1" />
              )}
            </button>

            <button
              onClick={nextStation}
              className="text-neutral-400 hover:text-white transition-colors hover:scale-110 active:scale-95"
            >
              <SkipForward size={32} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
          <button
            onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
            className="text-neutral-400 hover:text-white"
          >
            {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={handleVolumeChange}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
