"use client";

import { createContext, ReactNode, useState } from "react";

type TimerMode = "focus" | "short" | "long";

//interface, o que vai ficar disponível para todas as páginas da aplicação;
interface PomodoroContextType {
  mode: TimerMode;
  time: number;
  isActive: boolean;
  setMode: (mode: TimerMode) => void;
  toggleTimer: () => void; //ligar/desligar o cronômetro;
  resetTimer: () => void; //resetar o cronômetro;
}

//criando o contexto, que incialmente está vazio;
const PomodoroContext = createContext({} as PomodoroContextType);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(25 * 60);

  const [initialTime, setInitialTime] = useState(25 * 60);

  return (
    <PomodoroContext.Provider
      value={{
        mode,
        time,
        isActive,
        setMode,
        toggleTimer: () => setIsActive(!isActive),
        resetTimer: () => setIsActive(false),
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}
