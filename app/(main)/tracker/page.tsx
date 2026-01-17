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
  subtext?: string;
  icon: React.ReactNode;
}

const formatSmartTime = (totalMinutes: number) => {
  if (totalMinutes === 0) {
    return { value: "0", unit: "min", full: "0 min" };
  }

  if (totalMinutes < 60) {
    return {
      value: totalMinutes.toString(),
      unit: "min",
      full: `${totalMinutes} min`,
    };
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return {
      value: hours.toString(),
      unit: hours === 1 ? "hora" : "horas",
      full: `${hours}h`,
    };
  }

  return {
    value: `${hours}h ${minutes.toString().padStart(2, "0")}m`,
    unit: "",
    full: `${hours}h ${minutes}m`,
  };
};

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

  const formattedTotal = formatSmartTime(totalMinutesAllTime);
  const formattedAvg = formatSmartTime(avgSessionTime);
  const formattedLongest = formatSmartTime(longestSession);

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

      <section className="bg-[#161b22] border border-white/5 p-8 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Flame className="text-orange-500" size={24} />
            <h3 className="text-xl font-bold text-light">Consistência Anual</h3>
          </div>
          <span className="text-xs text-soft uppercase tracking-widest font-bold bg-white/5 px-3 py-1 rounded-full border border-white/5">
            {sessions.length} sessões totais
          </span>
        </div>

        <Heatmap data={days365} />
      </section>

      <section>
        <h3 className="text-xl font-bold text-light mb-6 flex items-center gap-2">
          <Trophy className="text-yellow-500" size={20} />
          Conquistas & Estatísticas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InsightTile
            label="Histórico total"
            value={formattedTotal.full}
            subtext="Minutos totais registrados"
            icon={<Clock className="text-yellow-500" />}
          />
          <InsightTile
            label="Média por Sessão"
            value={formattedAvg.full}
            subtext="Média de foco"
            icon={<TrendingUp className="text-cyan-500" />}
          />
          <InsightTile
            label="Sessão Mais Longa"
            value={formattedLongest.full}
            subtext="Seu recorde pessoal"
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
            subtext={
              sessions[0]
                ? format(new Date(sessions[0].createdAt), "HH:mm'h'", {
                    locale: ptBR,
                  })
                : "Sem dados"
            }
            icon={<History className="text-indigo-500" />}
          />
        </div>
      </section>
    </div>
  );
}

function TimeCard({ label, minutes, icon, trend }: TimeCardProps) {
  const { value, unit } = formatSmartTime(minutes);

  return (
    <div className="relative overflow-hidden bg-[#161b22] border border-white/5 p-6 rounded-3xl group hover:border-white/10 transition-all shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 group-hover:bg-blue-500/20 transition-colors">
            {icon}
          </div>
          <h3 className="text-soft text-sm font-semibold uppercase tracking-wide">
            {label}
          </h3>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 bg-white/5 px-2 py-1 rounded-md border border-white/5">
          {trend}
        </span>
      </div>

      <div className="flex items-baseline gap-1">
        <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          {value}
        </p>
        {unit && (
          <span className="text-xl text-soft/60 font-medium">{unit}</span>
        )}
      </div>

      <div className="mt-4 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full opacity-80"
          style={{ width: `${Math.min((minutes / 600) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}

function InsightTile({ label, value, subtext, icon }: InsightTileProps) {
  return (
    <div className="bg-[#161b22] border border-white/5 p-5 rounded-2xl flex items-center justify-between hover:border-white/10 transition-colors group">
      <div>
        <p className="text-xs text-soft/70 font-bold uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {subtext && (
          <p className="text-xs text-soft/50 mt-1 font-medium">{subtext}</p>
        )}
      </div>
      <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform border border-white/5">
        {icon}
      </div>
    </div>
  );
}
