"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

const limit = 0;

export default async function getDocuments(offset = 0) {
  const clerkUser = await currentUser();

  if (!clerkUser || !clerkUser.emailAddresses[0]) {
    return { success: false, error: "Usuário não autenticado." };
  }

  const userEmail = clerkUser.emailAddresses[0].emailAddress;

  try {
    const result = await prisma.document.findMany({
      where: {
        user: {
          email: userEmail,
        },
        isArchived: false,
        parentDocument: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    });

    //verificando aqui se há mais cadernos para carregar além dos acima
    const totalCount = await prisma.document.count({
      where: {
        user: {
          email: userEmail,
        },
        isArchived: false,
        parentDocument: null,
      },
    });

    const hasMore = offset + result.length < totalCount;

    return { success: true, data: result, hasMore };
  } catch (error) {
    console.error("Erro ao buscar documentos:", error);
    return { success: false, error: "Erro ao buscar notas" };
  }
}
