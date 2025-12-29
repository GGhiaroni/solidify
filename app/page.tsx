export default function Dashboard() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-light">Dashboard</h1>
        <p className="text-soft">
          Bem-vindo ao Solidify. Vamos consolidar seus estudos hoje?
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-medium/40 border border-soft/20 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold text-light mb-2">
            Próximo Passo
          </h2>
          <p className="text-sm text-soft">
            Você ainda não iniciou uma jornada.
          </p>
        </div>

        <div className="bg-medium/40 border border-soft/20 p-6 rounded-2xl">
          <h2 className="text-lg font-semibold text-light mb-2">Foco Total</h2>
          <div className="text-3xl font-mono text-center py-4">25:00</div>
        </div>
      </div>
    </div>
  );
}
