import { Info } from "lucide-react";
import React from "react";

export const Sobre = () => {
  return (
    <main className="min-h-screen w-[100vw-16px] rounded-lg m-4 bg-white shadow-[0_0_10px_rgba(0,0,0,.10)] px-6 py-8">
      <h2 className="text-[var(--primary)] font-bold text-2xl">
        <Info
          fill="var(--primary)"
          stroke="#eee"
          strokeWidth={2}
          className="inline mr-1 -translate-y-[2px]"
        />
        Sobre o Projeto
      </h2>
    </main>
  );
};
