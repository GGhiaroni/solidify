"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface UpdateDocumentDataProps {
  icon?: string;
  title?: string;
  coverImage?: string;
  isArchived?: boolean;
}

export default async function updateDocument(
  documentId: string,
  data: UpdateDocumentDataProps
) {
  const clerkUser = await currentUser();

  if (!clerkUser || !clerkUser.emailAddresses[0]) {
    return { success: false, error: "Usuário não autenticado." };
  }

  const userEmail = clerkUser.emailAddresses[0].emailAddress;

  try {
    const result = await prisma.document.updateMany({
      where: {
        id: documentId,
        user: {
          email: userEmail,
        },
      },
      data: {
        ...data,
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: "Caderno não encontrado ou permissão negada.",
      };
    }

    revalidatePath("/notas");
    revalidatePath(`/notas/${documentId}`);

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar documento:", error);
    return { success: false, error: "Erro ao atualizar" };
  }
}
