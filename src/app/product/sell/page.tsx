"use client";

import Footer from "@/components/universal/Footer";
import { Roboto, Gelasio } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "material-symbols";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";

// probably should make this user/dashboard

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export default function SellProducePage() {
  return (
    <>
      <header className="fixed top-0 w-full z-50 glass-nav">
        <div className="flex gap-8 justify-between items-center px-12 py-6 w-full max-w-[1920px] mx-auto">
          <span
            className={`text-2xl ${gelasio.className} tracking-tighter text-[#1A1C1B] dark:text-[#FAF9F7]`}
          >
            The Curated Althaïr
          </span>
          <div className="hidden md:flex gap-6 items-center">
            <Link
              href="/dashboard"
              className={`text-[#5f5e5e] dark:text-[#a7a5a5] hover:text-[#1a1c1b] hover:text-[#775a19] transition-colors duration-300`}
            >
              Catalog
            </Link>
            <Link
              href="/purchases"
              className={`text-[#5f5e5e] dark:text-[#a7a5a5] hover:text-[#1a1c1b] hover:text-[#775a19] transition-colors duration-300`}
            >
              Purchases
            </Link>
            <Link
              href="/sales"
              className={`text-[#5f5e5e] dark:text-[#a7a5a5] hover:text-[#1a1c1b] hover:text-[#775a19] transition-colors duration-300`}
            >
              Sales
            </Link>
            <Link
              href="/messages"
              className={`text-[#5f5e5e] dark:text-[#a7a5a5] hover:text-[#1a1c1b] hover:text-[#775a19] transition-colors duration-300`}
            >
              Messages
            </Link>
            <Link
              href="/product/sell"
              className={`text-[#775A19] dark:text-[#C5A059] border-b border-[#775A19]`}
            >
              Sell Product
            </Link>
          </div>
          <div className="w-8 h-8 bg-surface-container-highest flex items-center justify-center overflow-hidden">
            <Link href="/me">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIEWWIsS24oEuhS288WfCZjz-DYqXxsIG0aCNeFSv78p1rnf6XwcNzKSw-Xn1_AUFH_ESsayZqp-A6g9FAOCencuC1ka2p90hh06vwU4RCpA5Hwuk70p6PViQLxszYYVWfaLRm4VcP-tFyWJY2Zgqmwlg37Yt-iN7qKnSfl812uX1V6D9gAzX43IGcr63yiDKlxJjky5qS3cDTR63mrstO31kxFyupT6m7F2_peMXjtNvbrgTXD5doEoG3vBr0gESyhoIGCZvtgLi7"
                alt="User Profile"
                width={32}
                height={32}
              ></Image>
            </Link>
          </div>
        </div>
      </header>
      <main
        className={`pt-32 pb-24 px-6 md:px-12 flex-groew max-w-[1920px] mx-auto w-full`}
      >
        <div className="grid grid-cols1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-16">
            <header>
              <p
                className={`${gelasio.className} text-5xl font-black tracking-tight leading-tight text-[#1a1c1b]`}
              >
                List a New Item
              </p>
            </header>
            <form className="space-y-12">
              <div className="group relative aspect-[16/9] bg-[#efeeec] flex flex-col items-center justify-center border border-dashed border-[#d1c5b4] transition-all hover:bg-[#e9e8e6] overflow-hidden cursor-pointer">
                <span className="material-symbols-outlined text-4xl text-[#5f5e5e] mb-4">
                  add_photo_alternate
                </span>
                <p
                  className={`${roboto.className} text-xs uppercase- tracking-widest text-[#5f5e5e] uppercase`}
                >
                  Upload High-Resolution Image
                </p>
                <p
                  className={`text-[10px] ${roboto.className} mt-2 text-[#5f5e5e]`}
                >
                  JPG OR PNG (MAX 50MB)
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="flex flex-col gap-2">
                  <label
                    className={`${roboto.className} text-[0.65rem] uppercase tracking-widest text-[#615e57]`}
                  >
                    Item Name
                  </label>
                  <input
                    className={`bg-[#e9e8e6] border-0 border-b border-outline px-0 py-3 text-lg ${roboto.className} placeholder:text-[#d1c5b4] focus:ring-0`}
                    placeholder="e.g.Mid-Century Oak Table"
                    type="text"
                  ></input>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className={`${roboto.className} text-[0.65rem] uppercase tracking-widest text-[#615e57]`}
                  >
                    Listing Price
                  </label>
                  <input
                    className={`bg-[#e9e8e6] border-0 border-b border-outline px-0 py-3 text-lg ${roboto.className} placeholder:text-[#d1c5b4] focus:ring-0`}
                    placeholder="0.00"
                    type="number"
                  ></input>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className={`${roboto.className} text-[0.65rem] uppercase tracking-widest text-[#615e57]`}
                  >
                    Description
                  </label>
                  <textarea
                    rows={4}
                    className={`bg-[#e9e8e6] border-0 border-b border-[#7f7667] px-0 py-3 text-md ${roboto.className} placeholder:text-[#d1c5b4] focus:ring-0 resize-none`}
                    placeholder="Describe the materials, history, and craftmanship..."
                  ></textarea>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
