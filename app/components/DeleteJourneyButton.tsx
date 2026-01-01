"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { deleteJourney } from "../actions/delete-journey";

export default function DeleteJourneyButton({
  roadmapId,
}: {
  roadmapId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [open, setIsOpen] = useState(false);

  async function handleDelete() {
    startTransition(async () => {
      await deleteJourney(roadmapId);
      toast.error("Erro ao excluir jornada.");
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-red-400 hover:text-red-300 hover:bg-red-400/10 gap-2"
        >
          Excluir jornada
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-primary border-soft/20 text-light">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseja deletar essa jornada?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-soft">
            Essa ação não poderá ser desfeita. Isso excluirá permanentemente sua
            jornada e todo o progresso dos passos associados.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-soft/20 text-light hover:bg-medium hover:text-white">
            Cancelar
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className="bg-red-500 text-white hover:bg-red-600 border-0"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              "Sim, excluir jornada."
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
