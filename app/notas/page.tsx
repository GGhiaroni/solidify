"use client";

import { FileText } from "lucide-react";

export default function NotesPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4 text-center p-8 text-soft">
      <div className="bg-white/5 p-6 rounded-full ring-1 ring-white/10">
        <FileText size={48} className="text-soft" />
      </div>
      <h2 className="text-2xl font-bold text-light">Seu Espaço de Anotações</h2>
      <p className="max-w-md text-sm text-soft/60">
        Selecione uma nota na barra lateral ou crie uma nova para começar.
      </p>
    </div>
  );
}
