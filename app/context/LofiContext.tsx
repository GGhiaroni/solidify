"use client";

import { Station, stations } from "@/lib/lofi-stations";
import { createContext, ReactNode, useContext, useState } from "react";

interface LofiContextType {
  isPlaying: boolean;
  volume: number;
  currentStation: Station;
  togglePlay: () => void;
  setVolume: (value: number) => void;
  changeStation: (stationId: string) => void;
}

const LofiContext = createContext({} as LofiContextType);

export function LofiProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentStation, setCurrentStation] = useState<Station>(stations[0]);

  const togglePlay = () => setIsPlaying((prev) => !prev);

  const changeStation = (stationId: string) => {
    const newStation = stations.find((s) => s.id === stationId);

    if (newStation) {
      setCurrentStation(newStation);
      setIsPlaying(true);
    }
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
      }}
    >
      {children}
    </LofiContext.Provider>
  );
}

export const useLofi = () => useContext(LofiContext);
