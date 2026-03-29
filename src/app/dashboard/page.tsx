"use client";
import Footer from "@/components/universal/Footer";
import { Roboto, Gelasio } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
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
      <nav
        className={`flex justify-between items-center top-0 z-50 px-12 h-20 fixed bg-[#F9F8F6] dark:bg-[#1a1c1b] opacity-85 ${roboto.className} antialiased tracking-tight w-full`}
      >
        <div className="flex items-center gap-8">
          <span
            className={`text-2xl ${gelasio.className} tracking-tighter text-[#1A1C1B] dark:text-[#FAF9F7]`}
          >
            The Curated Althair
          </span>
          <div className="hidden md:flex gap-6 items-center">
            <Link
              href="/dashboard"
              className={`text-[#775A19] dark:text-[#C5A059] border-b border-[#775A19] pb-1`}
            >
              Catalog
            </Link>
          </div>
        </div>
        <div className="relative hidden lg:block group">
          <input
            className="bg-surface-container-low border-none focus:ring-0 w-120 py-2 px-2 text-sm font-body outline-none border-b border-outline-variant focus:border-secondary transition-all"
            placeholder="Search catalog..."
          ></input>
          <span className="material-symbols-outlined absolute right-2 top-2 text-primary opacity-50">
            search
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 px-5 py-2 bg-primary text-on-primary text-xs uppercase tracking-widest hover:bg-on-surface transition-colors">
            <span className="material-symbols-outlined text-sm">add photo</span>
            <span className="hidden sm:inline">recommend with ai</span>
          </button>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary cursor-pointer hover:text-secondary transition-colors">
              shopping_bag
            </span>
            <div className="w-8 h-8 bg-surface-container-highest flex items-center justify-center overflow-hidden">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIEWWIsS24oEuhS288WfCZjz-DYqXxsIG0aCNeFSv78p1rnf6XwcNzKSw-Xn1_AUFH_ESsayZqp-A6g9FAOCencuC1ka2p90hh06vwU4RCpA5Hwuk70p6PViQLxszYYVWfaLRm4VcP-tFyWJY2Zgqmwlg37Yt-iN7qKnSfl812uX1V6D9gAzX43IGcr63yiDKlxJjky5qS3cDTR63mrstO31kxFyupT6m7F2_peMXjtNvbrgTXD5doEoG3vBr0gESyhoIGCZvtgLi7"
                alt="User Profile"
                width={32}
                height={32}
              ></Image>
            </div>
          </div>
        </div>
      </nav>
      <main className="bg-[#F9F8F6] min-h-screen w-full flex flex-col overflow-y-auto">
        <div className="flex flex-1"></div>
        <Footer />
      </main>
    </>
  );
}
