"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
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

interface PomodoroContextType {
  mode: TimerMode;
  initialTime: number;
  time: number;
  isActive: boolean;
  todaySessions: Session[];
  finishedSession: string | null;
  changeMode: (mode: TimerMode) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  finishEarly: () => void;
  addTime: (minutes: number) => void;
  subtractTime: (minutes: number) => void;
  renameSession: (sessionId: string, newName: string) => void;
  setFinishedSession: (id: string | null) => void;
}

const PomodoroContext = createContext({} as PomodoroContextType);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(25 * 60);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [todaySessions, setTodaySessions] = useState<Session[]>([]);
  const [finishedSession, setFinishedSession] = useState<string | null>(null);
  const [expectedEndTime, setExpectedEndTime] = useState<number | null>(null);

  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    const files = {
      start: "/sounds/click-start-focus.wav",
      pause: "/sounds/click-pause.wav",
      ending: "/sounds/session-ending.wav",
      finished: "/sounds/session-finished.wav",
      restart: "/sounds/click-restart.wav",
    };

    Object.entries(files).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = "auto";
      audioRefs.current[key] = audio;
    });
  }, []);

  const playSound = useCallback((type: string) => {
    const audio = audioRefs.current[type];
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.6;
      audio.play().catch((err) => console.log("Audio play blocked:", err));
    }
  }, []);

  const sendNotification = useCallback(() => {
    if (!("Notification" in window) || Notification.permission !== "granted")
      return;

    const notification = new Notification("Sessão Finalizada! 🎯", {
      body:
        mode === "focus"
          ? "Hora de descansar um pouco."
          : "Pausa encerrada. Vamos focar?",
      icon: "/favicon.ico",
      requireInteraction: true,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }, [mode]);

  const changeMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setExpectedEndTime(null);

    const times = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
    setTime(times[newMode]);
    setInitialTime(times[newMode]);
  }, []);

  const handleComplete = useCallback(async () => {
    setIsActive(false);
    setExpectedEndTime(null);
    playSound("finished");
    sendNotification();

    if (mode === "focus") {
      const minutesCompleted = Math.floor(initialTime / 60);
      const studySessionSaved = await studySessionLog({
        minutes: minutesCompleted,
        date: new Date(),
      });

      const optimisticSession: Session = {
        id: studySessionSaved.session?.id || Math.random().toString(),
        duration: minutesCompleted,
        createdAt: new Date(),
        name: null,
      };

      setTodaySessions((prev) => [optimisticSession, ...prev]);
      setFinishedSession(studySessionSaved.session?.id || null);
      toast.success(`Parabéns! +${minutesCompleted} minutos registrados! 🔥`);
      setTime(initialTime);
    } else {
      toast.info("Pausa finalizada. Hora de voltar!");
      changeMode("focus");
    }
  }, [mode, initialTime, changeMode, playSound, sendNotification]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    async function loadSessions() {
      const data = await getTodaysessions();
      if (Array.isArray(data)) setTodaySessions(data);
    }
    loadSessions();
  }, []);

  useEffect(() => {
    if (time === 120 && isActive) {
      playSound("ending");
      toast.info("Reta final! Faltam apenas 2 minutos. 🚀", {
        autoClose: 5000,
        toastId: "ending-toast",
      });
    }
  }, [time, isActive, playSound]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && expectedEndTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.round((expectedEndTime - now) / 1000);

        if (remaining <= 0) {
          setTime(0);
          setIsActive(false);
          setExpectedEndTime(null);
          handleComplete();
          clearInterval(interval);
        } else {
          setTime(remaining);
        }
      }, 500);
    }

    return () => clearInterval(interval);
  }, [isActive, expectedEndTime, handleComplete]);

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

  const toggleTimer = useCallback(() => {
    if (!isActive) {
      playSound("start");
      setExpectedEndTime(Date.now() + time * 1000);
    } else {
      playSound("pause");
      setExpectedEndTime(null);
    }
    setIsActive((prev) => !prev);
  }, [isActive, time, playSound]);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setExpectedEndTime(null);
    playSound("restart");
    changeMode(mode);
  }, [mode, changeMode, playSound]);

  const finishEarly = useCallback(async () => {
    setIsActive(false);
    setExpectedEndTime(null);
    const minutesStudied = Math.floor((initialTime - time) / 60);

    if (minutesStudied < 1) {
      toast.warn("Sessão muito curta.");
      resetTimer();
      return;
    }

    const studySessionSaved = await studySessionLog({
      minutes: minutesStudied,
      date: new Date(),
    });

    setTodaySessions((prev) => [
      {
        id: studySessionSaved.session?.id || Math.random().toString(),
        duration: minutesStudied,
        createdAt: new Date(),
        name: null,
      },
      ...prev,
    ]);

    setFinishedSession(studySessionSaved.session?.id || null);
    toast.success(`Sessão encerrada. +${minutesStudied} min salvos! ✅`);
    playSound("finished");
    resetTimer();
  }, [initialTime, time, resetTimer, playSound]);

  const addTime = useCallback(
    (minutes: number) => {
      const secondsToAdd = minutes * 60;
      setTime((prev) => prev + secondsToAdd);
      setInitialTime((prev) => prev + secondsToAdd);
      if (isActive && expectedEndTime) {
        setExpectedEndTime((prev) =>
          prev ? prev + secondsToAdd * 1000 : null,
        );
      }
    },
    [isActive, expectedEndTime],
  );

  const subtractTime = useCallback(
    (minutes: number) => {
      const secondsToSub = minutes * 60;
      setTime((prev) => Math.max(0, prev - secondsToSub));
      setInitialTime((prev) => Math.max(0, prev - secondsToSub));
      if (isActive && expectedEndTime) {
        setExpectedEndTime((prev) =>
          prev ? prev - secondsToSub * 1000 : null,
        );
      }
    },
    [isActive, expectedEndTime],
  );

  const renameSession = useCallback((sessionId: string, newName: string) => {
    setTodaySessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, name: newName } : s)),
    );
    updateSessionName(sessionId, newName);
  }, []);

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
