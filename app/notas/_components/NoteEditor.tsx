"use client";

import { PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect } from "react";

interface EditorProps {
  onChange?: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

export default function NoteEditor({
  onChange,
  initialContent,
  editable = true,
}: EditorProps) {
  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
  });

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
    <div className="w-full max-w-full ml-4 pl-4">
      <div
        className="
          min-h-[70vh] 
          w-full 
          /* 👇 REMOVIDO: Bordas, cores de fundo e efeitos de hover. */
          /* O Notion é limpo, apenas o texto importa. */
          cursor-text
        "
        onClick={() => editor.focus()}
      >
        <BlockNoteView
          editor={editor}
          editable={editable}
          theme="dark"
          onChange={() => {
            // onChange logic
          }}
          className="min-h-full w-full"
        />
      </div>
    </div>
  );
}
