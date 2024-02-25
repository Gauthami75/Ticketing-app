import React from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import TicketForm from "./ticket";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <TicketForm />
  );
}
