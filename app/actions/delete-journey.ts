"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteJourney(roadmapId: string) {
  const user = await currentUser();

  if (!user || !user.emailAddresses[0]) {
    return { success: false, error: "Usuário não autenticado." };
  }

  const userEmail = user.emailAddresses[0].emailAddress;

  try {
    const result = await prisma.roadmap.deleteMany({
      where: {
        id: roadmapId,
        user: {
          email: userEmail,
        },
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: "Jornada não encontrada ou sem permissão.",
      };
    }

    revalidatePath("/minhas-jornadas");
  } catch (error) {
    console.error("Erro ao deletar jornada.", error);
    return { success: false, error: "Erro ao excluir" };
  }

  redirect("/minhas-jornadas");
}
