"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function deleteSubPageNote(subpageId: string) {
  const clerkUser = await currentUser();

  if (!clerkUser || !clerkUser.emailAddresses[0]) {
    return { success: false, error: "Usuário não autenticado." };
  }

  const email = clerkUser.emailAddresses[0].emailAddress;

  try {
    const result = await prisma.document.deleteMany({
      where: {
        id: subpageId,
        user: {
          email: email,
        },
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: "Nota não encontrada ou usuário sem permissão.",
      };
    }
    revalidatePath("/cadernos", "layout");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar nota.", error);
    return { success: false, error: "Erro ao deletar nota." };
  }
}
