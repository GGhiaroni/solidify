"use client";

import deleteDocument from "@/app/actions/delete-document";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface NoteItemMenuProps {
  documentId: string;
}

export default function NoteItemMenu({ documentId }: NoteItemMenuProps) {
  const router = useRouter();

  const onArchive = () => {
    toast.info("Funcionalidade de arquivar em breve!");
  };

  const onDelete = () => {
    const promise = deleteDocument(documentId).then((response) => {
      if (response.success) {
        router.push("/notas");
        return "Nota deletada!";
      } else {
        throw new Error(response.error || "Erro ao deletar nota.");
      }
    });

    toast.promise(promise, {
      pending: "Deletando nota...",
      success: "Nota deletada com sucesso! ✅",
      error: "Erro ao deletar nota.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role="button"
          className="h-full rounded-sm hover:bg-white/10 p-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal size={14} className="text-soft" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-60 bg-[#1F1F1F] border-white/10 text-soft"
        align="start"
        side="right"
        forceMount
      >
        <DropdownMenuItem
          onClick={onArchive}
          className="cursor-pointer hover:bg-white/5 focus:bg-white/5 focus:text-white"
        >
          <Trash size={14} className="mr-2" />
          Arquivar
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10" />

        <div className="text-xs text-soft/50 p-2">
          A última edição foi feita por você
        </div>

        <DropdownMenuItem
          onClick={onDelete}
          className="cursor-pointer text-red-500 hover:bg-red-500/10 hover:text-red-400 focus:bg-red-500/10 focus:text-red-400"
        >
          <Trash size={14} className="mr-2" />
          Deletar permanentemente
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
