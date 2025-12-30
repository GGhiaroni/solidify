"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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

  //no caso de sucesso, salvo no banco de dados do supabase
  try {
    const fakeUserId = "id-temporario-fake-123";

    let user = await prisma.user.findUnique({
      where: { email: "dev@solidify.com" },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { email: "dev@solidify.com", name: "Dev Sênior", id: fakeUserId },
      });
    }

    await prisma.roadmap.create({
      data: {
        title: result.data.title,
        area: result.data.area,
        description: result.data.details,
        userId: user.id,
      },
    });

    revalidatePath("/minha-jornada");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar a jornada:", error);
    return { success: false, error: "Erro ao conectar com o banco de dados." };
  }
}
