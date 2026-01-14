import CreateJourneyDialog from "@/app/components/CreateJourneyDialog";
import { StartJourneyButton } from "@/app/components/StartJourneyButton";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowRight, Map } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MinhasJornadas() {
  const user = await currentUser();

  if (!user || !user.emailAddresses[0]) {
    redirect("/sign-in");
  }

  const userEmail = user.emailAddresses[0].emailAddress;

  const roadmaps = await prisma.roadmap.findMany({
    where: {
      user: {
        email: userEmail,
      },
    },
    orderBy: { createdAt: "desc" },
    include: { steps: true },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-light mb-1">
            Minhas Jornadas
          </h1>
          <p className="text-soft">
            Gerencie seus caminhos de estudo e evolução técnica.
          </p>
        </div>
      </header>

      <div className="bg-gradient-to-r from-medium/50 to-primary border border-soft/20 rounded-2xl p-8 relative overflow-hidden group shadow-lg shadow-black/20">
        <div className="absolute top-0 right-0 p-10 bg-soft/10 blur-[100px] rounded-full group-hover:bg-soft/20 transition-all duration-700" />

        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">
            Não sabe por onde começar?
          </h2>
          <p className="text-light/80 mb-8 text-lg leading-relaxed">
            Deixe nossa IA criar um roteiro personalizado baseado no seu
            objetivo. Seja React Sênior ou Arquiteto de Software, nós traçamos a
            rota.
          </p>

          <CreateJourneyDialog />
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-light flex items-center gap-2">
            <Map size={20} className="text-soft" />
            Em Progresso ({roadmaps.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((roadmap) => {
            // Cálculo real do progresso para a barra
            const done = roadmap.steps.filter((s) => s.isCompleted).length;
            const total = roadmap.steps.length;
            const percent = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <Link
                href={`/minhas-jornadas/${roadmap.id}`}
                key={roadmap.id}
                className="block h-full"
              >
                <div className="bg-medium/20 border border-soft/10 p-6 rounded-2xl hover:border-soft/30 hover:bg-medium/30 transition-all duration-300 cursor-pointer group flex flex-col justify-between h-full min-h-55 gap-6 shadow-sm hover:shadow-md">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <span className="bg-soft/10 text-soft text-[10px] font-bold px-2 py-1 rounded border border-soft/10 uppercase tracking-wider">
                        {roadmap.area}
                      </span>
                      <ArrowRight
                        size={18}
                        className="text-soft opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1"
                      />
                    </div>

                    <h4 className="text-lg font-bold text-light group-hover:text-white transition-colors line-clamp-2 leading-snug">
                      {roadmap.title}
                    </h4>

                    <div className="space-y-1.5 flex flex-col gap-2">
                      <div className="flex justify-between text-xs text-soft/70">
                        <span>Progresso</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="bg-blue-500 h-full rounded-full transition-all duration-700"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-start mt-6 pt-4 border-t border-soft/5">
                    <StartJourneyButton roadmap={roadmap} />
                  </div>
                </div>
              </Link>
            );
          })}

          {roadmaps.length === 0 && (
            <div className="col-span-full py-16 text-center border border-dashed border-soft/20 rounded-2xl bg-medium/5 flex flex-col items-center justify-center gap-2">
              <Map size={48} className="text-soft/20 mb-2" />
              <p className="text-light font-semibold text-lg">
                Nenhuma jornada encontrada
              </p>
              <p className="text-soft text-sm max-w-md">
                Clique no botão Criar nova jornada acima para gerar seu primeiro
                roteiro com inteligência artificial.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
