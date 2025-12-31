import { prisma } from "@/lib/prisma";
import { ArrowRight, Map } from "lucide-react";
import Link from "next/link";
import CreateJourneyDialog from "../components/CreateJourneyDialog";

export default async function MinhaJornada() {
  const roadmaps = await prisma.roadmap.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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

      <div className="bg-gradient-to-r from-medium/50 to-primary border border-soft/20 rounded-2xl p-8 relative overflow-hidden group">
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
          {roadmaps.map((roadmap) => (
            <Link
              href={`/minha-jornada/${roadmap.id}`}
              key={roadmap.id}
              className="block h-full"
            >
              <div
                key={roadmap.id}
                className="bg-medium/20 border border-soft/10 p-6 rounded-2xl hover:border-soft/30 transition-colors cursor-pointer group flex flex-col justify-between h-[180px]"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-soft/20 text-soft text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                      {roadmap.area}
                    </span>
                    <ArrowRight
                      size={18}
                      className="text-soft opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1"
                    />
                  </div>
                  <h4 className="text-lg font-bold text-light mb-2 group-hover:text-white transition-colors line-clamp-2">
                    {roadmap.title}
                  </h4>
                </div>

                <div>
                  <div className="w-full bg-primary h-1.5 rounded-full mt-4 overflow-hidden">
                    <div className="bg-soft h-full w-[5%] rounded-full" />
                  </div>
                  <p className="text-xs text-soft mt-2 text-right">
                    Iniciado agora
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {roadmaps.length === 0 && (
            <div className="col-span-full py-12 text-center border border-dashed border-soft/20 rounded-2xl bg-medium/10">
              <p className="text-light font-semibold mb-1">
                Nenhuma jornada encontrada
              </p>
              <p className="text-soft text-sm">
                Clique no botão acima para criar seu primeiro roteiro com IA.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
