"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface StudySessionLogProps {
  minutes: number;
  date: Date;
}

export async function studySessionLog({ minutes, date }: StudySessionLogProps) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "dev@solidify.com" },
    });

    if (!user) return { success: false, error: "Usuário não encontrado" };

    await prisma.studySession.create({
      data: {
        userId: user.id,
        duration: minutes,
        createdAt: date,
      },
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Erro ao registrar sessão de estudos.", error);
    return { success: false, error: "Erro ao registrar sessão de estudos." };
  }
}
