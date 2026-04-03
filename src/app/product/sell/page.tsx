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
  );
}
