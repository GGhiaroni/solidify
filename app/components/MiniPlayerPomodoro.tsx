"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Coffee, Leaf, Pause, PlayIcon, X, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePomodoro } from "../context/PomodoroContext";

export default function MiniPlayerPomodoro() {
  const { mode, initialTime, isActive, time, toggleTimer, resetTimer } =
    usePomodoro();

  //primeiro filtro: preciso que ele só apareça se eu não estiver na página do Pomodoro
  const pathanme = usePathname();
  if (pathanme === "/pomodoro") return null;

  //segundo filtro: não vai aparecer caso o cronômetro esteja pausado no início
  const isStoppedAtStart = !isActive && time === initialTime;
  if (isStoppedAtStart) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-[#161b22]/90 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[200px]">
        <Link href="/pomodoro" className="hover:opacity-80 transition-opacity">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center hover:cursor-pointer",
              mode === "focus"
                ? "bg-blue-600/20 text-blue-400"
                : "bg-emerald-600/20 text-emerald-400"
            )}
          >
            {mode === "focus" && <Zap size={20} fill="currentColor" />}
            {mode === "short" && <Coffee size={20} />}
            {mode === "long" && <Leaf size={20} />}
          </div>
        </Link>

        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-soft font-bold">
            {mode === "focus" ? "Focando" : "Pausa"}
          </span>
          <span className="text-xl font-mono font-bold leading-none text-white">
            {formatTime(time)}
          </span>
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="hover:cursor-pointer h-8 w-8 rounded-lg text-soft"
            onClick={toggleTimer}
          >
            {isActive ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <PlayIcon size={18} fill="currentColor" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hover:cursor-pointer h-8 w-8 rounded-lg text-soft hover:text-red-400"
            onClick={resetTimer}
          >
            <X size={18} fill="currentColor" />
          </Button>
        </div>
      </div>
    </div>
  );
}
