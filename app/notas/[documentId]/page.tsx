import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-4">{result.title}</h1>
      <p className="text-soft text-sm">ID: {result.id}</p>
    </div>
  );
}
