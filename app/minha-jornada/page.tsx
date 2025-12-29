import { ArrowRight, Map, Plus, Sparkles } from "lucide-react";

export default function MinhaJornada() {
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
          <div className="flex items-center gap-2 text-soft mb-4 font-medium uppercase tracking-wider text-xs">
            <Sparkles size={14} />
            <span>Inteligência Artificial</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">
            Não sabe por onde começar?
          </h2>
          <p className="text-light/80 mb-8 text-lg leading-relaxed">
            Deixe nossa IA criar um roteiro personalizado baseado no seu
            objetivo. Seja React Sênior ou Arquiteto de Software, nós traçamos a
            rota.
          </p>

          <button className="bg-light text-primary font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(189,232,245,0.3)]">
            <Plus size={20} />
            Criar Nova Jornada
          </button>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-light flex items-center gap-2">
            <Map size={20} className="text-soft" />
            Em Progresso
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-medium/20 border border-soft/10 p-6 rounded-2xl hover:border-soft/30 transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-soft/20 text-soft text-xs font-bold px-2 py-1 rounded">
                REACT
              </span>
              <ArrowRight
                size={18}
                className="text-soft opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1"
              />
            </div>
            <h4 className="text-lg font-bold text-light mb-2 group-hover:text-white transition-colors">
              Especialista Next.js
            </h4>
            <div className="w-full bg-primary h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-soft h-full w-[45%] rounded-full" />
            </div>
            <p className="text-xs text-soft mt-2 text-right">45% concluído</p>
          </div>

          <button className="border border-dashed border-soft/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-soft hover:bg-soft/5 hover:text-light transition-all h-full min-h-[160px]">
            <Plus size={32} className="opacity-50" />
            <span className="font-medium">Criar Manualmente</span>
          </button>
        </div>
      </section>
    </div>
  );
}
