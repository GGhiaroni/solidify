"use client";

import { Button } from "@/components/ui/button";
import { Document } from "@prisma/client";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import getDocuments from "../actions/get-documents";
import DocumentCard from "./_components/DocumentCard";

export default function NotasPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const loadInitial = async () => {
      const res = await getDocuments(0);
      if (res.success && res.data) {
        setDocuments(res.data);
        setHasMore(res.hasMore || false);
      }
      setIsLoading(false);
    };
    loadInitial();
  }, []);

  const loadMore = async () => {
    setIsLoadingMore(true);

    const res = await getDocuments(documents.length);

    if (res.success && res.data) {
      setDocuments((prev) => [...prev, ...res.data]);
      setHasMore(res.hasMore || false);
    }
    setIsLoadingMore(false);
  };

  return (
    <div className="h-full flex flex-col p-8 space-y-8 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-serif mb-2 text-white">
            Meus Cadernos
          </h1>
          <p className="text-soft text-sm">
            Organize suas ideias e conhecimentos.
          </p>
        </div>

        <div className="hidden md:block"></div>
      </div>

      {isLoading ? (
        <div className="h-[50vh] flex items-center justify-center text-soft">
          <Loader2 className="animate-spin mr-2" /> Carregando seus cadernos...
        </div>
      ) : documents.length === 0 ? (
        // Estado Vazio
        <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
          <Image
            src="/empty.png"
            height={300}
            width={300}
            alt="Vazio"
            className="opacity-50"
          />
          <h2 className="text-xl font-medium text-white">
            Nenhum caderno encontrado
          </h2>
          <p className="text-soft">
            Crie seu primeiro caderno na barra lateral para começar.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc, index) => (
              <DocumentCard key={doc.id} document={doc} index={index} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-8 pb-20">
              <Button
                onClick={loadMore}
                disabled={isLoadingMore}
                variant="outline"
                className="bg-transparent border-white/10 text-soft hover:text-white hover:bg-white/5"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Carregando...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Carregar mais antigos
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
