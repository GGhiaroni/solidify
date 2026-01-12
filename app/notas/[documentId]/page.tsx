import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import NoteEditor from "../_components/NoteEditor";

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
    <div className="min-h-full px-10 dark:bg-[#0F1117]">
      <div className="w-full max-w-5xl px-12 pt-16 pb-20">
        <div className="group mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 outline-none font-serif tracking-tight">
            {result.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-soft/40 font-medium">
            <span>Editado por você hoje</span>
            <span className="w-1 h-1 rounded-full bg-soft/20" />
            <span>2 min de leitura</span>
          </div>
        </div>
        <div className="h-[1px] w-full bg-white/5 mb-8" />
        <NoteEditor initialContent={result.content || undefined} />
      </div>
    </div>
  );
}
