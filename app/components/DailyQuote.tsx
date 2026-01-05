"use client";

import { defaultQuote, Quote, quotes } from "@/lib/quote";
import { useEffect, useState } from "react";

export default function DailyQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const today = new Date();

      const dayIndex =
        today.getFullYear() * 1000 +
        (today.getMonth() + 1) * 30 +
        today.getDate();

      const selectedIndex = dayIndex % quotes.length;

      setQuote(quotes[selectedIndex]);
    } catch (error) {
      console.error("Erro ao carregar daily quote.", error);
      setQuote(defaultQuote);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="mt-auto pt-8 animate-pulse">
        <div className="h-3 w-24 bg-white/10 rounded mb-2" />
        <div className="h-12 w-full bg-white/5 rounded" />
      </div>
    );
  }

  const displayQuote = quote || defaultQuote;

  return (
    <div className="mt-4 animate-in slide-in-from-bottom-2 duration-1000">
      <p className="text-soft text-sm leading-relaxed italic text-end">
        {`"${displayQuote.text}"`}
      </p>
      <p className="text-xs mt-2 font-bold text-blue-400 uppercase tracking-widest mb-2 text-end">
        {displayQuote.author}
      </p>
    </div>
  );
}
