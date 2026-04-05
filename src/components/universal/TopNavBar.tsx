"use client";

import { Roboto, Gelasio } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "material-symbols";

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const navLinks = [
  { href: "/dashboard", label: "Catalog" },
  { href: "/product/sell", label: "Sell Items" },
];

interface TopNavBarProps {
  activeHref?: string;
  onSearch?: (term: string) => void;
  onAiClick?: () => void;
}

export default function TopNavBar({
  activeHref,
  onSearch,
  onAiClick,
}: TopNavBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      router.push(`/dashboard?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const isCartSidebarOpen = searchParams.get("sidebar") === "cart";

  const openCart = () => router.push("?sidebar=cart");
  const closeCart = () => router.push("?");

  return (
    <>
      <nav
        className={`flex justify-between items-center top-0 z-50 px-12 h-20 fixed bg-[#F9F8F6] dark:bg-[#1a1c1b] ${roboto.className} antialiased tracking-tight w-full`}
      >
        <div className="flex items-center gap-8">
          {activeHref === "/dashboard" ? (
            <span
              className={`text-2xl ${gelasio.className} cursor-default tracking-tighter text-[#1A1C1B] dark:text-[#FAF9F7]`}
            >
              The Curated Althaïr
            </span>
          ) : (
            <Link
              href="/dashboard"
              className={`text-2xl ${gelasio.className} tracking-tighter text-[#1A1C1B] dark:text-[#FAF9F7] hover:opacity-80 transition-opacity`}
            >
              The Curated Althaïr
            </Link>
          )}
          <div className="hidden md:flex gap-6 items-center">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={
                  activeHref === href
                    ? `text-[#775A19] dark:text-[#C5A059] border-b border-[#775A19]`
                    : `text-[#5f5e5e] dark:text-[#a7a5a5] hover:text-[#775a19] transition-colors duration-300`
                }
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block group">
          <form className="relative inline-block" onSubmit={handleSearchSubmit}>
            <input
              className={`bg-[#F4F3F1] focus:ring-0 sm:w-50 md:w-100 lg:w-150 py-2 px-2 text-sm ${roboto.className} outline-none border-b border-[#D1C5B4] focus:border-[#775A19] transition-all`}
              placeholder="Search catalog..."
              name="search-string"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="material-symbols-sharp absolute right-2 top-2 text-primary opacity-50 cursor-pointer"
            >
              search
            </button>
          </form>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={onAiClick}
            className="flex items-center gap-2 px-5 py-2 bg-[#5F5E5E] text-[#FFFFFF] text-xs uppercase tracking-widest hover:bg-[#1A1C1B] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">
              image_arrow_up
            </span>
            <span className="hidden sm:inline">recommend with ai</span>
          </button>
          <button onClick={openCart}>
            <span className="material-symbols-outlined text-primary cursor-pointer hover:text-secondary transition-colors">
              shopping_cart
            </span>
          </button>
          <div className="w-8 h-8 bg-surface-container-highest flex items-center justify-center overflow-hidden">
            <Link href="/settings">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIEWWIsS24oEuhS288WfCZjz-DYqXxsIG0aCNeFSv78p1rnf6XwcNzKSw-Xn1_AUFH_ESsayZqp-A6g9FAOCencuC1ka2p90hh06vwU4RCpA5Hwuk70p6PViQLxszYYVWfaLRm4VcP-tFyWJY2Zgqmwlg37Yt-iN7qKnSfl812uX1V6D9gAzX43IGcr63yiDKlxJjky5qS3cDTR63mrstO31kxFyupT6m7F2_peMXjtNvbrgTXD5doEoG3vBr0gESyhoIGCZvtgLi7"
                alt="User Profile"
                width={32}
                height={32}
              />
            </Link>
          </div>
        </div>
      </nav>

      {isCartSidebarOpen && (
        <div
          onClick={closeCart}
          className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        ></div>
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#ffffff] z-[70] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isCartSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div>
          <h2>Your cart</h2>
          <button onClick={closeCart} className="material-symbols-outlined cursor-pointer">close</button>
        </div>

        <div className="p-8 border-t border-[#d1c5b4]/10 bg-[#fafafa]">
          <button className="w-full py-4 bg-[#1a1c1b] text-[#ffffff] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#775a19] transition-colors cursor-pointer">Proceed to Checkout</button>
        </div>

      </aside>
    </>
  );
}
