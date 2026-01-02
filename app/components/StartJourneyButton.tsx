"use client";

import { Button } from "@/components/ui/button";
import { Roadmap, RoadmapStatus } from "@prisma/client";
import { Archive, CheckCircle2, Loader2, PlayIcon, Rocket } from "lucide-react";
import { useTransition } from "react";
import { toast } from "react-toastify";
import startJourney from "../actions/start-journey";

interface StartJourneyProps {
  roadmap: Roadmap | null | undefined;
}

export const StartJourneyButton = ({ roadmap }: StartJourneyProps) => {
  const [isPending, startTransition] = useTransition();

  if (!roadmap) return null;

  async function handleStartJourney() {
    if (!roadmap) return;

    startTransition(async () => {
      const result = await startJourney(roadmap.id);

      if (result.success) {
        toast.success("Jornada iniciada com sucesso! 🚀");
      } else {
        toast.error("Erro ao iniciar jornada.");
      }
    });
  }

  switch (roadmap.status) {
    case RoadmapStatus.ACTIVE:
      return (
        <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-2 rounded-lg border border-green-400/20 animate-in fade-in">
          <Rocket size={18} />
          <span className="font-bold text-sm">Em andamento</span>
        </div>
      );

    case RoadmapStatus.COMPLETED:
      return (
        <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 px-4 py-2 rounded-lg border border-yellow-400/20 animate-in fade-in">
          <CheckCircle2 size={18} />
          <span className="font-bold text-sm">Completo</span>
        </div>
      );

    case RoadmapStatus.ARCHIVED:
      return (
        <div className="flex items-center gap-2 text-gray-400 bg-gray-400/10 px-4 py-2 rounded-lg border border-gray-400/20 animate-in fade-in">
          <Archive size={18} />
          <span className="font-bold text-sm">Arquivada</span>
        </div>
      );

    case RoadmapStatus.DRAFT:
    default:
      return (
        <Button
          onClick={handleStartJourney}
          disabled={isPending}
          className="bg-primary hover:bg-medium text-light font-bold gap-2 shadow-lg hover:shadow-primary/20 transition-all"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Iniciando...
            </>
          ) : (
            <>
              <PlayIcon size={20} fill="currentColor" />
              Iniciar Jornada
            </>
          )}
        </Button>
      );
  }
};
