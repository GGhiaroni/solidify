"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function updateSessionName(
  sessionId: string,
  newName: string
) {
  try {
    await prisma.studySession.update({
      where: { id: sessionId },
      data: { name: newName },
    });

    revalidatePath("/pomodoro");

    return { success: true };
  } catch (error) {
    console.error("Erro ao renomear sessão:", error);
    return { success: false };
  }
}
