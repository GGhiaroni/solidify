"use client";

import updateDocument from "@/app/actions/update-document";
import { Document } from "@prisma/client";
import { X } from "lucide-react";
import { useState } from "react";
import { IconPicker } from "./IconPicker";

interface ToolbarProps {
  initialData: Document;
}

export const Toolbar = ({ initialData }: ToolbarProps) => {
  const [data, setData] = useState(initialData);

  const onIconSelect = (icon: string) => {
    setData({ ...data, icon });
    updateDocument(initialData.id, { icon });
  };

  const onRemoveIcon = (e: React.MouseEvent) => {
    e.stopPropagation();
    setData({ ...data, icon: null });
    updateDocument(initialData.id, { icon: null });
  };

  return (
    <div className="relative group/toolbar mb-4">
      <div className="opacity-0 group-hover/toolbar:opacity-100 flex items-center gap-x-1 py-4 transition duration-200">
        {!data.icon && (
          <IconPicker onChange={onIconSelect} asChild>
            <button className="text-muted-foreground text-xs hover:bg-white/10 p-2 rounded transition text-soft/50 hover:text-soft">
              😀 Adicionar ícone
            </button>
          </IconPicker>
        )}
        {!data.coverImage && (
          <button className="text-muted-foreground text-xs hover:bg-white/10 p-2 rounded transition text-soft/50 hover:text-soft">
            🖼️ Adicionar capa
          </button>
        )}
      </div>

      {data.icon && (
        <div className="flex items-center gap-x-2 group/icon -ml-1">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:bg-white/5 rounded-md p-1 transition cursor-pointer">
              {data.icon}
            </p>
          </IconPicker>

          <button
            onClick={onRemoveIcon}
            className="opacity-0 group-hover/icon:opacity-100 rounded-full bg-neutral-500/20 hover:bg-neutral-500/40 p-1 transition text-neutral-400"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
};
