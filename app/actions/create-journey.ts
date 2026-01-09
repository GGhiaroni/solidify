"use server";

import { generateRoadmapContent } from "@/lib/ai";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

interface AIStep {
  title: string;
  description: string;
}

//schema de validação
const createJourneySchema = z.object({
  title: z.string().min(3, "O título precisa ter, pelo menos, 3 caracteres."),
  area: z.string().min(2, "A área precisa ter, pelo menos, 2 caracteres."),
  details: z.string().optional(),
});

export async function createJourney(formData: FormData) {
  //transformando o FormData num objeto simples
  const rawData = {
    title: formData.get("title"),
    area: formData.get("area"),
    details: formData.get("details"),
  };

  //Valido aqui os dados, conforme meu schema definido
  const result = createJourneySchema.safeParse(rawData);

  //no caso de erro, emito um alerta
  if (!result.success)
    return { success: false, error: "Dados inválidos. Verifique os campos." };

  const clerkUser = await currentUser();

  if (!clerkUser || !clerkUser.emailAddresses[0]) {
    return { success: false, error: "Usuário não autenticado." };
  }

  const userEmail = clerkUser.emailAddresses[0].emailAddress;

  try {
    let dbUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: userEmail,
          name: `${clerkUser.firstName || "Usuário"} ${
            clerkUser.lastName || ""
          }`.trim(),
        },
      });
    }

    const roadmap = await prisma.roadmap.create({
      data: {
        title: result.data.title,
        area: result.data.area,
        description: result.data.details,
        userId: dbUser.id,
      },
    });

    const aiSteps = await generateRoadmapContent(
      result.data.title,
      result.data.area
    );

    if (aiSteps && Array.isArray(aiSteps)) {
      const stepsData = aiSteps.map((step: AIStep, index: number) => ({
        title: step.title,
        description: step.description,
        order: index + 1,
        roadmapId: roadmap.id,
      }));

      await prisma.roadmapStep.createMany({
        data: stepsData,
      });
    }

    revalidatePath("/minhas-jornadas");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar a jornada:", error);
    return { success: false, error: "Erro ao conectar com o banco de dados." };
  }
}
