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

const color = {
    colorWhite: "#F9F8F6",
    colorGrey:"#787777",
}

export default function CreateNewPasswordPage () {
    return (
    <main className={`bg-[${color.colorWhite}] grid grid-rows-[auto_1fr_auto] min-h-screen w-full`}>
        <h1
        className={`${gelasio.className} text-black text-3xl text-center pt-10`}
      >
        The Curated Althaïr
      </h1>

      <div className={`flex bg-[${color.colorWhite}] border border-solid border-black items-center justify-center flex-col`}>
      <h1
          className={`text-black text-5xl md:text-6xl text-center`}
        >
          Create New <br></br> Password
        </h1>

        <p
          className={`text-center text-[${color.colorGrey}] pt-5 text-lg max-w-sm`}
        >
          Please enter your new credentials below.
        </p>
      </div>

      <Footer />
    </main>);
}