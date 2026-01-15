"use client";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  "Planeje seus estudos com a assistência do Gemini, a IA do Google",
  "Monitore suas sessões de estudo e o tempo dedicado a cada tópico",
  "Aproveite o Pomodoro Focus integrado para maior concentração",
  "Acompanhe seu progresso semanal, mensal e anual",
  "Concentre suas anotações com a criação de Cadernos personalizados",
  "Evolua até sua melhor versão",
];

export default function LandingPage() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tight leading-[1.1]">
            Solidifique seu conhecimento. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 animate-gradient bg-[length:200%_auto]">
              Domine o seu futuro.
            </span>
          </h1>
        </div>

        <p className="font-semibold text-xl md:text-2xl text-neutral-300 max-w-2xl text-center mt-6 leading-relaxed">
          O ecossistema completo para organizar estudos, gerenciar projetos e se
          tornar quem você nasceu para ser.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <Link href="/dashboard">
            <Button className="hover:cursor-pointer h-12 px-8 rounded-full bg-white text-black hover:bg-neutral-200 text-base font-semibold transition-all hover:scale-105">
              Começar Agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link href="/sign-in">
            <Button
              variant="ghost"
              className="hover:cursor-pointer underline h-12 px-8 rounded-full hover:text-white text-white hover:bg-white/10 text-base transition-all"
            >
              Já tenho conta
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16 w-full max-w-5xl p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md hidden md:flex overflow-hidden relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        >
          <motion.div
            className="flex gap-8 whitespace-nowrap"
            animate={{
              x: "-50%",
            }}
            transition={{
              duration: 40,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {[...FEATURES, ...FEATURES].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-white/70 text-sm"
              >
                ✨<span>{feature}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full flex-shrink-0" />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </AuroraBackground>
  );
}
