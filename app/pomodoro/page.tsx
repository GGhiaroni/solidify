"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Coffee, Focus, History, PlayIcon, RotateCcw, Zap } from "lucide-react";
import React, { useState } from "react";

type TimerMode = "focus" | "short" | "long";

export default function PomodoroPage() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(25 * 60);

  // função auxiliar para formatar segundos em MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-light mb-2">Timer de Foco</h1>
          <p className="text-soft text-lg">
            Gerencie sua energia, não apenas seu tempo.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        {/* --- COLUNA ESQUERDA (PRINCIPAL - TIMER) --- */}
        {/* Aumentei para col-span-8 para dar mais destaque horizontal */}
        <div className="lg:col-span-8 relative group">
          {/* Efeito de Glow (Brilho) atrás do card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

          <div className="relative h-full min-h-[500px] bg-[#0D1117] border border-white/10 rounded-[2rem] p-8 flex flex-col items-center justify-between shadow-2xl">
            {/* Seletor de Modos (Estilo Pílula Flutuante) */}
            <div className="bg-white/5 border border-white/5 p-1.5 rounded-full flex gap-1 backdrop-blur-md">
              <ModeButton
                active={mode === "focus"}
                onClick={() => setMode("focus")}
                icon={<Zap size={18} />}
                label="Foco"
              />
              <ModeButton
                active={mode === "short"}
                onClick={() => setMode("short")}
                icon={<Coffee size={18} />}
                label="Curta"
              />
              <ModeButton
                active={mode === "long"}
                onClick={() => setMode("long")}
                icon={<Focus size={18} />}
                label="Longa"
              />
            </div>

            {/* O Relógio Gigante */}
            <div className="relative flex flex-col items-center justify-center flex-1 w-full">
              {/* Círculo de fundo decorativo */}
              <div
                className={cn(
                  "absolute w-[350px] h-[350px] rounded-full blur-[100px] transition-colors duration-700",
                  isActive ? "bg-blue-500/10" : "bg-white/5"
                )}
              />

              <div
                className={cn(
                  "text-[8rem] md:text-[10rem] font-bold tracking-tighter tabular-nums leading-none transition-colors duration-500 z-10 drop-shadow-2xl",
                  isActive ? "text-white" : "text-white/50"
                )}
              >
                {formatTime(time)}
              </div>

              <p className="text-center text-soft uppercase tracking-[0.3em] font-medium mt-4 animate-pulse">
                {isActive ? "Sessão em andamento" : "Pronto para iniciar"}
              </p>
            </div>

            {/* Controles Principais */}
            <div className="flex items-center gap-6 mb-4">
              <Button
                size="icon"
                variant="ghost"
                className="w-16 h-16 rounded-full text-soft hover:text-white hover:bg-white/10 transition-all"
                onClick={() => {}} // Reset logic
              >
                <RotateCcw size={24} />
              </Button>

              <Button
                className={cn(
                  "w-24 h-24 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95",
                  isActive
                    ? "bg-red-500/10 text-red-500 border-2 border-red-500/50 hover:bg-red-500/20"
                    : "bg-white text-black hover:bg-blue-50 border-2 border-white"
                )}
                onClick={() => setIsActive(!isActive)}
              >
                {isActive ? (
                  <div className="flex gap-2">
                    <div className="w-2.5 h-8 bg-current rounded-full" />
                    <div className="w-2.5 h-8 bg-current rounded-full" />
                  </div>
                ) : (
                  <PlayIcon size={40} fill="currentColor" className="ml-1" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* --- COLUNA DIREITA (SIDEBAR) --- */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
          {/* Card de Sessões */}
          <div className="bg-[#0D1117] border border-white/10 p-6 rounded-[2rem] flex-1 min-h-[300px]">
            <h3 className="text-light font-bold mb-6 flex items-center gap-3 text-lg">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <History size={20} />
              </div>
              Sessões de Hoje
            </h3>

            {/* Estado Vazio Melhorado */}
            <div className="h-[200px] flex flex-col items-center justify-center text-center border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                <Zap className="text-white/20" size={24} />
              </div>
              <p className="text-soft text-sm font-medium">Nenhum foco hoje.</p>
              <p className="text-soft/50 text-xs mt-1">
                O dia está só começando!
              </p>
            </div>
          </div>

          {/* Dica Tech Lead */}
          <div className="bg-gradient-to-br from-blue-900/20 to-blue-600/10 border border-blue-500/20 p-6 rounded-[2rem]">
            <h4 className="text-blue-400 font-bold mb-3 text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Dica do Tech Lead
            </h4>
            <p className="text-blue-100/80 text-sm leading-relaxed">
              A consistência supera a intensidade. É melhor 25 minutos todo dia
              do que 5 horas apenas no sábado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

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
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
        active
          ? "bg-primary text-white shadow-lg shadow-primary/25"
          : "text-soft hover:text-light hover:bg-white/5"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
