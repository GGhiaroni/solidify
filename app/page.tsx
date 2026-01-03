import { prisma } from "@/lib/prisma";
import { RoadmapStatus } from "@prisma/client";
import { format, subDays } from "date-fns";
import { BookOpen, Goal, Target, Trophy } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default async function Dashboard() {
  //a primeira coisa que vou fazer aqui é buscar o usuário e, posteriormente, incluir os roadmaps e steps
  const user = await prisma.user.findUnique({
    where: { email: "dev@solidify.com" },
    include: {
      roadmaps: {
        where: { status: RoadmapStatus.ACTIVE },
        include: { steps: true },
      },
      sessions: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const sessionsList = user?.sessions || [];

  const sessionsMap = sessionsList.reduce((acc, session) => {
    const date = session.createdAt.toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += session.duration;
    return acc;
  }, {} as Record<string, number>);

  const today = new Date();

  const days365 = Array.from({ length: 365 }).map((_, index) => {
    // Começa de 365 dias atrás até hoje
    const dateObj = subDays(today, 364 - index);
    const dateString = format(dateObj, "yyyy-MM-dd");

    // Pega o valor real do banco ou 0 se não tiver nada
    const count = sessionsMap[dateString] || 0;

    // Regra de Nível (Cores do GitHub Dark)
    let level = 0;
    if (count > 0) level = 1; // 1-29 min
    if (count >= 30) level = 2; // 30-59 min
    if (count >= 60) level = 3; // 60-119 min
    if (count >= 120) level = 4; // +2 horas

    return {
      date: dateString,
      count,
      level,
    };
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

    return `${titles.slice(0, 2).join(" | ")} e +${titles.length - 2}`;
  })();

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-light">Dashboard</h1>
          <p className="text-soft text-lg mb-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <MetricCard
          icon={<Target className="text-blue-500" />}
          title="Progresso geral"
          value={`${overallProgress}%`}
          subtext={`de ${totalStepsCount} passos ativos`}
          progress={overallProgress}
        />
        <MetricCard
          icon={<BookOpen className="text-purple-500" />}
          title="Jornadas Ativas"
          value={activeRoadmaps.length.toString()}
          subtext={formatedTitles}
        />
      </div>

      <section className="space-y-6">
        <h2 className="mt-8 text-2xl font-bold text-light italic">
          Jornadas ativas no momento
        </h2>
        {activeRoadmaps.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-soft/10 rounded-3xl bg-medium/5">
            <p className="text-soft text-lg">
              Nenhuma jornada ativa. Vá em Minhas Jornadas e inicie uma!
            </p>
          </div>
        ) : (
          <div className="bg-medium/20 border border-soft/10 p-8 rounded-3xl flex flex-col gap-4">
            {activeRoadmaps.map((roadmap) => {
              const totalSteps = roadmap.steps.length;
              const completedSteps = roadmap.steps.filter(
                (s) => s.isCompleted
              ).length;
              const progress =
                totalSteps > 0
                  ? Math.round((completedSteps / totalSteps) * 100)
                  : 0;

              return (
                <Link key={roadmap.id} href={`minhas-jornadas/${roadmap.id}`}>
                  <div className="bg-medium/20 border border-soft/10 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 hover:border-soft/30 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/10 text-2xl rounded-xl text-blue-500 group-hover:bg-blue-500/20 transition-colors">
                        🎯
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-light">
                          {roadmap.title}
                        </h3>
                        <p className="text-soft text-sm">
                          {roadmap.area} • {completedSteps}/{totalSteps} passos
                        </p>
                      </div>
                    </div>

                    <div className="w-full md:w-1/3 flex items-center gap-4">
                      <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 h-full transition-all duration-1000 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-light font-bold min-w-[3rem] text-right">
                        {progress}%
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-8 bg-medium/20 border border-soft/10 p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-light">Atividade de Estudo</h3>
          <span className="text-xs text-soft uppercase tracking-widest font-bold">
            Último ano
          </span>
        </div>

        <div className="w-full flex justify-center py-4 overflow-x-auto">
          {/* Componente do Tooltip Global */}
          <ReactTooltip
            id="activity-tooltip"
            style={{
              backgroundColor: "#000",
              color: "#fff",
              borderRadius: "8px",
            }}
          />

          <ActivityCalendar
            data={days365} // Agora usamos o array completo de 365 dias
            theme={{
              light: ["#e1e4e8", "#40c463", "#30a14e", "#216e39", "#216e39"],
              // 👇 CORES CORRIGIDAS (GitHub Dark Mode Padrão)
              // Level 0 (Fundo): #161b22
              // Level 4 (Mais intenso): #39d353 (Verde Neon Brilhante)
              dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
            }}
            labels={{
              legend: { less: "Menos", more: "Mais" },
              months: [
                "Jan",
                "Fev",
                "Mar",
                "Abr",
                "Mai",
                "Jun",
                "Jul",
                "Ago",
                "Set",
                "Out",
                "Nov",
                "Dez",
              ],
              totalCount: "{{count}} minutos em {{year}}",
            }}
            colorScheme="dark"
            blockSize={14}
            blockMargin={4}
            fontSize={12}
            // 👇 A MÁGICA DO TOOLTIP ACONTECE AQUI
            renderBlock={(block, activity) => {
              return React.cloneElement(block, {
                "data-tooltip-id": "activity-tooltip",
                "data-tooltip-content": `${activity.count} minutos em ${activity.date}`,
              });
            }}
          />
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
    <div className="bg-medium/30 border border-soft/10 flex flex-col gap-2 p-8 rounded-3xl space-y-4">
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
