import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

//preciso definir que os parâmetros da página são uma Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JourneyDetails({ params }: PageProps) {
  const { id } = await params;

  const roadmap = await prisma.roadmap.findUnique({
    where: { id },
    include: {
      steps: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!roadmap) {
    redirect("/minha-jornada");
  }

  const completedSteps = roadmap.steps.filter((s) => s.isCompleted).length;
  const totalSteps = roadmap.steps.length;
  const progress =
    totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="max-w-4-xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <Link
        href="minha-jornada"
        className="inline-flex items-center text-soft hover:text-light transition-colors mb-4"
      >
        <ArrowLeft size={16} className="mr-2" />
        Voltar para minhas jornadas
      </Link>
    </div>
  );
}
