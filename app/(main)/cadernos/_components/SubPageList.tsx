"use client";

import deleteSubPageNote from "@/app/actions/delete-subpage-note";
import { Document } from "@prisma/client";
import { FileText, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

interface SubPagesListProps {
  childrenDocs: Document[];
  isRootNode: boolean;
  parentDocumentId: string;
}

export const SubPagesList = ({
  childrenDocs,
  isRootNode,
  parentDocumentId,
}: SubPagesListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!childrenDocs || childrenDocs.length === 0) return null;

  const handleDelete = async (e: React.MouseEvent, docId: string) => {
    e.preventDefault();
    e.stopPropagation();

    setDeletingId(docId);

    try {
      const response = await deleteSubPageNote(docId);

      if (response.success) {
        toast.success("Nota excluída permanentemente.");
      } else {
        toast.error(response.error || "Erro ao excluir.");
      }
    } catch (error) {
      toast.error("Ocorreu um erro inesperado.");
    } finally {
      setDeletingId(null);
    }
  };

  const label = isRootNode
    ? "PÁGINAS NESTE CADERNO"
    : "PÁGINAS VINCULADAS A ESTA NOTA";

  return (
    <div className="flex flex-col gap-1 mb-8 mt-4 animate-in fade-in slide-in-from-bottom-2">
      <h3 className="text-xs font-bold text-soft/50 uppercase tracking-widest mb-2 pl-1">
        {label}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {childrenDocs.map((doc) => (
          <Link
            key={doc.id}
            href={`/cadernos/${doc.id}`}
            className="group relative flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-[#1c222b]/50 hover:bg-[#1c222b] hover:border-white/10 transition-all pr-10"
          >
            <div className="p-2 rounded bg-white/5 text-soft group-hover:text-blue-400 transition-colors">
              {doc.icon ? (
                <span className="text-lg">{doc.icon}</span>
              ) : (
                <FileText size={18} />
              )}
            </div>

            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-white truncate group-hover:underline decoration-white/20 underline-offset-4">
                {doc.title || "Sem título"}
              </span>
            </div>

            <div
              role="button"
              onClick={(e) => handleDelete(e, doc.id)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md 
             text-zinc-400 hover:text-red-500 hover:bg-red-500/10 
             opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer"
              title="Excluir nota"
            >
              {deletingId === doc.id ? (
                <Loader2 size={16} className="animate-spin text-red-500" />
              ) : (
                <X size={16} />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
