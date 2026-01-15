import { Heatmap } from "@/app/components/Heatmap";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { format, isAfter, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CalendarDays,
  Clock,
  Flame,
  History,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { redirect } from "next/navigation";

interface TimeCardProps {
  label: string;
  minutes: number;
  icon: React.ReactNode;
  trend: string;
}

interface InsightTileProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export default async function StudyTrackerPage() {
  const clerkUser = await currentUser();

  if (!clerkUser || !clerkUser.emailAddresses[0]) {
    redirect("/sign-in");
  }

  const userEmail = clerkUser.emailAddresses[0].emailAddress;

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      sessions: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) return <div>Usuário não encontrado.</div>;

  const sessions = user?.sessions || [];

  const getMinutesLastNDays = (days: number) => {
    const cutoffDate = subDays(new Date(), days);
    return sessions
      .filter((s) => isAfter(new Date(s.createdAt), cutoffDate))
      .reduce((acc, curr) => acc + curr.duration, 0);
  };

  const minutes7d = getMinutesLastNDays(7);
  const minutes15d = getMinutesLastNDays(15);
  const minutes30d = getMinutesLastNDays(30);
  const totalMinutesAllTime = sessions.reduce((acc, s) => acc + s.duration, 0);

  const avgSessionTime =
    sessions.length > 0 ? Math.round(totalMinutesAllTime / sessions.length) : 0;

  const longestSession =
    sessions.length > 0 ? Math.max(...sessions.map((s) => s.duration)) : 0;

  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  };

  const sessionsMap = sessions.reduce((acc, session) => {
    const date = session.createdAt.toISOString().split("T")[0];
    if (!acc[date]) acc[date] = 0;
    acc[date] += session.duration;
    return acc;
  }, {} as Record<string, number>);

  const today = new Date();
  const days365 = Array.from({ length: 365 }).map((_, index) => {
    const dateObj = subDays(today, 364 - index);
    const dateString = format(dateObj, "yyyy-MM-dd");
    const count = sessionsMap[dateString] || 0;

    let level = 0;
    if (count > 0) level = 1;
    if (count >= 30) level = 2;
    if (count >= 60) level = 3;
    if (count >= 120) level = 4;

    return { date: dateString, count, level };
  });

  return (
    <div className="p-8 space-y-8 pb-20 animate-in fade-in duration-700 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-light flex items-center gap-3">
          <History className="text-blue-500" /> Study Tracker
        </h1>
        <p className="text-soft text-lg mt-2">
          Métricas detalhadas da sua evolução temporal.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TimeCard
          label="Últimos 7 dias"
          minutes={minutes7d}
          icon={<CalendarDays className="text-emerald-400" />}
          trend="Curto prazo"
        />
        <TimeCard
          label="Últimos 15 dias"
          minutes={minutes15d}
          icon={<CalendarDays className="text-blue-400" />}
          trend="Médio prazo"
        />
        <TimeCard
          label="Últimos 30 dias"
          minutes={minutes30d}
          icon={<CalendarDays className="text-purple-400" />}
          trend="Longo prazo"
        />
      </div>

      <section className="bg-medium/20 border border-soft/10 p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Flame className="text-orange-500" size={24} />
            <h3 className="text-xl font-bold text-light">Consistência Anual</h3>
          </div>
          <span className="text-xs text-soft uppercase tracking-widest font-bold bg-white/5 px-3 py-1 rounded-full">
            {sessions.length} sessões totais
          </span>
        </div>

        <Heatmap data={days365} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InsightTile
          label="Tempo Total de Vida"
          value={formatDuration(totalMinutesAllTime)}
          icon={<Clock className="text-yellow-500" />}
        />
        <InsightTile
          label="Média por Sessão"
          value={formatDuration(avgSessionTime)}
          icon={<TrendingUp className="text-cyan-500" />}
        />
        <InsightTile
          label="Sessão Mais Longa"
          value={formatDuration(longestSession)}
          icon={<Trophy className="text-rose-500" />}
        />
        <InsightTile
          label="Última Sessão"
          value={
            sessions[0]
              ? format(new Date(sessions[0].createdAt), "dd 'de' MMM", {
                  locale: ptBR,
                })
              : "--"
          }
          icon={<History className="text-indigo-500" />}
        />
      </section>
    </div>
  );
}

function TimeCard({ label, minutes, icon, trend }: TimeCardProps) {
  const hours = (minutes / 60).toFixed(1);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-medium/40 to-medium/10 border border-soft/10 p-6 rounded-3xl group hover:border-soft/30 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-2xl">{icon}</div>
        <span className="text-xs font-bold uppercase tracking-wider text-soft/60 bg-black/20 px-2 py-1 rounded-lg">
          {trend}
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-soft text-sm font-medium">{label}</h3>
        <p className="text-4xl font-black text-light tracking-tight">
          {hours}
          <span className="text-lg text-soft/50 font-normal ml-1">h</span>
        </p>
      </div>

      <div className="mt-4 text-xs text-soft/50 font-medium">
        equivalente a {minutes} minutos
      </div>
    </div>
  );
}

function InsightTile({ label, value, icon }: InsightTileProps) {
  return (
    <div className="bg-medium/20 border border-soft/10 p-5 rounded-2xl flex items-center gap-4 hover:bg-medium/30 transition-colors">
      <div className="p-3 bg-black/20 rounded-xl">{icon}</div>
      <div>
        <p className="text-xs text-soft font-bold uppercase">{label}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
