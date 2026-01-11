"use client";

import { PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

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

  return (
    <div className="editor-wrapper w-full max-w-full">
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme="dark"
        onChange={() => {}}
        className="min-h-[80vh] pb-20 cursor-text"
      />
    </div>
  );
}
