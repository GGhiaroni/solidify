"use client";

import { updateDocumentContent } from "@/app/actions/update-document-content";
import { PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { Cloud, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface EditorProps {
  initialContent?: string;
  documentId: string;
  editable?: boolean;
}

export default function NoteEditor({
  initialContent,
  documentId,
  editable = true,
}: EditorProps) {
  const [status, setStatus] = useState<"saved" | "saving" | "error">("saved");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
  });

  const handleSave = async () => {
    if (!editor) return;

    const content = JSON.stringify(editor.document);
    setStatus("saving");

    const response = await updateDocumentContent(documentId, content);

    if (response.success) {
      setStatus("saved");
    } else {
      setStatus("error");
      toast.error("Erro ao salvar automaticamente.");
    }
  };

  const onChange = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      handleSave();
    }, 1500);
  };

  useEffect(() => {
    if (editor && editable) {
      const timeout = setTimeout(() => {
        editor.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [editor, editable]);

  if (!editor) return null;

  return (
    <div className="w-full max-w-full ml-4 pl-4 relative group">
      <div
        className="min-h-[70vh] w-full cursor-text"
        onClick={() => editor.focus()}
      >
        <BlockNoteView
          editor={editor}
          editable={editable}
          theme="dark"
          onChange={onChange}
          className="min-h-full w-full"
        />
      </div>

      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1F1F1F] border border-white/5 text-xs font-medium text-soft shadow-xl transition-all opacity-0 group-hover:opacity-100 duration-500 pointer-events-none">
        {status === "saved" && (
          <>
            <Cloud size={14} className="text-emerald-500" />
            <span className="text-emerald-500/80">Salvo</span>
          </>
        )}
        {status === "saving" && (
          <>
            <Loader2 size={14} className="animate-spin text-blue-400" />
            <span className="text-blue-400">Salvando...</span>
          </>
        )}
        {status === "error" && (
          <span className="text-red-400">Erro ao salvar</span>
        )}
      </div>
    </div>
  );
}
