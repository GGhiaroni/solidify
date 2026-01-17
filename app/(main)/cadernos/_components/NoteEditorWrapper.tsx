"use client";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./NoteEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[70vh] w-full animate-pulse bg-white/[0.02] rounded-xl" />
  ),
});

interface EditorWrapperProps {
  initialContent?: string;
  documentId: string;
  editable?: boolean;
}

export default function EditorWrapper({
  initialContent,
  documentId,
  editable,
}: EditorWrapperProps) {
  return (
    <Editor
      initialContent={initialContent}
      documentId={documentId}
      editable={editable}
    />
  );
}
