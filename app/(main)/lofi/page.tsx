"use client";

import { useLofi } from "@/app/context/LofiContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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
    <div className="h-full w-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-20">
        <Image
          src="/lofi-city.jpg"
          alt="Lofi City Background"
          fill
          className="object-cover blur-md md:blur-xl scale-105 opacity-60"
          priority
          unoptimized
        />

        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-overlay" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center w-full max-w-4xl relative z-10"
      >
        <div className="relative w-full aspect-video md:h-[450px] rounded-[2rem] shadow-2xl overflow-hidden border border-white/10 bg-zinc-900/80 group backdrop-blur-sm">
          <Image
            src="/lofi.png"
            alt="Lofi Vibes"
            fill
            className={cn(
              "object-cover transition-all duration-1000",
              !isPlaying && "grayscale-[30%] scale-105 blur-[2px]"
            )}
            priority
            unoptimized
          />

          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
        </div>

        <div className="-mt-20 w-[95%] md:w-[700px] h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-between px-6 md:px-10 relative z-20 transition-all hover:bg-white/15">
          <button
            onClick={togglePlay}
            className={cn(
              "w-16 h-16 flex-shrink-0 rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95 border border-white/10",
              isPlaying
                ? "bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.5)]"
                : "bg-white/10 text-white hover:bg-white/20"
            )}
          >
            {isPlaying ? (
              <Pause size={28} fill="currentColor" />
            ) : (
              <Play size={28} fill="currentColor" className="ml-1" />
            )}
          </button>

          <div className="flex items-center gap-6 md:gap-8 flex-1 justify-center px-4">
            <button
              onClick={prevStation}
              className="text-white/80 hover:text-white transition-all hover:scale-110 active:scale-95"
            >
              <SkipBack size={28} />
            </button>

            <div className="hidden sm:block w-full max-w-[200px] h-1.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
              <div
                className={cn(
                  "h-full w-1/2 bg-gradient-to-r from-blue-400 via-purple-400 to-white rounded-full blur-[0.5px]",
                  isPlaying ? "animate-pulse" : "opacity-30 w-full grayscale"
                )}
              />
            </div>

            <button
              onClick={nextStation}
              className="text-white/80 hover:text-white transition-all hover:scale-110 active:scale-95"
            >
              <SkipForward size={28} />
            </button>
          </div>

          <div className="flex items-center gap-3 group/vol">
            <button
              onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
              className="text-white/80 hover:text-white transition-colors"
            >
              {volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
            </button>

            <div className="w-16 md:w-24">
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={handleVolumeChange}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 text-center space-y-2 animate-in slide-in-from-bottom-4 duration-1000 delay-100 relative z-20">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight drop-shadow-2xl">
            {currentStation?.name || "Chillhop Raccoon"}
          </h1>
          <p className="text-lg text-blue-200/80 font-medium tracking-wide drop-shadow-md">
            Frequências para foco profundo e relaxamento.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
