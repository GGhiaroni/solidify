"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteJourney(roadmapId: string) {
  try {
    await prisma.roadmap.delete({ where: { id: roadmapId } });

    revalidatePath("/minhas-jornadas");
  } catch (error) {}
}
