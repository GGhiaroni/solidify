"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleStepStatus(
  stepId: string,
  isCompleted: boolean,
  roadmapId: string
) {
  try {
    await prisma.roadmapStep.update({
      where: { id: stepId },
      data: { isCompleted },
    });

    //caso eu consiga atualizar, já vou revalidar o cachê,
    // forçando o Next.js a recalcular a barra de progresso.
    revalidatePath(`/minhas-jornadas/${roadmapId}`);

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar este passo:", error);
    return { success: false, error: "Erro ao atualizar status no banco." };
  }
}
