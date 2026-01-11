"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function toggleStepStatus(
  stepId: string,
  isCompleted: boolean,
  roadmapId: string
) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.emailAddresses[0]) {
      return { success: false, error: "Usuário não autenticado." };
    }

    const userEmail = clerkUser.emailAddresses[0].emailAddress;

    const result = await prisma.roadmapStep.updateMany({
      where: {
        id: stepId,
        roadmap: {
          user: {
            email: userEmail,
          },
        },
      },
      data: { isCompleted },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: "Passo não encontrado ou sem permissão.",
      };
    }

    //caso eu consiga atualizar, já vou revalidar o cachê,
    // forçando o Next.js a recalcular a barra de progresso.
    revalidatePath(`/minhas-jornadas/${roadmapId}`);

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar este passo:", error);
    return { success: false, error: "Erro ao atualizar status no banco." };
  }
}
