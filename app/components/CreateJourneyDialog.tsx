"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { createJourney } from "../actions/create-journey";

export default function CreateJourneyDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const response = await createJourney(formData);

    setIsLoading(false);

    if (response.success) {
      setOpen(false);
      toast.success("Jornada criada com sucesso!");
    } else {
      toast.error(response.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-light text-primary font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:scale-105 hover:cursor-pointer transition-transform shadow-[0_0_20px_rgba(189,232,245,0.3)]">
          <Plus size={20} />
          Criar nova jornada
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-primary border-soft/20 text-light">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="text-soft" size={20} />
          </DialogTitle>
          <DialogDescription className="text-soft">
            Conte para a nossa IA o que você deseja dominar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-light">
              Título do Objetivo
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Ex: Desenvolvedor Sênior React"
              className="bg-medium/50 border-soft/30 text-light placeholder:text-soft/50 focus-visible:ring-soft border-0"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="area" className="text-light">
              Área ou Tecnologia
            </Label>
            <Input
              id="area"
              name="area"
              placeholder="Ex: Frontend, DevOps..."
              className="bg-medium/50 border-soft/30 text-light placeholder:text-soft/50 focus-visible:ring-soft border-0"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="details" className="text-light">
              Detalhes Extras
            </Label>
            <Textarea
              id="details"
              name="details"
              placeholder="Ex: Focar em performance..."
              className="bg-medium/50 border-soft/30 text-light placeholder:text-soft/50 focus-visible:ring-soft border-0 min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-soft text-light font-bold hover:bg-light hover:text-soft hover:cursor-pointer transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Criar jornada"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
