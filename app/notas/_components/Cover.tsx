"use client";

import updateDocument from "@/app/actions/update-document";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";

interface CoverProps {
  url?: string | null;
  preview?: boolean;
}

export const Cover = ({ url, preview }: CoverProps) => {
  const { edgestore } = useEdgeStore();
  const params = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onRemove = async () => {
    if (url) {
      await updateDocument(params.documentId as string, {
        coverImage: null,
      });
      router.refresh();
    }
  };

  if (!url) return null;

  const onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setIsUploading(true);

      try {
        const res = await edgestore.publicFiles.upload({
          file,
          options: {
            replaceTargetUrl: url && !url.startsWith("http") ? url : undefined,
          },
        });

        await updateDocument(params.documentId as string, {
          coverImage: res.url,
        });

        router.refresh();
      } catch (error) {
        console.error("Erro no upload", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && (
        <>
          {url.startsWith("bg-") ? (
            <div className={cn("h-full w-full", url)} />
          ) : (
            <Image src={url} fill alt="Cover" className="object-cover" />
          )}
        </>
      )}

      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="hover:cursor-pointer text-xs bg-black/50 hover:bg-black/70 text-white p-2 rounded-md transition flex items-center gap-x-2"
            disabled={isUploading}
          >
            <Upload className="h-4 w-4" />
            {isUploading ? "Enviando..." : "Alterar capa"}
          </button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={onUpload}
            accept="image/*"
          />

          <button
            onClick={onRemove}
            className="hover:cursor-pointer text-xs bg-black/50 hover:bg-black/70 text-white p-2 rounded-md transition flex items-center gap-x-2"
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
            Remover
          </button>
        </div>
      )}
    </div>
  );
};
