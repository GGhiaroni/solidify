"use client";

import { Station } from "@/lib/lofi-stations";

interface LofiContextType {
  isPlaying: boolean;
  volume: number;
  currentStation: Station;
  togglePlay: () => void;
  setVolume: (value: number) => void;
  changeStation: (stationId: string) => void;
}
