"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getSidebarDocuments(parentDocumentId?: string) {
  const clerkUser = await currentUser();

  if (!clerkUser || !clerkUser.emailAddresses[0]) return [];

  const email = clerkUser.emailAddresses[0].emailAddress;
  const dbUser = await prisma.user.findUnique({ where: { email } });

  if (!dbUser) return [];

  const documents = await prisma.document.findMany({
    where: {
      userId: parentDocumentId ? undefined : dbUser.id,

      parentDocumentId: parentDocumentId || null,
      isArchived: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return documents;
}
