"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function deleteDocument(documentId: string) {
  const user = await currentUser();

  if (!user || !user.emailAddresses[0]) {
    return { success: false, error: "Usuário não autenticado." };
  }

  const userEmail = user.emailAddresses[0].emailAddress;

  try {
    const result = await prisma.document.deleteMany({
      where: {
        id: documentId,
        user: {
          email: userEmail,
        },
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: "Nota não encontrada ou usuário sem permissão.",
      };
    }
    revalidatePath("/cadernos");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar nota.", error);
    return { success: false, error: "Erro ao deletar nota." };
  }
}
