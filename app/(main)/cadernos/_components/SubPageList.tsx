"use client";

import { Document } from "@prisma/client";
import { FileText } from "lucide-react";
import Link from "next/link";

interface SubPagesListProps {
  childrenDocs: Document[];
  parentDocumentId: string;
}

export const SubPagesList = ({ childrenDocs }: SubPagesListProps) => {
  if (!childrenDocs || childrenDocs.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 mb-8 mt-4">
      <h3 className="text-xs font-bold text-soft/50 uppercase tracking-widest mb-2 pl-1">
        Páginas neste caderno
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {childrenDocs.map((doc) => (
          <Link
            key={doc.id}
            href={`/cadernos/${doc.id}`}
            className="group flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-[#1c222b]/50 hover:bg-[#1c222b] hover:border-white/10 transition-all"
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
          </Link>
        ))}
      </div>
    </div>
  );
};
