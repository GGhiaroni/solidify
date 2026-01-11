import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import EditorWrapper from "../_components/NoteEditorWrapper";

interface NotePageProps {
  params: Promise<{ documentId: string }>;
}

export default async function NotePage({ params }: NotePageProps) {
  const { documentId } = await params;

  const clerkUser = await currentUser();

  if (!clerkUser || !clerkUser.emailAddresses[0]) {
    redirect("/sign-in");
  }

  const userEmail = clerkUser.emailAddresses[0].emailAddress;

  //utilizando aqui o findFirst para usar filtros completos além de apenas o id do documento
  const result = await prisma.document.findFirst({
    where: {
      id: documentId,
      user: {
        email: userEmail,
      },
    },
  });

  if (!result) {
    redirect("/notas");
  }

  return (
    <div className="min-h-full">
      <div className="md:max-w-3xl lg:max-w-4xl px-10 pt-10">
        <div className="text-5xl font-bold text-white mb-4 break-words outline-none">
          {result.title}
        </div>

        <div className="text-sm text-soft/40 mb-8">Editado recentemente</div>

        <EditorWrapper initialContent={result.content || undefined} />
      </div>
    </div>
  );
}
