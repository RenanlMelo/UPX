"use client";
import { Geral } from "@/components/Geral";
import Gerenciamento from "@/components/Gerenciamento";
import { Header } from "@/components/Header";
import { Sobre } from "@/components/Sobre";
import { useState } from "react";

export default function Home() {
  const [aba, setAba] = useState("geral");
  return (
    <>
      <Header setAba={setAba} />
      {aba === "geral" && <Geral />}
      {aba === "sobre" && <Sobre />}
      {aba === "gerenciamento" && <Gerenciamento />}
    </>
  );
}
