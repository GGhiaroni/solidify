import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "dev@solidify.com" },
  });

  if (!user) {
    console.error(
      "Usuário não encontrado. Crie um usuário antes de tentar o seed"
    );
    return;
  }

  console.log(`Inserindo dados para o usuário: ${user.name || user.email}...`);

  const sessionsToCreate = [
    {
      userId: user.id,
      duration: 30,
      createdAt: new Date("2025-12-28T10:00:00Z"),
    },
    {
      userId: user.id,
      duration: 30,
      createdAt: new Date("2025-12-29T09:00:00Z"),
    },
    {
      userId: user.id,
      duration: 45,
      createdAt: new Date("2025-12-29T16:00:00Z"),
    },
    {
      userId: user.id,
      duration: 180,
      createdAt: new Date("2026-01-02T14:00:00Z"),
    },
    { userId: user.id, duration: 25, createdAt: new Date() },
  ];

  for (const session of sessionsToCreate) {
    await prisma.studySession.create({
      data: session,
    });
  }
  console.log("✅ Dados inseridos com sucesso! Pode atualizar o Dashboard.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
