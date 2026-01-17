"use client";

import { Document as Note, Roadmap } from "@prisma/client";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import CreateDocumentDialog from "./CreateDocumentDialog";
import { DocumentList } from "./DocumentList";

interface NoteSidebarProps {
  documents: Note[];
  userRoadmaps: Roadmap[];
}

export default function NoteSidebar({
  documents,
  userRoadmaps,
}: NoteSidebarProps) {
  const pathName = usePathname();

  return (
    <aside className="group/sidebar h-full bg-medium/50 overflow-y-auto relative w-60 flex flex-col z-[99999] border-r border-white/5">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-soft uppercase tracking-wider">
            Seus Cadernos
          </h2>
          <CreateDocumentDialog userRoadmaps={userRoadmaps}>
            <button className="hover:cursor-pointer text-soft hover:text-white hover:bg-white/10 p-1 rounded-sm transition">
              <Plus size={16} />
            </button>
          </CreateDocumentDialog>
        </div>

        <CreateDocumentDialog userRoadmaps={userRoadmaps}>
          <button className="hover:cursor-pointer w-full flex items-center gap-2 text-sm text-soft hover:text-white hover:bg-white/5 p-2 rounded-lg transition-colors group mb-4 border border-dashed border-white/10 hover:border-white/20">
            <div className="bg-blue-500/10 p-1 rounded-md group-hover:bg-blue-500/20 transition">
              <Plus size={14} className="text-blue-500" />
            </div>
            <span className="font-medium">Novo caderno</span>
          </button>
        </CreateDocumentDialog>
      </div>

      <div className="flex flex-col px-2 pb-4 space-y-1">
        {documents.length === 0 && (
          <div className="text-center py-10 px-4">
            <p className="text-xs text-soft/40">Nenhum caderno criado.</p>
          </div>
        )}

        <DocumentList initialData={documents} />
      </div>
    </aside>
  );
}
