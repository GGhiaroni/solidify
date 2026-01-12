"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function updateDocumentContent(
  documentId: string,
  content: string
) {
  const clerkUser = await currentUser();

  if (!clerkUser || !clerkUser.emailAddresses[0]) {
    return { success: false, error: "Usuário não autenticado." };
  }

  const userEmail = clerkUser?.emailAddresses[0].emailAddress;

  try {
    await prisma.document.updateMany({
      where: {
        id: documentId,
        user: {
          email: userEmail,
        },
      },
      data: {
        content: content,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar o conteúdo da nota.", error);
    return { success: false, error: "Erro ao salvar nota no banco." };
  }
}
