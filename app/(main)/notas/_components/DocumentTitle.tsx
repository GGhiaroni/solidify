"use client";

import updateDocument from "@/app/actions/update-document";
import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface DocumentTitleProps {
  initialTitle: string;
  documentId: string;
}

export const DocumentTitle = ({
  initialTitle,
  documentId,
}: DocumentTitleProps) => {
  const [title, setTitle] = useState(initialTitle || "Sem título");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setTitle(value);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      save(value);
    }, 1000);
  };

  const save = (newTitle: string) => {
    updateDocument(documentId, { title: newTitle });
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      save(title);
    }
  };

  return (
    <TextareaAutosize
      value={title}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder="Sem título"
      className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold text-white outline-none font-serif tracking-tight placeholder:text-white/20"
      maxLength={60}
    />
  );
};
