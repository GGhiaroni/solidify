"use client";

import { createDocument } from "@/app/actions/create-document"; // Sua server action
import { cn } from "@/lib/utils";
import { Document } from "@prisma/client";
import { ChevronRight, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import NoteItemMenu from "./NoteItemMenu"; // Seu menu existente

// Define que o documento pode ter filhos
type DocumentWithChildren = Document & { childDocuments?: Document[] };

interface DocumentItemProps {
  document: DocumentWithChildren;
  level?: number;
  onExpand?: () => void;
  expanded?: boolean;
}

export const DocumentItem = ({
  document,
  level = 0,
  onExpand,
  expanded,
}: DocumentItemProps) => {
  const params = useParams();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(expanded);

  const handleExpand = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsExpanded((prev) => !prev);
    onExpand?.();
  };

  // Função para criar nota filha usando sua Server Action atual
  const onCreateChild = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (!document.id) return;

    const promise = createDocument({
      title: "Sem título",
      parentDocumentId: document.id, // Passa o ID do pai
    }).then((response) => {
      // 👇 Aqui está a correção: usamos 'documentId' conforme sua action retorna
      if (response.success && response.documentId) {
        if (!isExpanded) setIsExpanded(true);
        router.push(`/notas/${response.documentId}`);
      } else {
        throw new Error("Erro ao criar nota.");
      }
    });

    toast.promise(promise, {
      pending: "Criando nova nota...",
      success: "Nova nota criada!",
      error: "Erro ao criar nota.",
    });
  };

  const active = params?.documentId === document.id;

  return (
    <div className="w-full relative">
      <Link
        href={`/notas/${document.id}`}
        className={cn(
          "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-white/5 flex items-center text-soft font-medium transition cursor-pointer",
          active && "bg-white/10 text-white"
        )}
        style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      >
        {/* Seta de Expandir */}
        <div
          role="button"
          onClick={handleExpand}
          className="h-full rounded-sm hover:bg-white/10 mr-1 transition p-0.5"
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 shrink-0 text-soft/50 transition-transform duration-200",
              isExpanded && "rotate-90"
            )}
          />
        </div>

        {/* Ícone */}
        {document.icon ? (
          <span className="shrink-0 mr-2 text-[18px]">{document.icon}</span>
        ) : (
          <FileText className="shrink-0 h-[18px] w-[18px] mr-2 text-soft/50" />
        )}

        {/* Título */}
        <span className="truncate">{document.title}</span>

        {/* Ações (Aparecem no Hover) */}
        <div className="flex items-center ml-auto opacity-0 group-hover:opacity-100 transition gap-x-1">
          {/* Botão + (Cria filho) */}
          <div
            role="button"
            onClick={onCreateChild}
            className="rounded-sm hover:bg-white/10 p-1 text-soft/50 hover:text-white"
          >
            <Plus className="h-4 w-4" />
          </div>

          {/* Seu Menu Existente (Deletar/Arquivar) */}
          <NoteItemMenu documentId={document.id} />
        </div>
      </Link>

      {/* Renderiza os filhos recursivamente */}
      {isExpanded && (
        <div className="flex flex-col">
          {document.childDocuments?.map((child) => (
            <DocumentItem
              key={child.id}
              document={child} // O TS infere que é Document
              level={level + 1}
            />
          ))}
          {document.childDocuments?.length === 0 && (
            <p
              style={{
                paddingLeft: level ? `${(level + 1) * 12 + 24}px` : "24px",
              }}
              className="text-xs text-soft/30 py-1"
            >
              Vazio
            </p>
          )}
        </div>
      )}
    </div>
  );
};
