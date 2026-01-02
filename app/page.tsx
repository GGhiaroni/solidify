import { prisma } from "@/lib/prisma";
import { RoadmapStatus } from "@prisma/client";
import { BookOpen, Goal, Target, Trophy } from "lucide-react";
import React from "react";

export default async function Dashboard() {
  //a primeira coisa que vou fazer aqui é buscar o usuário e, posteriormente, incluir os roadmaps e steps
  const user = await prisma.user.findUnique({
    where: { email: "dev@solidify.com" },
    include: {
      roadmaps: {
        where: { status: RoadmapStatus.ACTIVE },
        include: { steps: true },
      },
    },
  });

  const activeRoadmaps = user?.roadmaps || [];

  const allStepsArray = activeRoadmaps.flatMap((roadmap) => roadmap.steps);
  const totalStepsCount = allStepsArray.length;
  const completedStepsCount = allStepsArray.filter(
    (step) => step.isCompleted
  ).length;

  const totalXpAvailable = totalStepsCount * 100;
  const currentXp = completedStepsCount * 100;
  const overallProgress =
    totalStepsCount > 0
      ? Math.round((completedStepsCount / totalStepsCount) * 100)
      : 0;

  const formatedTitles = (() => {
    const titles = activeRoadmaps.map((aR) => aR.title);

    if (titles.length <= 2) return titles.join(" | ");

    return `${titles.slice(0, 2).join(" | ")} e +${titles.length - 2}}`;
  })();

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-light">Dashboard</h1>
          <p className="text-soft text-lg">
            Consolidando seu futuro, um passo de cada vez. 💆🏻‍♂️🍃
          </p>
        </div>

        <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 px-6 py-3 rounded-2xl">
          🔥
          <div>
            <p className="text-xs text-orange-500/70 font-bold uppercase tracking-widest">
              Streak Atual
            </p>
            <p className="text-2xl font-black text-orange-500">0 Dias</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex gap-4">
          <MetricCard
            icon={<Goal className="text-yellow-500" />}
            title="xp total disponível"
            value={`${totalXpAvailable} XP`}
            subtext={`De ${activeRoadmaps.length} jornadas ativas`}
          />
          <MetricCard
            icon={<Trophy className="text-yellow-500" />}
            title="xp atual"
            value={`${currentXp} XP`}
            subtext={`${completedStepsCount} passos concluídos`}
          />
        </div>
        <div className="flex gap-4">
          <MetricCard
            icon={<Target className="text-blue-500" />}
            title="Progresso geral"
            value={`${overallProgress}%`}
            progress={overallProgress}
          />
          <MetricCard
            icon={<BookOpen className="text-purple-500" />}
            title="Jornadas Ativas"
            value={activeRoadmaps.length.toString()}
            subtext={formatedTitles}
          />
        </div>
      </div>

      <section className="space-y-6">
        <h2 className="mt-8 text-2xl font-bold text-light italic">
          Continuar de onde parei
        </h2>

        {activeRoadmaps.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-soft/10 rounded-3xl bg-medium/5">
            <p className="text-soft text-lg">
              Nenhuma jornada ativa. Vá em Minhas Jornadas e inicie uma!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"></div>
        )}
      </section>

      <section className="bg-medium/20 border border-soft/10 p-8 rounded-3xl">
        <h3 className="text-xl font-bold text-light mb-6">
          Atividade de Estudo
        </h3>
        <div className="h-40 flex items-center justify-center border border-dashed border-soft/20 rounded-xl">
          <p className="text-soft/40 italic">
            O Heatmap do GitHub será renderizado aqui...
          </p>
        </div>
      </section>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  value: string | number;
  subtext?: string;
  progress?: number;
}

// Subcomponente auxiliar para organizar o layout dos cards de métricas
function MetricCard({
  icon,
  title,
  value,
  subtext,
  progress,
}: MetricCardProps) {
  return (
    <div className="bg-medium/30 border border-soft/10 p-8 rounded-3xl space-y-4">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-soft font-bold uppercase text-sm tracking-tighter">
          {title}
        </span>
      </div>
      <div className="text-3xl font-black text-light">{value}</div>
      {subtext && <p className="text-soft/60 text-sm">{subtext}</p>}
      {progress !== undefined && (
        <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
