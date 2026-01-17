"use client";

import { Station, stations } from "@/lib/lofi-stations";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface LofiContextType {
  isPlaying: boolean;
  volume: number;
  currentStation: Station;
  togglePlay: () => void;
  setVolume: (value: number) => void;
  changeStation: (stationId: string) => void;
  nextStation: () => void;
  prevStation: () => void;
}

const LofiContext = createContext({} as LofiContextType);

export function LofiProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [currentStation, setCurrentStation] = useState<Station>(stations[0]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(currentStation.streamUrl);
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch((e) => {
        console.error("Erro ao reproduzir áudio:", e);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (audioRef.current.src !== currentStation.streamUrl) {
      audioRef.current.src = currentStation.streamUrl;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentStation, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => setIsPlaying((prev) => !prev);

  const setVolume = (val: number) => setVolumeState(val);

  const changeStation = (stationId: string) => {
    const newStation = stations.find((s) => s.id === stationId);
    if (newStation) {
      setCurrentStation(newStation);
      setIsPlaying(true);
    }
  };

  const nextStation = () => {
    const currentIndex = stations.findIndex((s) => s.id === currentStation.id);
    const nextIndex = (currentIndex + 1) % stations.length;
    setCurrentStation(stations[nextIndex]);
    setIsPlaying(true);
  };

  const prevStation = () => {
    const currentIndex = stations.findIndex((s) => s.id === currentStation.id);
    const prevIndex = (currentIndex - 1 + stations.length) % stations.length;
    setCurrentStation(stations[prevIndex]);
    setIsPlaying(true);
  };

  return (
    <LofiContext.Provider
      value={{
        isPlaying,
        volume,
        currentStation,
        togglePlay,
        setVolume,
        changeStation,
        nextStation,
        prevStation,
      }}
    >
      {children}
    </LofiContext.Provider>
  );
}

export const useLofi = () => useContext(LofiContext);
