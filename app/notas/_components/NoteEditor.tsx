"use client";

import { PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

interface NoteEditorProps {
  onChange?: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

export default function NoteEditor({
  onChange,
  initialContent,
  editable = true,
}: NoteEditorProps) {
  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
  });

  return (
    <div className="-mx-[54px] my-4 bg-transparent">
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme="dark"
        onChange={() => {}}
      />
    </div>
  );
}
