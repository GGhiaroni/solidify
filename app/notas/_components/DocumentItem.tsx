"use client";

import { createDocument } from "@/app/actions/create-document";
import updateDocument from "@/app/actions/update-document";
import { cn } from "@/lib/utils";
import { Document } from "@prisma/client";
import { ChevronDown, ChevronRight, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { IconPicker } from "./IconPicker";
import NoteItemMenu from "./NoteItemMenu";

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
    event.preventDefault();
    setIsExpanded((prev) => !prev);
    onExpand?.();
  };

  const onCreateChild = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    if (!document.id) return;

    const promise = createDocument({
      title: "Sem título",
      parentDocumentId: document.id,
    }).then((response) => {
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

  const onIconSelect = (icon: string) => {
    updateDocument(document.id, { icon });
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
        <div
          role="button"
          onClick={handleExpand}
          className="h-full rounded-sm hover:bg-white/10 mr-1 transition p-0.5 z-10"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-soft/50" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-soft/50" />
          )}
        </div>

        <div
          className="shrink-0 mr-2 z-20"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <IconPicker asChild onChange={onIconSelect}>
            <div className="hover:bg-white/10 rounded-sm p-0.5 transition cursor-pointer h-[20px] w-[20px] flex items-center justify-center">
              {document.icon ? (
                <span className="text-[16px]">{document.icon}</span>
              ) : (
                <FileText className="h-[16px] w-[16px] text-soft/50" />
              )}
            </div>
          </IconPicker>
        </div>

        <span className="truncate">{document.title}</span>

        <div className="flex items-center ml-auto opacity-0 group-hover:opacity-100 transition gap-x-1">
          <div
            role="button"
            onClick={onCreateChild}
            className="rounded-sm hover:bg-white/10 p-1 text-soft/50 hover:text-white"
          >
            <Plus className="h-4 w-4" />
          </div>

          <NoteItemMenu documentId={document.id} />
        </div>
      </Link>

      {isExpanded && (
        <div className="flex flex-col">
          {document.childDocuments?.map((child) => (
            <DocumentItem key={child.id} document={child} level={level + 1} />
          ))}
          {/* Só mostra "Vazio" se o array existir E tiver tamanho 0 */}
          {document.childDocuments && document.childDocuments.length === 0 && (
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
