"use client";

import updateDocument from "@/app/actions/update-document";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

interface CoverProps {
  url?: string | null;
  preview?: boolean; // Para usar na sidebar se quiser no futuro
}

export const Cover = ({ url, preview }: CoverProps) => {
  const params = useParams();

  const onRemove = async () => {
    if (url) {
      await updateDocument(params.documentId as string, {
        coverImage: null,
      });
    }
  };

  if (!url) return null;

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {url.startsWith("bg-") ? (
        <div className={cn("h-full w-full", url)} />
      ) : (
        <Image src={url} fill alt="Cover" className="object-cover" />
      )}

      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <button
            onClick={onRemove}
            className="text-muted-foreground text-xs bg-black/50 hover:bg-black/70 text-white p-2 rounded-md transition"
          >
            <X className="h-4 w-4 mr-2 inline" />
            Remover capa
          </button>
        </div>
      )}
    </div>
  );
};
