"use client"
import { Menu } from "@/components/menu";
import { Persons } from "@/components/Persons";
import { Person } from "@/types/Person";
import axios from "axios";

export default function Home() {
  

  return (
    <div className="w-full h-screen bg-white">
      <Menu />
      <Persons />
    </div>
  );
}

