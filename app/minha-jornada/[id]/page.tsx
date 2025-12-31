import { prisma } from "@/lib/prisma";
import { ArrowLeft, BookOpen, CheckCircle2, Circle, Clock } from "lucide-react";
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

      <header className="bg-medium/30 border border-soft/10 p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-soft/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-soft/20 text-soft text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {roadmap.area}
            </span>
            <span className="text-soft/60 text-sm flex items-center gap-2">
              <Clock size={14} />
              {totalSteps} passos
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-light mb-4">
            {roadmap.title}
          </h1>

          <p className="text-light/80 text-lg leading-relaxed max-w-2xl">
            {roadmap.description ||
              "Sua trilha personalizada rumo à senioridade."}
          </p>

          <div className="mt-8">
            <div className="flex justify-between text-sm mb-2 text-soft">
              <span>Progresso geral</span>
              <span className="font-bold text-light">{progress}%</span>
            </div>
            <div className="h-2 w-full bg-primary rounded-full overflow-hidden border border-soft/10">
              <div
                className="h-full bg-soft transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-light flex items-center gap-2">
          <BookOpen size={24} className="text-soft" />
          Seu roteiro de estudos
        </h2>

        <div className="grid gap-4">
          {roadmap.steps.map((step) => (
            <div
              key={step.id}
              className={`
                group p-6 rounded-xl border transition-all duration-300 relative overflow-hidden
                ${
                  step.isCompleted
                    ? "bg-soft/10 border-soft/30 opacity-70"
                    : "bg-medium/20 border-soft/10 hover:border-soft/30 hover:bg-medium/30"
                }
              `}
            >
              <div className="flex gap-4">
                <div className="mt-1">
                  {step.isCompleted ? (
                    <CheckCircle2 className="text-soft w-6 h-6" />
                  ) : (
                    <Circle className="text-soft/40 w-6 h-6 group-hover:text-soft transition-colors" />
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-xl font-semibold mb-2 ${
                      step.isCompleted ? "text-soft line-through" : "text-light"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-soft/80 leading-relaxed text-sm md:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
