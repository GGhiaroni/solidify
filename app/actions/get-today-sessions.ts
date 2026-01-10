"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export default async function getTodaysessions() {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.emailAddresses[0]) {
      return [];
    }

    const userEmail = clerkUser.emailAddresses[0].emailAddress;

    const dbUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!dbUser) return [];

    const startOfTheDay = new Date();
    startOfTheDay.setHours(0, 0, 0, 0);

    const endOfTheDay = new Date();
    endOfTheDay.setHours(23, 59, 59, 999);

    const studyDayLogs = await prisma.studySession.findMany({
      where: {
        userId: dbUser.id,
        createdAt: {
          gte: startOfTheDay,
          lte: endOfTheDay,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return studyDayLogs;
  } catch (error) {
    console.error("Erro ao buscar sessões.", error);
    return [];
  }
}
