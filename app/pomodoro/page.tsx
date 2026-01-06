"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Check,
  Coffee,
  History,
  Leaf,
  PlayIcon,
  RotateCcw,
  Zap,
} from "lucide-react";
import React from "react";
import DailyQuote from "../components/DailyQuote";
import { usePomodoro } from "../context/PomodoroContext";

export default function PomodoroPage() {
  const {
    mode,
    initialTime,
    time,
    isActive,
    todaySessions,
    changeMode,
    toggleTimer,
    resetTimer,
    finishEarly,
    addTime,
    subtractTime,
  } = usePomodoro();

  // função auxiliar para formatar segundos em MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const totalMinutesToday = todaySessions.reduce(
    (acc, session) => acc + session.duration,
    0
  );

  return (
    <div className="h-full flex flex-col lg:flex-row gap-12 animate-in fade-in duration-700">
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[500px]">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] pointer-events-none select-none transition-all duration-1000"
          style={{
            background: isActive
              ? "radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, rgba(0, 0, 0, 0) 65%)"
              : "radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, rgba(0, 0, 0, 0) 60%)",
          }}
        />

        <div className="flex gap-2 mb-16 bg-white/5 p-1 rounded-full backdrop-blur-sm">
          <ModeButton
            active={mode === "focus"}
            onClick={() => changeMode("focus")}
            icon={<Zap size={16} />}
            label="Foco"
          />
          <ModeButton
            active={mode === "short"}
            onClick={() => changeMode("short")}
            icon={<Coffee size={16} />}
            label="Pausa Curta"
          />
          <ModeButton
            active={mode === "long"}
            onClick={() => changeMode("long")}
            icon={<Leaf size={16} />}
            label="Pausa Longa"
          />
        </div>

        <div className="relative z-10 font-bold text-[10rem] md:text-[13rem] leading-none tracking-tighter tabular-nums text-white drop-shadow-2xl select-none">
          {formatTime(time)}
        </div>

        <p className="text-soft font-medium tracking-[0.3em] uppercase mt-4 mb-12 opacity-60">
          {isActive ? "Foco Total" : "Pronto para iniciar?"}
        </p>

        <div className="flex justify-center items-center gap-2 relative z-10">
          <Button
            size="icon"
            variant="ghost"
            className="hover:cursor-pointer w-8 h-8 rounded-full text-soft hover:text-white hover:bg-white/10 transition-transform hover:rotate-180 duration-500"
            onClick={resetTimer}
          >
            <RotateCcw size={28} />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="flex gap-1 hover:cursor-pointer w-16 h-16 rounded-full text-soft hover:text-white hover:bg-white/10 transition-all hover:scale-110 duration-300 items-center justify-center"
            onClick={() => subtractTime(5)}
            title="Adicionar 5 minutos"
          >
            <span className="text-xl font-bold font-mono">-</span>
            <span className="text-xl font-bold font-mono">5</span>
          </Button>

          <Button
            className={cn(
              "hover:cursor-pointer w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95",
              isActive
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/50"
            )}
            onClick={toggleTimer}
          >
            {isActive ? (
              <div className="flex gap-3">
                <div className="w-2 h-10 bg-current rounded-full" />
                <div className="w-2 h-10 bg-current rounded-full" />
              </div>
            ) : (
              <PlayIcon size={48} fill="currentColor" className="ml-2" />
            )}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="flex gap-1 hover:cursor-pointer w-16 h-16 rounded-full text-soft hover:text-white hover:bg-white/10 transition-all hover:scale-110 duration-300 items-center justify-center"
            onClick={() => addTime(5)}
            title="Adicionar 5 minutos"
          >
            <span className="text-xl font-bold font-mono">+</span>
            <span className="text-xl font-bold font-mono">5</span>
          </Button>
        </div>

        {mode === "focus" && time < initialTime && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="hover:cursor-pointer text-xl mt-12 text-soft hover:text-primary transition-colors gap-2"
              >
                <Check size={20} />
                Finalizar sessão agora
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-[#0D1117] border-white/10 text-light">
              <DialogHeader>
                <DialogTitle className="text-xl">Encerrar foco?</DialogTitle>
                <DialogDescription className="text-soft text-base">
                  Você focou por um total de{" "}
                  <span className="font-bold">
                    {Math.floor((initialTime - time) / 60)} minutos
                  </span>{" "}
                  até agora. Deseja encerrar e registrar esse tempo na sua
                  jornada?
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="flex gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    className="hover:cursor-pointer text-soft hover:bg-white/5 hover:text-white"
                  >
                    Continuar focado
                  </Button>
                </DialogClose>
                <Button
                  className="hover:cursor-pointer  bg-primary hover:bg-blue-700 text-white font-bold"
                  onClick={finishEarly}
                >
                  Sim, finalizar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="lg:w-[350px] flex flex-col justify-center border-l border-white/5 pl-12 py-10">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-light mb-2">Sessões</h2>
          <p className="text-soft text-sm">Histórico do dia</p>

          {totalMinutesToday > 0 && (
            <div className="text-right animate-in fade-in slide-in-from-right-4 duration-700">
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block mb-1">
                Total
              </span>
              <span className="text-2xl font-mono font-bold text-white leading-none">
                {totalMinutesToday}
                <span className="text-sm font-sans font-normal text-soft ml-1">
                  min
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
          {todaySessions.length === 0 ? (
            // Estado Vazio
            <div className="flex flex-col items-center justify-center h-[200px] text-center text-soft/40 border border-dashed border-white/5 rounded-2xl">
              <History size={32} className="mb-3 opacity-50" />
              <p className="text-sm">Nenhum foco hoje</p>
            </div>
          ) : (
            // Lista Preenchida
            todaySessions.map((session, index) => (
              <div
                key={session.id} // Use o ID vindo do banco ou o random do contexto
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 animate-in slide-in-from-right-4 fade-in duration-500 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Check size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-light">
                      Foco Total
                    </span>
                    <span className="text-xs text-soft">
                      {new Date(session.createdAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                <span className="font-mono font-bold text-white">
                  +{session.duration} min
                </span>
              </div>
            ))
          )}
        </div>

        <div className="mt-auto pt-8">
          <span className="text-sm font-light text-blue-400  tracking-widest mb-2">
            gota de motivação diária 🍃
          </span>
          <p className="text-soft text-sm leading-relaxed">
            <DailyQuote />
          </p>
        </div>
      </div>
    </div>
  );
}

// Botões mais limpos, sem bordas pesadas
interface ModeButtonProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function ModeButton({ active, icon, label, onClick }: ModeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex hover:cursor-pointer items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
        active
          ? "bg-white/10 text-white shadow-inner"
          : "text-soft hover:text-white hover:bg-white/5"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
