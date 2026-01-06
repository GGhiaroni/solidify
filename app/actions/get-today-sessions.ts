import { prisma } from "@/lib/prisma";

export default async function getTodaysessions() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "dev@solidify.com" },
    });

    if (!user) return [];

    const startOfTheDay = new Date();
    startOfTheDay.setHours(0, 0, 0, 0);

    const endOfTheDay = new Date();
    endOfTheDay.setHours(23, 59, 59, 999);

    const studyDayLogs = await prisma.studySession.findMany({
      where: {
        userId: user.id,
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
