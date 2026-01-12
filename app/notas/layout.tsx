import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import NoteSidebar from "./_components/NoteSidebar";

export default async function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user || !user.emailAddresses[0]) {
    redirect("/sign-in");
  }

  const email = user.emailAddresses[0].emailAddress;

  const dbUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!dbUser) {
    redirect("/");
  }

  const documents = await prisma.document.findMany({
    where: {
      userId: dbUser.id,
      parentDocumentId: null,
      isArchived: false,
    },
    include: {
      childDocuments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const roadmaps = await prisma.roadmap.findMany({
    where: {
      userId: dbUser.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <NoteSidebar documents={documents} userRoadmaps={roadmaps} />
      <main className="flex-1 h-full overflow-y-auto">{children}</main>
    </div>
  );
}
