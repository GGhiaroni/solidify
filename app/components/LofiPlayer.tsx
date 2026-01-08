"use client";

import { Button } from "@/components/ui/button";
import { stations } from "@/lib/lofi-stations";
import { cn } from "@/lib/utils";
import {
  Pause,
  Play,
  Radio,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLofi } from "../context/LofiContext";

export default function LofiPlayer() {
  const {
    isPlaying,
    volume,
    currentStation,
    togglePlay,
    setVolume,
    changeStation,
  } = useLofi();

  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setError(false);
          })
          .catch((err) => {
            console.error("Erro no áudio:", err);
          });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentStation]);

  const handleNextStation = () => {
    const currentIndex = stations.findIndex((s) => s.id === currentStation.id);
    const nextIndex = (currentIndex + 1) % stations.length;
    changeStation(stations[nextIndex].id);
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 left-6 z-[50] transition-all duration-500 ease-in-out",
        isExpanded ? "w-[300px]" : "w-[60px]"
      )}
    >
      {/* TAG DE ÁUDIO INVISÍVEL
        O 'src' precisa vir do arquivo lofi-stations.ts atualizado.
      */}
      <audio
        ref={audioRef}
        src={currentStation.streamUrl}
        preload="auto"
        onEnded={handleNextStation}
        onError={() => setError(true)}
      />

      <div className="bg-[#161b22]/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
        {/* CABEÇALHO */}
        <div
          className="h-[60px] flex items-center p-3 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Ícone */}
          <div
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-700",
              isPlaying ? "animate-spin-slow" : "",
              currentStation.color
            )}
          >
            <Radio
              size={16}
              className={cn("text-white", error && "text-red-500")}
            />
          </div>

          {/* Texto */}
          <div
            className={cn(
              "ml-3 flex flex-col overflow-hidden transition-all duration-300",
              isExpanded ? "opacity-100 w-full" : "opacity-0 w-0"
            )}
          >
            <span className="text-sm font-bold text-white truncate">
              {currentStation.name}
            </span>
            <span className="text-[10px] text-green-400 font-mono tracking-widest uppercase">
              {error ? "ERRO STREAM" : isPlaying ? "ON AIR" : "OFFLINE"}
            </span>
          </div>
        </div>

        {/* CONTROLES */}
        {isExpanded && (
          <div className="p-4 pt-0 space-y-4 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                {isPlaying ? (
                  <Pause fill="currentColor" />
                ) : (
                  <Play fill="currentColor" className="ml-1" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextStation}
                className="h-12 w-12 rounded-full hover:bg-white/10 text-soft"
              >
                <SkipForward size={20} />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
                className="text-soft hover:text-white"
              >
                {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {stations.map((s) => (
                <button
                  key={s.id}
                  onClick={() => changeStation(s.id)}
                  className={cn(
                    "text-xs p-2 rounded-lg text-left transition-colors truncate",
                    currentStation.id === s.id
                      ? "bg-white/10 text-blue-400 font-bold"
                      : "text-soft hover:text-white hover:bg-white/5"
                  )}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
