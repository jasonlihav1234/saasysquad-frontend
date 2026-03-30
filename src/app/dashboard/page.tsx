"use client";
import Footer from "@/components/universal/Footer";
import { Roboto, Gelasio } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "material-symbols";
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
  const [hasItems, setHasItems] = useState(false);

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
              className={`text-[#775A19] dark:text-[#C5A059] border-b border-[#775A19]`}
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
          </div>
        </div>
        <div className="relative hidden lg:block group">
          <input
            className={`bg-[#F4F3F1] focus:ring-0 sm:w-50 md:w-100 lg:w-150 py-2 px-2 text-sm ${roboto.className} outline-none border-b border-[#D1C5B4] focus:border-[#775A19] transition-all`}
            placeholder="Search catalog..."
          ></input>
          <span className="material-symbols-sharp absolute right-2 top-2 text-primary opacity-50 cursor-pointer">
            search
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 px-5 py-2 bg-[#5F5E5E] text-[#FFFFFF] text-xs uppercase tracking-widest hover:bg-[#1A1C1B] transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-sm">
              image_arrow_up
            </span>
            <span className="hidden sm:inline">recommend with ai</span>
          </button>
          <div className="flex items-center gap-6">
            <span className="material-symbols-outlined text-primary cursor-pointer hover:text-secondary transition-colors">
              shopping_cart
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
      <main className="bg-[#F9F8F6] pt-32 pb-24 px-12 mx-auto">
        {hasItems ? (
          <>
            <header className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="max-w-2xl">
                <h1
                  className={`text-6xl md:text-7xl ${gelasio.className} tracking-tighter text-[#1a1c1b]`}
                >
                  The Althair
                  <br></br>
                  <span className="italic text-[#5f5e5e] font-normal">
                    Catalog
                  </span>
                </h1>
              </div>
              <div
                className={`${roboto.className} flex flex-wrap gap-4 font-body text-xs uppercase tracking-widest`}
              >
                <button className="px-6 py-3 bg-[#FFFFFF] border border-[#D1C5B4]/20 hover:bg-[#F4F3F1] transition-colors text-[#775A19] border-b-2 border-b-[#775A19] cursor-pointer">
                  New Arrivals
                </button>
                <button className="px-6 py-3 bg-[#FFFFFF] border border-[#D1C5B4]/20 hover:bg-[#F4F3F1] transition-colors text-[#775A19] cursor-pointer">
                  Best Sellers
                </button>
                <button className="px-6 py-3 bg-[#FFFFFF] border border-[#D1C5B4]/20 hover:bg-[#F4F3F1] transition-colors text-[#775A19] cursor-pointer">
                  Browse All
                </button>
              </div>
            </header>
            <footer className="mt-32 pt-16 border-t border-[#D1C5B4]/10 flex justify-center items-center gap-12">
              <button className="material-symbols-outlined text-[#5F5E5E] hover:text-[#775A19] transition-colors cursor-pointer">
                chevron_left
              </button>
              <div
                className={`flex gap-8 ${roboto.className} text-sm tracking-widest`}
              >
                <Link
                  href="/"
                  className="text-[#1A1C1B] font-bold border-b border-[#1A1C1B]"
                >
                  01
                </Link>
                <Link
                  href="/"
                  className="text-[#5F5E5E] hover:text-[#1A1C1B] transition-colors"
                >
                  02
                </Link>
                <Link
                  href="/"
                  className="text-[#5F5E5E] hover:text-[#1A1C1B] transition-colors"
                >
                  03
                </Link>
                <Link
                  href="/"
                  className="text-[#5F5E5E] hover:text-[#1A1C1B] transition-colors"
                >
                  04
                </Link>
              </div>
              <button className="material-symbols-outlined text-[#5F5E5E] hover:text-[#775A19] transition-colors cursor-pointer">
                chevron_right
              </button>
            </footer>
          </>
        ) : (
          <>
            <div className="w-full flex flex-col items-center justify-center">
              <h1
                className={`text-5xl md:text-7xl mb-8 tracking-tight text-[#1A1C1B] ${gelasio.className}`}
              >
                The Catalog is Silent
              </h1>
              <p
                className={`${roboto.className} text-lg text-[#5f5e5e] leading-relaxed`}
              >
                No items found.
              </p>
            </div>
            <section className="relative w-full h-[600px] mb-32 overflow-hidden bg-[#f4f3f1]">
              <div className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-multiply">
                <img
                  alt="Minimalist Interior"
                  className="w-full h-full object-cover grayscale"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVsxfbGX4ssS40oOqR6_-Dp_UR7HydLoV35Mh_pUlk0-R98KMzCQHVTroLIMKPEGPQ9pNLxztumaPE0yU-1pd23q1XCyaMABomllIlsiuF3Ory6NB-zH1kff8huBk-nHBNywn1vY3nkTqvQVtoS9pAkeLqWQB_opXUHjdyUFBiV5foD-k14knxjy1KVNe4nkkD0FmbLs-lVEU-N3jgRtvyTqMgqEK0DJAk_86F_aGpAJt6ATmFZ_W6gh7_m4IXJUnyvs8EzFgQYE_9"
                ></img>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                <h2
                  className={`${gelasio.className} text-3xl italic text-[#4e4639] tracking-wide`}
                >
                  Finding beauty in the absence.
                </h2>
              </div>
            </section>
          </>
        )}
        <Footer />
      </main>
    </>
  );
}
