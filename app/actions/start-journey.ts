"use server";

import { prisma } from "@/lib/prisma";
import { RoadmapStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export default async function startJourney(roadmapId: string) {
  try {
    await prisma.roadmap.update({
      where: { id: roadmapId },
      data: { status: RoadmapStatus.ACTIVE },
    });

    revalidatePath(`/minhas-jornadas/${roadmapId}`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao iniciar jornada.", error);
    return { success: false, error: "Erro ao iniciar jornada." };
  }
}
