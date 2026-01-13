"use client";

import { createDocument } from "@/app/actions/create-document";
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
import { Roadmap } from "@prisma/client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface CreateDocumentDialogProps {
  userRoadmaps: Roadmap[];
  children: React.ReactNode;
}

export default function CreateDocumentDialog({
  userRoadmaps,
  children,
}: CreateDocumentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedRoadmap, setSelectedRoadmap] = useState("none");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async () => {
    if (!title.trim()) {
      toast.error("Por favor, dê um nome para a nota.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await createDocument({
        title: title,
        roadmapId: selectedRoadmap,
      });

      if (response.success && response.documentId) {
        toast.success("Nota criada com sucesso!");
        setIsOpen(false);
        setTitle("");
        setSelectedRoadmap("none");
        router.push(`/notas/${response.documentId}`);
      } else {
        toast.error("Erro ao criar nota.");
      }
    } catch (error) {
      toast.error(`Erro ao criar nota: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="bg-[#1F1F1F] border-white/10 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar novo caderno</DialogTitle>
          <DialogDescription className="text-soft">
            Dê um nome para seu caderno e associe a uma jornada (opcional).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-white">
              Título do caderno
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Resumo de React Hooks"
              className="bg-medium border-white/10 text-white focus-visible:ring-blue-500 placeholder:text-soft/50"
              autoComplete="off"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="roadmap" className="text-white">
              Associar à Jornada (Opcional)
            </Label>
            <select
              id="roadmap"
              value={selectedRoadmap}
              onChange={(e) => setSelectedRoadmap(e.target.value)}
              className="hover:cursor-pointer flex h-10 w-full rounded-md border border-white/10 bg-medium px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="none">Nenhuma (Caderno solto)</option>
              {userRoadmaps.map((roadmap) => (
                <option key={roadmap.id} value={roadmap.id}>
                  {roadmap.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="hover:cursor-pointer text-soft hover:text-white hover:bg-white/10"
          >
            Cancelar
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isLoading}
            className="hover:cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? "Criando..." : "Criar caderno"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
