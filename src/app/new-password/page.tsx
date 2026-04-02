"use client";

import { Gelasio, Roboto } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/universal/Footer";

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const colorWhite = "#F9F8F6";

export default function CreateNewPasswordPage () {
    return (
    <main className={`bg-[${colorWhite}] grid grid-rows-[auto_1fr_auto] min-h-screen w-full`}>
        <h1
        className={`${gelasio.className} text-black text-3xl text-center pt-10`}
      >
        The Curated Althaïr
      </h1>

      <div className={`flex bg-[${colorWhite}] border border-solid border-black`}>

      </div>

      <Footer />
    </main>);
}