"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import getTodaysessions from "../actions/get-today-sessions";
import { studySessionLog } from "../actions/study-session-log";
import updateSessionName from "../actions/update-session-name";

type TimerMode = "focus" | "short" | "long";

interface Session {
  id: string | null;
  name: string | null;
  duration: number;
  createdAt: Date;
}

//interface, o que vai ficar disponível para todas as páginas da aplicação;
interface PomodoroContextType {
  mode: TimerMode;
  initialTime: number;
  time: number;
  isActive: boolean;
  todaySessions: Session[];
  finishedSession: string | null;
  changeMode: (mode: TimerMode) => void;
  toggleTimer: () => void; //ligar/desligar o cronômetro;
  resetTimer: () => void; //resetar o cronômetro;
  finishEarly: () => void;
  addTime: (minutes: number) => void;
  subtractTime: (minutes: number) => void;
  renameSession: (sessionId: string, newName: string) => void;
  setFinishedSession: (id: string | null) => void;
}

//criando o contexto, que incialmente está vazio;
const PomodoroContext = createContext({} as PomodoroContextType);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(3 * 60);

  const [initialTime, setInitialTime] = useState(3 * 60);

  const [todaySessions, setTodaySessions] = useState<Session[]>([]);

  const [finishedSession, setFinishedSession] = useState<string | null>(null);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const sendNotification = () => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      const notification = new Notification("Sessão Finalizada! 🎯", {
        body:
          mode === "focus"
            ? "Hora de descansar um pouco."
            : "Pausa encerrada. Vamos focar?",
      });

      notification.onclick = () => {
        window.focus();
      };
    }
  };

  useEffect(() => {
    if (time === 0 && !isActive) {
      const originalTitle = document.title;

      const interval = setInterval(() => {
        document.title =
          document.title === "ACABOU! ⏰" ? originalTitle : "ACABOU! ⏰";
      }, 1000);

      const stopAlert = () => {
        clearInterval(interval);
        document.title = originalTitle;
        window.removeEventListener("focus", stopAlert);
      };

      window.addEventListener("focus", stopAlert);

      return () => {
        clearInterval(interval);
        window.removeEventListener("focus", stopAlert);
      };
    }
  }, [time, isActive]);

  useEffect(() => {
    async function loadSessions() {
      const data = await getTodaysessions();

      if (Array.isArray(data)) {
        setTodaySessions(data);
      }
    }
    loadSessions();
  }, []);

  const playSound = (
    type: "start" | "pause" | "ending" | "finished" | "restart",
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

  const addToTodaySessions = (minutes: number, realId?: string) => {
    const optimisticSession: Session = {
      id: realId || Math.random().toString(),
      duration: minutes,
      createdAt: new Date(),
      name: null,
    };
    setTodaySessions((prev) => [optimisticSession, ...prev]);
  };

  const handleComplete = async () => {
    setIsActive(false);

    playSound("finished");

    sendNotification();

    if (mode === "focus") {
      const minutesCompleted = initialTime / 60;

      const studySessionSaved = await studySessionLog({
        minutes: minutesCompleted,
        date: new Date(),
      });

      addToTodaySessions(minutesCompleted, studySessionSaved.session?.id);

      setFinishedSession(studySessionSaved.session?.id || null);

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

    const studySessionSaved = await studySessionLog({
      minutes: minutesStudied,
      date: new Date(),
    });

    setFinishedSession(studySessionSaved.session?.id || null);

    addToTodaySessions(minutesStudied, studySessionSaved.session?.id);

    toast.success(`Sessão encerrada. +${minutesStudied} min salvos! ✅`);

    playSound("finished");
    resetTimer();
  };

  const addTime = (minutes: number) => {
    setTime((prev) => prev + minutes * 60);
    setInitialTime((prev) => prev + minutes * 60);
  };

  const subtractTime = (minutes: number) => {
    setTime((prev) => {
      const newTime = prev - minutes * 60;
      return newTime < 0 ? 0 : newTime;
    });

    setInitialTime((prev) => {
      const newInitial = prev - minutes * 60;
      return newInitial < 0 ? 0 : newInitial;
    });
  };
  const renameSession = (sessionId: string, newName: string) => {
    setTodaySessions((prev) =>
      prev.map((session) =>
        session.id === sessionId ? { ...session, name: newName } : session,
      ),
    );

    updateSessionName(sessionId, newName);
  };

  return (
    <PomodoroContext.Provider
      value={{
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
        renameSession,
        finishedSession,
        setFinishedSession,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

export const usePomodoro = () => useContext(PomodoroContext);
