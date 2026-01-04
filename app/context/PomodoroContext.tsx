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
  initialTime: number;
  time: number;
  isActive: boolean;
  changeMode: (mode: TimerMode) => void;
  toggleTimer: () => void; //ligar/desligar o cronômetro;
  resetTimer: () => void; //resetar o cronômetro;
  finishEarly: () => void;
}

//criando o contexto, que incialmente está vazio;
const PomodoroContext = createContext({} as PomodoroContextType);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(3 * 60);

  const [initialTime, setInitialTime] = useState(3 * 60);

  const playSound = (
    type: "start" | "pause" | "ending" | "finished" | "restart"
  ) => {
    let file = "";

    switch (type) {
      case "start":
        file = "/sounds/click-start-focus.wav";
        break;
      case "pause":
        file = "/sounds/click-pause.wav";
        break;
      case "ending":
        file = "/sounds/session-ending.wav";
        break;
      case "finished":
        file = "/sounds/session-finished.wav";
        break;
      case "restart":
        file = "/sounds/click-restart.wav";
        break;
    }

    if (file) {
      const audio = new Audio(file);
      audio.volume = 0.6;
      audio.play().catch((err) => console.error("Erro ao tocar áudio:", err));
    }
  };

  useEffect(() => {
    if (time === 120 && isActive) {
      playSound("ending");
      toast.info("Reta final! Faltam apenas 2 minutos. 🚀", {
        autoClose: 5000,
        toastId: "ending-toast",
      });
    }
  }, [time, isActive]);

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

  const toggleTimer = () => {
    if (!isActive) {
      playSound("start");
    } else {
      playSound("pause");
    }
    setIsActive(!isActive);
  };

  const handleComplete = async () => {
    setIsActive(false);

    playSound("finished");

    if (mode === "focus") {
      const minutesCompleted = initialTime / 60;
      await studySessionLog({
        minutes: minutesCompleted,
        date: new Date(),
      });
      toast.success(`Parabéns! +${minutesCompleted} minutos registrados! 🔥`);
      setTime(initialTime);
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
      setTimeout(() => handleComplete(), 0);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const resetTimer = () => {
    setIsActive(false);
    playSound("restart");
    changeMode(mode);
  };

  const finishEarly = async () => {
    setIsActive(false);

    const secondsStudied = initialTime - time;
    const minutesStudied = Math.floor(secondsStudied / 60);

    if (minutesStudied < 1) {
      toast.warn("Sessão muito curta para ser registrada.");
      resetTimer();
      return;
    }

    await studySessionLog({
      minutes: minutesStudied,
      date: new Date(),
    });

    toast.success(`Sessão encerrada. +${minutesStudied} min salvos! ✅`);

    playSound("finished");
    resetTimer();
  };

  return (
    <PomodoroContext.Provider
      value={{
        mode,
        initialTime,
        time,
        isActive,
        changeMode,
        toggleTimer,
        resetTimer,
        finishEarly,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

export const usePomodoro = () => useContext(PomodoroContext);
