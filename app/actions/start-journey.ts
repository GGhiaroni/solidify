"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { RoadmapStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export default async function startJourney(roadmapId: string) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.emailAddresses[0]) {
      return { success: false, error: "Usuário não autenticado." };
    }

    const userEmail = clerkUser.emailAddresses[0].emailAddress;

    const result = await prisma.roadmap.updateMany({
      where: {
        id: roadmapId,
        user: {
          email: userEmail,
        },
      },
      data: { status: RoadmapStatus.ACTIVE },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: "Jornada não encontrada ou sem permissão.",
      };
    }

    revalidatePath(`/minhas-jornadas/${roadmapId}`);

    //atualizo também a página inicial de jornadas;
    revalidatePath(`/minhas-jornadas`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao iniciar jornada.", error);
    return { success: false, error: "Erro ao iniciar jornada." };
  }
}
