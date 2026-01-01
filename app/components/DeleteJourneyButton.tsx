"use client";

import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertDialogContent } from "@radix-ui/react-alert-dialog";
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

      <AlertDialogContent className="bg-primary border-soft/20 text-light"></AlertDialogContent>
    </AlertDialog>
  );
}
