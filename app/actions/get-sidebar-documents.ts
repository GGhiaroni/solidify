"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getSidebarDocuments(parentDocumentId?: string) {
  const { userId } = await auth();

  if (!userId) return [];

  const documents = await prisma.document.findMany({
    where: {
      userId,
      parentDocumentId: parentDocumentId || null,
      isArchived: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      icon: true,
      parentDocumentId: true,
    },
  });

  return documents;
}
