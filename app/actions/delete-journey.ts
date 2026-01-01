"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteJourney(roadmapId: string) {
  try {
    await prisma.roadmap.delete({ where: { id: roadmapId } });

    revalidatePath("/minhas-jornadas");
  } catch (error) {
    console.error("Erro ao deletar jornada.", error);
    return { success: false, error: "Erro ao excluir" };
  }

  redirect("/minhas-jornadas");
}
