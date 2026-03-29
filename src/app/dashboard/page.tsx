"use client";
import Footer from "@/components/universal/Footer";
import { Roboto, Gelasio } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// probably should make this user/dashboard

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export default function Dashboard() {
  return (
    <>
      <nav></nav>
      <main className="bg-[#F9F8F6] min-h-screen w-full">
        <div>
          <p className="text-black">Test</p>
        </div>
        <Footer />
      </main>
    </>
  );
}
