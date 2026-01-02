import { prisma } from "@/lib/prisma";
import { RoadmapStatus } from "@prisma/client";
import { Flame, Target, Trophy } from "lucide-react";

export default async function Dashboard() {
  //a primeira coisa que vou fazer aqui é buscar o usuário e, posteriormente, incluir os roadmaps e steps
  try {
    const user = await prisma.user.findUnique({
      where: { email: "dev@solidify.com" },
      include: {
        roadmaps: {
          where: { status: RoadmapStatus.ACTIVE },
          include: { steps: true },
        },
      },
    });
  } catch (error) {}

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* HEADER COM STREAK */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-light">Dashboard</h1>
          <p className="text-soft text-lg">
            Consolidando seu futuro, um passo por vez.
          </p>
        </div>

        {/* INDICADOR DE STREAK (Lógica do Ticket 03 entrará aqui depois) */}
        <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 px-6 py-3 rounded-2xl">
          <Flame className="text-orange-500 animate-pulse" size={28} />
          <div>
            <p className="text-xs text-orange-500/70 font-bold uppercase tracking-widest">
              Streak Atual
            </p>
            <p className="text-2xl font-black text-orange-500">0 Dias</p>
          </div>
        </div>
      </header>

      {/* CARDS DE MÉTRICAS GLOBAIS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          icon={<Trophy className="text-yellow-500" />}
          title="XP Total"
          value={`${totalXP} XP`}
          subtext={`${completedStepsCount} passos concluídos`}
        />
        <MetricCard
          icon={<Target className="text-blue-500" />}
          title="Progresso Global"
          value={`${globalPercent}%`}
          progress={globalPercent}
        />
        <MetricCard
          icon={<BookOpen className="text-purple-500" />}
          title="Jornadas Ativas"
          value={activeRoadmaps.length.toString()}
          subtext="Foco total nestas trilhas"
        />
      </div>

      {/* SEÇÃO DE JORNADAS ATIVAS (REUTILIZE SEU LAYOUT DE CARDS) */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-light italic">
          Continuar de onde parei
        </h2>

        {activeRoadmaps.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-soft/10 rounded-3xl bg-medium/5">
            <p className="text-soft text-lg">
              Nenhuma jornada ativa. Vá em "Minhas Jornadas" e inicie uma!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Renderize aqui os cards das jornadas ativas */}
          </div>
        )}
      </section>

      {/* ESPAÇO PARA O HEATMAP (TICKET 02) */}
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

// Subcomponente auxiliar para organizar o layout dos cards de métricas
function MetricCard({ icon, title, value, subtext, progress }: any) {
  return (
    <div className="bg-medium/30 border border-soft/10 p-8 rounded-3xl space-y-4">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-soft font-bold uppercase text-xs tracking-tighter">
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
