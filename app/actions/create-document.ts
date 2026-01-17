"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface CreateDocumentProps {
  title?: string;
  parentDocumentId?: string;
  roadmapId?: string;
}

export async function createDocument({
  title,
  roadmapId,
  parentDocumentId,
}: CreateDocumentProps) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.emailAddresses[0]) {
      return { success: false, error: "Usuário não autenticado." };
    }

    const userEmail = clerkUser.emailAddresses[0].emailAddress;

    const dbUser = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!dbUser) {
      return { success: false, error: "Usuário não encontrado no banco." };
    }

    const document = await prisma.document.create({
      data: {
        title: title || "Nota sem título",
        userId: dbUser.id,
        parentDocumentId: parentDocumentId || null,
        isArchived: false,
        roadmapId: roadmapId && roadmapId !== "none" ? roadmapId : null,
      },
    });

    revalidatePath("/cadernos", "layout");
    revalidatePath(`/cadernos/${parentDocumentId}`);

    return { success: true, document, documentId: document.id };
  } catch (error) {
    console.log("Erro ao criar nota:", error);
    return { success: false, error: "Erro interno" };
  }
}
