"use client";

import { cn } from "@/lib/utils";
import { Document } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface DocumentCardProps {
  document: Document;
  index: number;
}

const COLORS = [
  "bg-rose-200 text-rose-900 hover:bg-rose-300",
  "bg-amber-200 text-amber-900 hover:bg-amber-300",
  "bg-emerald-200 text-emerald-900 hover:bg-emerald-300",
  "bg-sky-200 text-sky-900 hover:bg-sky-300",
  "bg-violet-200 text-violet-900 hover:bg-violet-300",
  "bg-orange-200 text-orange-900 hover:bg-orange-300",
];

export default function DocumentCard({ document, index }: DocumentCardProps) {
  const colorClass = COLORS[index % COLORS.length];

  return (
    <Link
      href={`/cadernos/${document.id}`}
      className={cn(
        "group relative flex flex-col justify-between h-[200px] w-full rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        colorClass
      )}
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="bg-white/30 p-2 rounded-full w-fit">
            <span className="text-2xl">{document.icon || "📄"}</span>
          </div>

          <span className="text-xs font-medium opacity-60 bg-black/5 px-2 py-1 rounded-full">
            {formatDistanceToNow(new Date(document.createdAt), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </div>

        <h3 className="font-serif text-2xl font-bold line-clamp-2 leading-tight">
          {document.title}
        </h3>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex -space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs font-medium opacity-50">Abrir caderno</span>
        </div>

        <div className="bg-black/10 p-2 rounded-full group-hover:bg-black/20 transition">
          <ArrowRight size={18} />
        </div>
      </div>
    </Link>
  );
}
