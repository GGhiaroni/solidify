"use client";

import { RoadmapStep } from "@prisma/client";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { startTransition, useOptimistic, useState } from "react";
import { toast } from "react-toastify";
import { toggleStepStatus } from "../actions/toggle-step-status";

interface StepItemProps {
  step: RoadmapStep;
  roadmapId: string;
}

export default function StepItem({ step, roadmapId }: StepItemProps) {
  const [isPending, setIsPending] = useState(false);

  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(
    step.isCompleted,
    (state, newStatus: boolean) => newStatus
  );

  async function handleToggle() {
    const newStatus = !optimisticCompleted;

    startTransition(() => {
      setOptimisticCompleted(newStatus);
    });

    try {
      setIsPending(true);
      const result = await toggleStepStatus(step.id, newStatus, roadmapId);

      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao atualizar o passo.");
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div
      onClick={handleToggle}
      className={`
        group p-6 rounded-xl border transition-all duration-300 relative overflow-hidden cursor-pointer select-none
        ${
          optimisticCompleted
            ? "bg-soft/10 border-soft/30 opacity-70"
            : "bg-medium/20 border-soft/10 hover:border-soft/30 hover:bg-medium/30 hover:scale-[1.01]"
        }
      `}
    >
      <div className="flex gap-4 items-start">
        <div className="mt-1 flex-shrink-0 text-soft">
          {isPending ? (
            <Loader2 className="w-6 h-6 animate-spin opacity-50" />
          ) : optimisticCompleted ? (
            <CheckCircle2 className="w-6 h-6 animate-in zoom-in duration-300" />
          ) : (
            <Circle className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-opacity" />
          )}
        </div>

        <div className="flex-1">
          <h3
            className={`text-xl font-semibold mb-2 transition-colors ${
              optimisticCompleted
                ? "text-soft line-through decoration-soft/50"
                : "text-light"
            }`}
          >
            {step.title}
          </h3>
          <p className="text-soft/80 leading-relaxed text-sm md:text-base">
            {step.description}
          </p>
        </div>
      </div>
    </div>
  );
}
