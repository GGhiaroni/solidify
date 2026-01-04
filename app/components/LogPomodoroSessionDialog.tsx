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
import { Calendar, Clock, Loader2, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { studySessionLog } from "../actions/study-session-log";

export default function LogPomodoroSessionDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [minutes, setMinutes] = useState("");
  const [dateStr, setDateStr] = useState(
    new Date().toISOString().split("T")[0] // Começa com "Hoje" (YYYY-MM-DD)
  );
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const minutesNumeric = parseInt(minutes);

    if (isNaN(minutesNumeric) || minutesNumeric <= 0) {
      toast.error("Insira um número válido no campo de minutos estudados.");
      return;
    }

    startTransition(async () => {
      const selectedDate = new Date(dateStr);
      const now = new Date();
      selectedDate.setHours(now.getHours(), now.getMinutes());

      const result = await studySessionLog({
        minutes: minutesNumeric,
        date: selectedDate,
      });

      if (result.success) {
        toast.success(`Muito bom! +${minutesNumeric} minutos registrados! 🔥`);
        setIsOpen(false);
        setMinutes("");
      } else {
        toast.error("Erro ao registrar. Tente novamente.");
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-medium border border-soft/20 text-light hover:bg-medium/80 hover:border-primary/50 transition-all gap-2 shadow-lg shadow-black/20">
          <Plus size={18} className="text-primary" />
          Registrar Manualmente
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#0D1117] border-soft/20 text-light sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Clock className="text-primary" size={24} />
            Registrar Estudo
          </DialogTitle>
          <DialogDescription className="text-soft">
            Estudou por fora? Lance aqui para não perder seu Streak!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-soft font-medium">
              Data da sessão
            </Label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-2.5 text-soft"
                size={18}
              />
              <Input
                id="date"
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="pl-10 bg-medium/50 border-soft/20 text-light focus:border-primary/50"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minutes" className="text-soft font-medium">
              Tempo focado (minutos)
            </Label>
            <div className="relative">
              <Clock className="absolute left-3 top-2.5 text-soft" size={18} />
              <Input
                id="minutes"
                type="number"
                placeholder="Ex: 45"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="pl-10 bg-medium/50 border-soft/20 text-light focus:border-primary/50 text-lg font-bold"
                required
                min="1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary hover:bg-green-600 text-white font-bold"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                </>
              ) : (
                "Confirmar Atividade"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
