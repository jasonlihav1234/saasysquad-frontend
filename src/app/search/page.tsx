"use client";

import Footer from "@/components/universal/Footer";
import TopNavBar from "@/components/universal/TopNavBar";
import ItemCard from "@/components/dashboard/ItemCard";
import { STATIC_SAVED_ITEMS, toItemCardItem } from "@/data/savedItems";
import { Gelasio, Roboto } from "next/font/google";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import "material-symbols";
import { authFetch } from "../../../lib/api";

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const staticItemsForCard = STATIC_SAVED_ITEMS.map(toItemCardItem);

type SortOption = "az" | "za" | "price-desc" | "price-asc";

const SORT_LABELS: Record<SortOption, string> = {
  az: "Alphabetical: A–Z",
  za: "Alphabetical: Z–A",
  "price-desc": "Price: High to Low",
  "price-asc": "Price: Low to High",
};

const SORT_ORDER: SortOption[] = ["az", "za", "price-desc", "price-asc"];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") ?? "";

  const [items, setItems] = useState<any[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("az");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await authFetch(
          "https://sassysquad-backend.vercel.app/items",
        );

        if (!response.ok) {
          setItems([...staticItemsForCard]);
          return;
        }

        const body = await response.json();
        const backendItems = body.items ?? [];
        setItems([...staticItemsForCard, ...backendItems]);
      } catch (error) {
        console.error("Search fetch error:", error);
        setItems([...staticItemsForCard]);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? items.filter((i) =>
          (i.item_name ?? "").toString().toLowerCase().includes(q),
        )
      : items;

    const list = [...filtered];
    switch (sortOption) {
      case "az":
        list.sort((a, b) =>
          (a.item_name ?? "").localeCompare(b.item_name ?? ""),
        );
        break;
      case "za":
        list.sort((a, b) =>
          (b.item_name ?? "").localeCompare(a.item_name ?? ""),
        );
        break;
      case "price-desc":
        list.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "price-asc":
        list.sort((a, b) => Number(a.price) - Number(b.price));
        break;
    }
    return list;
  }, [items, query, sortOption]);

  return (
    <>
      <TopNavBar activeHref="/search" />
      <main className="bg-[#F9F8F6] pb-24 px-12 mx-auto min-h-screen pt-32">
        <header className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#D1C5B4]/20 pb-8">
          <div>
            <nav
              className={`${roboto.className} flex items-center gap-2 text-xs uppercase tracking-widest text-[#5F5E5E] mb-6`}
            >
              <button
                onClick={() => router.push("/dashboard")}
                className="hover:text-[#775A19] transition-colors cursor-pointer"
              >
                Home
              </button>
              <span className="material-symbols-outlined text-xs">
                chevron_right
              </span>
              <span className="text-[#1A1C1B]">Search</span>
            </nav>
            <h1
              className={`${gelasio.className} text-4xl md:text-5xl lg:text-6xl tracking-tight text-[#1A1C1B] mb-4`}
            >
              <span
                className={`${roboto.className} block text-[#5F5E5E] text-lg md:text-xl tracking-normal mb-2 italic`}
              >
                Results for
              </span>
              {query ? `"${query}"` : "All products"}
            </h1>
          </div>

          <div
            className={`${roboto.className} flex items-center gap-4 text-sm text-[#5F5E5E]`}
          >
            <span className="uppercase tracking-widest text-xs font-medium">
              {results.length} {results.length === 1 ? "Product" : "Products"}
            </span>
            <div className="h-4 w-px bg-[#D1C5B4]/60"></div>

            <div className="relative" ref={sortDropdownRef}>
              <button
                type="button"
                className="flex items-center gap-2 hover:text-[#1A1C1B] transition-colors group cursor-pointer"
                onClick={() => setIsSortOpen((open) => !open)}
              >
                <span className="text-[0.7rem] uppercase tracking-widest text-[#5F5E5E]/60">
                  Sort &amp; Filter
                </span>
                <span className="text-[0.7rem] uppercase tracking-widest font-bold text-[#1A1C1B]">
                  {SORT_LABELS[sortOption]}
                </span>
                <span
                  className={`material-symbols-outlined text-sm transition-transform ${
                    isSortOpen ? "rotate-180" : ""
                  }`}
                >
                  tune
                </span>
              </button>

              {isSortOpen && (
                <ul className="absolute right-0 top-full z-20 mt-2 min-w-[14rem] bg-white border border-[#d1c5b4] shadow-lg py-1">
                  {SORT_ORDER.map((option) => (
                    <li key={option}>
                      <button
                        type="button"
                        className={`${roboto.className} w-full text-left px-4 py-3 text-[0.7rem] uppercase tracking-widest transition-colors cursor-pointer ${
                          sortOption === option
                            ? "bg-[#775a19]/10 text-[#775a19] font-bold"
                            : "text-[#5f5e5e] hover:bg-[#775a19]/5 hover:text-[#775a19]"
                        }`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSortOption(option);
                          setIsSortOpen(false);
                        }}
                      >
                        {SORT_LABELS[option]}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </header>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {results.map((item) => (
              <ItemCard key={item.item_id} item={item} />
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center text-center py-32">
            <span className="material-symbols-outlined text-5xl text-[#D1C5B4] mb-6">
              search_off
            </span>
            <h2
              className={`${gelasio.className} text-3xl md:text-4xl tracking-tight text-[#1A1C1B] mb-4`}
            >
              No products match your search.
            </h2>
            <p
              className={`${roboto.className} text-base text-[#5F5E5E] leading-relaxed max-w-md`}
            >
              {query
                ? `We couldn't find anything for "${query}". Try a different term or explore the full catalog.`
                : "Begin a search from the bar above to discover the catalog."}
            </p>
          </div>
        )}

        <Footer />
      </main>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
