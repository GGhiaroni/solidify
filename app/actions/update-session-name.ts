"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function updateSessionName(
  sessionId: string,
  newName: string
) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.emailAddresses[0]) {
      return { success: false, error: "Usuário não autenticado." };
    }

    const userEmail = clerkUser.emailAddresses[0].emailAddress;

    const result = await prisma.studySession.updateMany({
      where: {
        id: sessionId,
        user: {
          email: userEmail,
        },
      },
      data: { name: newName },
    });

    if (result.count === 0) {
      return {
        success: false,
        error:
          "Sessão não encontrada ou usuário sem permissão para fazer edição.",
      };
    }

    revalidatePath("/pomodoro");

    return { success: true };
  } catch (error) {
    console.error("Erro ao renomear sessão:", error);
    return { success: false };
  }
}
