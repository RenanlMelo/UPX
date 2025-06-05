import { House, Info, ListCheck, Settings } from "lucide-react";
import React, { useEffect, useState } from "react";

type HeaderProps = {
  aba: string;
  setAba: React.Dispatch<React.SetStateAction<string>>;
};

export const Header = ({ aba, setAba }: HeaderProps) => {
  const [uptimeSeconds, setUptimeSeconds] = useState(2140_720); // Exemplo: 2 dias, 4h, 12min => 2*86400 + 4*3600 + 12*60 = 192720 seg

  useEffect(() => {
    const interval = setInterval(() => {
      setUptimeSeconds((prev) => prev + 60); // Atualiza a cada 60 segundos
    }, 60_000); // 60_000 ms = 1 min

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <header className="bg-[var(--primary)] w-screen pt-5 text-[var(--text)]">
      <h1 className="text-base mx-6 mb-4 text-[var(--text2)]">
        <strong className="text-2xl font-semibold text-[var(--text)] mr-1">
          UPX
        </strong>
        v1.0.0
      </h1>
      <div className="mx-6 mb-4 grid gap-4 md:grid-cols-3">
        <p className="rounded-md py-2 px-4 bg-[var(--secondary)] text-center flex justify-center items-center select-none">
          Wi-Fi: Ativo
        </p>
        <p className="rounded-md py-2 px-4 bg-[var(--secondary)] text-center flex justify-center items-center select-none">
          LAN: 3/4 Portas
        </p>
        <p className="rounded-md py-2 px-4 bg-[var(--secondary)] text-center flex justify-center items-center select-none">
          Uptime: {formatUptime(uptimeSeconds)}
        </p>
      </div>
      <div className="bg-[var(--darkPrimary)] grid md:grid-cols-3">
        <p
          onClick={() => setAba("geral")}
          className={`flex items-center justify-center ${
            aba == "geral" ? "bg-[var(--primary)]" : ""
          } hover:bg-[var(--primary)] w-fit h-full py-4 place-self-center px-4 duration-300 cursor-pointer select-none`}
        >
          <House size={20} className="mr-1" />
          Geral
        </p>
        <p
          onClick={() => setAba("gerenciamento")}
          className={`flex items-center justify-center ${
            aba == "gerenciamento" ? "bg-[var(--primary)]" : ""
          } hover:bg-[var(--primary)] w-fit h-full py-4 place-self-center px-4 duration-300 cursor-pointer select-none`}
        >
          <ListCheck size={20} className="mr-1" />
          Gerenciamento
        </p>
        <p
          onClick={() => setAba("sobre")}
          className={`flex items-center justify-center ${
            aba == "sobre" ? "bg-[var(--primary)]" : ""
          } hover:bg-[var(--primary)] w-fit h-full py-4 place-self-center px-4 duration-300 cursor-pointer select-none`}
        >
          <Info size={20} className="mr-1" />
          Sobre
        </p>
      </div>
    </header>
  );
};
