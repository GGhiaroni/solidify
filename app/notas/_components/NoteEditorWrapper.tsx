"use client";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./NoteEditor"), {
  ssr: false,
});

interface EditorWrapperProps {
  initialContent?: string;
}

export default function EditorWrapper({ initialContent }: EditorWrapperProps) {
  return <Editor initialContent={initialContent} />;
}
