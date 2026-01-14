import { Radio } from "lucide-react";

export default function LofiPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="w-32 h-32 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <Radio size={64} className="text-blue-400" />
      </div>
      <h1 className="text-3xl font-bold text-light mb-2">Lofi Station</h1>
      <p className="text-soft text-lg max-w-md text-center">
        Relaxe. O player global está ativo no canto inferior esquerdo. Navegue
        pelo app sem parar a música. 🎧
      </p>
    </div>
  );
}
