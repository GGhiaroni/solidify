import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Cover } from "../_components/Cover";
import { DocumentTitle } from "../_components/DocumentTitle";
import EditorWrapper from "../_components/NoteEditorWrapper";
import { Toolbar } from "../_components/Toolbar";

interface NotePageProps {
  params: Promise<{ documentId: string }>;
}

export default async function NotePage({ params }: NotePageProps) {
  const { documentId } = await params;
  const clerkUser = await currentUser();

  if (!clerkUser?.emailAddresses[0]) redirect("/sign-in");
  const userEmail = clerkUser.emailAddresses[0].emailAddress;

  const result = await prisma.document.findFirst({
    where: {
      id: documentId,
      user: { email: userEmail },
    },
  });

  if (!result) redirect("/notas");

  return (
    <div className="min-h-full px-10 dark:bg-[#0F1117]">
      <Cover url={result.coverImage} />
      <div className="w-full max-w-6xl px-12 pt-16 pb-20">
        <div className="group mb-8">
          <Toolbar initialData={result} />

          <DocumentTitle initialTitle={result.title} documentId={result.id} />

          <div className="flex items-center gap-4 text-xs text-soft/40 font-medium mt-4">
            <span>Editado por você hoje</span>
            <span className="w-1 h-1 rounded-full bg-soft/20" />
            <span>2 min de leitura</span>
          </div>
        </div>

        <div className="h-[1px] w-full bg-white/5 mb-4" />

        <EditorWrapper
          initialContent={result.content || undefined}
          documentId={result.id}
        />
      </div>
    </div>
  );
}
