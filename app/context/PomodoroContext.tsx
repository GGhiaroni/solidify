"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { studySessionLog } from "../actions/study-session-log";

type TimerMode = "focus" | "short" | "long";

//interface, o que vai ficar disponível para todas as páginas da aplicação;
interface PomodoroContextType {
  mode: TimerMode;
  time: number;
  isActive: boolean;
  changeMode: (mode: TimerMode) => void;
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

  const changeMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);

    switch (newMode) {
      case "focus":
        setTime(25 * 60);
        setInitialTime(25 * 60);
        break;
      case "short":
        setTime(5 * 60);
        setInitialTime(5 * 60);
        break;
      case "long":
        setTime(15 * 60);
        setInitialTime(15 * 60);
        break;
    }
  };

  const handleComplete = async () => {
    setIsActive(false);

    // Tocar som
    const audio = new Audio("/sounds/bell.mp3");
    audio.play().catch(() => {});

    if (mode === "focus") {
      const minutesCompleted = initialTime / 60;
      await studySessionLog({
        minutes: minutesCompleted,
        date: new Date(),
      });
      toast.success(`Parabéns! +${minutesCompleted} minutos registrados! 🔥`);
    } else {
      toast.info("Pausa finalizada. Hora de voltar!");
      changeMode("focus");
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0 && isActive) {
      setTimeout(() => {
        handleComplete();
      }, 0);
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  const resetTimer = () => {
    setIsActive(false);
    changeMode(mode);
  };

  return (
    <PomodoroContext.Provider
      value={{
        mode,
        time,
        isActive,
        changeMode,
        toggleTimer: () => setIsActive(!isActive),
        resetTimer,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

export const usePomodoro = () => useContext(PomodoroContext);
