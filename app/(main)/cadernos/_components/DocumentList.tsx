"use client";

import { createDocument } from "@/app/actions/create-document";
import { getSidebarDocuments } from "@/app/actions/get-sidebar-documents";
import { cn } from "@/lib/utils";
import { Document } from "@prisma/client";
import { ChevronRight, FileText, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface DocumentListProps {
  parentDocumentId?: string;
  level?: number;
  initialData?: Document[];
}

export const DocumentList = ({
  parentDocumentId,
  level = 0,
  initialData,
}: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();

  const [fetchedDocuments, setFetchedDocuments] = useState<Document[]>([]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [reloads, setReloads] = useState<Record<string, number>>({});

  const documents = initialData || fetchedDocuments;

  const onExpand = (e: React.MouseEvent, documentId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setExpanded((prev) => ({ ...prev, [documentId]: !prev[documentId] }));
  };

  const onCreate = (e: React.MouseEvent, documentId: string) => {
    e.stopPropagation();
    e.preventDefault();

    if (!expanded[documentId]) {
      setExpanded((prev) => ({ ...prev, [documentId]: true }));
    }

    const promise = createDocument({ parentDocumentId: documentId }).then(
      (res) => {
        if (res.success && res.documentId) {
          setReloads((prev) => ({
            ...prev,
            [documentId]: (prev[documentId] || 0) + 1,
          }));

          router.refresh();
          router.push(`/cadernos/${res.documentId}`);
        } else {
          throw new Error(res.error);
        }
      },
    );

    toast.promise(promise, {
      pending: "Criando nota...",
      success: "Nova nota criada!",
      error: "Erro ao criar nota.",
    });
  };

  useEffect(() => {
    if (initialData) return;

    const fetchDocs = async () => {
      try {
        const data = await getSidebarDocuments(parentDocumentId);
        setFetchedDocuments(data as Document[]);
      } catch (error) {
        console.error("Erro ao buscar documentos:", error);
      }
    };

    fetchDocs();
  }, [parentDocumentId, initialData]);

  const onRedirect = (documentId: string) => {
    router.push(`/cadernos/${documentId}`);
  };

  if (!documents) return null;

  return (
    <>
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className={cn(
          "hidden text-sm font-medium text-soft/40 last:block",
          expanded && "last:block",
          level === 0 && "hidden",
        )}
      >
        Vazio
      </p>

      {documents.map((doc) => (
        <div key={doc.id}>
          <div
            style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
            onClick={() => onRedirect(doc.id)}
            className={cn(
              "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-white/5 flex items-center text-soft font-medium transition-colors cursor-pointer justify-between",
              params.documentId === doc.id && "bg-blue-500/10 text-blue-400",
            )}
          >
            <div className="flex items-center gap-1 overflow-hidden">
              <div
                role="button"
                className="h-full rounded-sm hover:bg-white/10 p-0.5"
                onClick={(e) => onExpand(e, doc.id)}
              >
                <ChevronRight
                  className={cn(
                    "h-4 w-4 shrink-0 text-soft/50 transition-transform duration-200",
                    expanded[doc.id] && "rotate-90",
                  )}
                />
              </div>

              <div className="flex items-center gap-2 truncate">
                {doc.icon ? (
                  <span className="text-[15px]">{doc.icon}</span>
                ) : (
                  <FileText className="h-[18px] w-[18px] mr-1 text-soft/60 shrink-0" />
                )}
                <span className="truncate">{doc.title}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div
                role="button"
                onClick={(e) => onCreate(e, doc.id)}
                className="opacity-0 group-hover:opacity-100 h-full rounded-sm hover:bg-white/10 p-1 text-soft/50 hover:text-white transition"
                title="Criar página dentro"
              >
                <Plus size={14} />
              </div>
            </div>
          </div>

          {expanded[doc.id] && (
            <DocumentList
              key={`${doc.id}-${reloads[doc.id] || 0}`}
              parentDocumentId={doc.id}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </>
  );
};
