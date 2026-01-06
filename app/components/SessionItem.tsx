"use client";

import { Input } from "@/components/ui/input"; // Certifique-se de ter o Input do shadcn
import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { usePomodoro } from "../context/PomodoroContext";

interface SessionItemProps {
  id: string;
  name?: string | null;
  duration: number;
  createdAt: Date;
}

export default function SessionItem({
  id,
  name,
  duration,
  createdAt,
}: SessionItemProps) {
  const { renameSession } = usePomodoro();

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name || "Foco Total");

  const handleSave = () => {
    if (tempName.trim() === "") {
      setTempName("Foco Total");
    }
    renameSession(id, tempName);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setTempName(name || "Foco Total");
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
          <Check size={14} />
        </div>

        <div className="flex flex-col flex-1">
          {isEditing ? (
            <div className="mb-2 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="h-7 text-xs bg-black/40 border-white/10 text-white focus-visible:ring-blue-500/50"
              />
              <button
                onClick={handleSave}
                className="text-emerald-400 hover:text-emerald-300"
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => {
                  setTempName(name || "Foco Total");
                  setIsEditing(false);
                }}
                className="text-red-400 hover:text-red-300"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group/text">
              <span
                className="text-sm font-medium text-light truncate max-w-[150px]"
                title={name || "Foco Total"}
              >
                {name || "Foco Total"}
              </span>

              <button
                onClick={() => setIsEditing(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-soft hover:text-blue-400"
                title="Renomear sessão"
              >
                <Pencil size={12} />
              </button>
            </div>
          )}

          <span className="text-xs text-soft">
            {new Date(createdAt).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <span className="font-mono font-bold text-white ml-4">
        +{duration} min
      </span>
    </div>
  );
}
