import { House, Info, Network, SquaresExclude, WifiHigh } from "lucide-react";
import React from "react";

export const Geral = () => {
  return (
    <main className="min-h-screen w-[100vw-16px] rounded-lg m-4 bg-white shadow-[0_0_10px_rgba(0,0,0,.10)] px-6 py-8">
      <h2 className="text-[var(--primary)] font-bold text-2xl ">
        <House
          stroke="var(--primary)"
          strokeWidth={2}
          className="inline mr-1 -translate-y-[2px]"
        />
        Informações Geral
      </h2>
      <div className="mt-4 grid grid-rows-[1fr,1fr,1fr,1fr] gap-y-6">
        <div className="flex flex-col bg-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="h-13 rounded-b-lg bg-[var(--div)] border-l-4 border-[var(--primary)] p-3 w-full shadow-sm hover:bg-[var(--divHover)] duration-300 relative cursor-pointer">
            <WifiHigh
              className="inline -translate-y-[6px] w-8"
              stroke="var(--primary)"
              size={28}
            />{" "}
            <span className="text-sm font-semibold text-slate-600">
              Wi-Fi 2.4GHz
            </span>
            <span className="rounded-2xl py-1 px-2 bg-[#5cb85c] text-white text-sm absolute right-4 select-none">
              Ativo
            </span>
          </div>
          <div className="p-4 rounded-b-lg">
            <p>Largura de Banda: 2 Gbps</p>
            <p>17 Conectados</p>
          </div>
        </div>
        <div className="flex flex-col bg-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="h-13 rounded-b-lg bg-[var(--div)] border-l-4 border-[var(--primary)] p-3 w-full shadow-sm hover:bg-[var(--divHover)] duration-300 relative cursor-pointer">
            <WifiHigh
              className="inline -translate-y-[6px] w-8"
              stroke="var(--primary)"
              size={28}
            />{" "}
            <span className="text-sm font-semibold text-slate-600">
              Wi-Fi 5GHz
            </span>
            <span className="rounded-2xl py-1 px-2 bg-[#5cb85c] text-white text-sm absolute right-4 select-none">
              Ativo
            </span>
          </div>
          <div className="p-4">
            <p>Largura de Banda: 2 Gbps</p>
            <p>33 Conectados</p>
          </div>
        </div>
        <div className="h-13 rounded-lg bg-[var(--div)] border-l-4 border-[var(--primary)] p-3 w-full flex items-center justify-start shadow-sm hover:bg-[var(--divHover)] duration-300 relative cursor-pointer">
          <Network className="inline  w-8" stroke="var(--primary)" size={20} />{" "}
          <span className="text-sm font-semibold text-slate-600  ml-1">
            Rede Lan
          </span>
          <span className="rounded-2xl py-1 px-2 bg-[#5cb85c] text-white text-sm absolute right-4 select-none">
            3/4 Portas
          </span>
        </div>
        <div className="flex flex-col bg-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="h-13 rounded-b-lg bg-[var(--div)] border-l-4 border-[var(--primary)] p-3 w-full shadow-sm hover:bg-[var(--divHover)] duration-300 relative cursor-pointer">
            <SquaresExclude
              className="inline -translate-y-[2px] w-8"
              stroke="var(--primary)"
              size={22}
            />{" "}
            <span className="text-sm font-semibold text-slate-600">
              Resumo do Sistema
            </span>
          </div>
          <div className="p-4">
            <p>Modelo: UPX-Project</p>
            <p>Firmware: v1.0.0</p>
          </div>
        </div>
      </div>
    </main>
  );
};
