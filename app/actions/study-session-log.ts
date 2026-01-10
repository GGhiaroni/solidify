"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface StudySessionLogProps {
  minutes: number;
  date: Date;
}

export async function studySessionLog({ minutes, date }: StudySessionLogProps) {
  const clerkUser = await currentUser();

  if (!clerkUser || !clerkUser.emailAddresses[0]) {
    return { success: false, error: "Usuário não autenticado." };
  }

  const userEmail = clerkUser.emailAddresses[0].emailAddress;

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) return { success: false, error: "Usuário não encontrado" };

    const studySessionCreated = await prisma.studySession.create({
      data: {
        userId: user.id,
        duration: minutes,
        createdAt: date,
      },
    });

    revalidatePath("/");

    return { success: true, session: studySessionCreated };
  } catch (error) {
    console.error("Erro ao registrar sessão de estudos.", error);
    return { success: false, error: "Erro ao registrar sessão de estudos." };
  }
}
