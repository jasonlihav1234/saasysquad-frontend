"use client";

import "material-symbols";
import { PurchasesProfileFetch } from "@/app/purchases/PurchasesProfileFetch";
import PurchaseOrderItem, {
  purchaseRowToItemProps,
  type PurchaseOrderRow,
} from "@/components/user-settings/purchases/PurchaseOrderItem";
import Sidebar from "@/components/user-settings/shared-components/Sidebar";
import Footer from "@/components/universal/Footer";
import PageSectionHeading from "@/components/user-settings/shared-components/PageSectionHeading";
import SubpageHeader from "@/components/user-settings/shared-components/SubpageHeader";
import { Gelasio, Roboto } from "next/font/google";
import { useEffect, useMemo, useRef, useState } from "react";

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});


const STATUS_TABS = [
  "All Orders",
  "Processing",
  "In Transit",
  "Delivered",
] as const;

type SortOrder = "newest" | "oldest";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseOrderRow[]>([]);
  const [activeStatusTab, setActiveStatusTab] =
    useState<(typeof STATUS_TABS)[number]>("All Orders");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const filteredAndSortedPurchases = useMemo(() => {
    let rows = [...purchases];
    if (activeStatusTab === "Processing") {
      rows = rows.filter((r) => r.status === "processing");
    } else if (activeStatusTab === "In Transit") {
      rows = rows.filter((r) => r.status === "in_transit");
    } else if (activeStatusTab === "Delivered") {
      rows = rows.filter((r) => r.status === "delivered");
    }
    rows.sort((a, b) =>
      sortOrder === "newest"
        ? b.orderedAtMs - a.orderedAtMs
        : a.orderedAtMs - b.orderedAtMs,
    );
    return rows;
  }, [purchases, activeStatusTab, sortOrder]);

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

  return (
    <main className="bg-[#F9F8F6] min-h-screen w-full flex flex-col">
      <PurchasesProfileFetch onLoaded={setPurchases} />
      <SubpageHeader title="Purchases" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage="purchases" />

        <div className="flex-1 overflow-y-auto bg-[#faf9f7] flex flex-col min-h-0 text-[#1a1c1b]">
          <div className="w-full max-w-[1400px] px-8 md:px-12 lg:px-16 pt-8 md:pt-12 lg:pt-16">
            <header className="w-full flex justify-between items-end pb-10">
              <PageSectionHeading
                title="Your Purchases"
                description="View all your purchases"
              />

              <div className="flex items-center space-x-8 pb-1">
                <div className="relative" ref={sortDropdownRef}>
                  <button
                    type="button"
                    className="flex items-center space-x-2 cursor-pointer group"
                    onClick={() => setIsSortOpen((open) => !open)}
                    aria-expanded={isSortOpen}
                    aria-haspopup="listbox"
                  >
                    <span
                      className={`${roboto.className} text-[0.7rem] uppercase tracking-widest text-[#5f5e5e]/60`}
                    >
                      Sort By
                    </span>
                    <span
                      className={`${roboto.className} text-[0.7rem] uppercase tracking-widest font-bold`}
                    >
                      {sortOrder === "newest" ? "Newest" : "Oldest"}
                    </span>
                    <span
                      className={`material-symbols-outlined text-sm transition-transform ${isSortOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    >
                      expand_more
                    </span>
                  </button>
                  {isSortOpen && (
                    <ul
                      className="absolute right-0 top-full z-20 mt-2 min-w-[10rem] bg-white border border-[#d1c5b4] shadow-lg py-1"
                      role="listbox"
                      aria-label="Sort by date"
                    >
                      <li role="option" aria-selected={sortOrder === "newest"}>
                        <button
                          type="button"
                          className={`${roboto.className} w-full text-left px-4 py-3 text-[0.7rem] uppercase tracking-widest transition-colors ${
                            sortOrder === "newest"
                              ? "bg-[#775a19]/10 text-[#775a19] font-bold"
                              : "text-[#5f5e5e] hover:bg-[#775a19]/5 hover:text-[#775a19]"
                          }`}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setSortOrder("newest");
                            setIsSortOpen(false);
                          }}
                        >
                          Newest
                        </button>
                      </li>
                      <li role="option" aria-selected={sortOrder === "oldest"}>
                        <button
                          type="button"
                          className={`${roboto.className} w-full text-left px-4 py-3 text-[0.7rem] uppercase tracking-widest transition-colors ${
                            sortOrder === "oldest"
                              ? "bg-[#775a19]/10 text-[#775a19] font-bold"
                              : "text-[#5f5e5e] hover:bg-[#775a19]/5 hover:text-[#775a19]"
                          }`}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setSortOrder("oldest");
                            setIsSortOpen(false);
                          }}
                        >
                          Oldest
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </header>

            <nav className="w-full border-b border-[#d1c5b4]/10">
              <div className="flex space-x-12">
                {STATUS_TABS.map((label) => {
                  const isActive = label === activeStatusTab;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setActiveStatusTab(label)}
                      className={`${roboto.className} pb-4 text-[0.7rem] uppercase tracking-widest transition-colors ${
                        isActive
                          ? "border-b border-[#775a19] text-[#775a19] font-bold"
                          : "text-[#5f5e5e]/40 hover:text-[#5f5e5e]"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </nav>

            <section className="w-full py-12 space-y-12">
              {filteredAndSortedPurchases.length > 0 ? (
                filteredAndSortedPurchases.map((row) => (
                  <PurchaseOrderItem
                    key={row.orderNumber}
                    {...purchaseRowToItemProps(row)}
                  />
                ))
              ) : purchases.length > 0 ? (
                <div className="text-center py-6">
                  <h1
                    className={`${gelasio.className} text-3xl md:text-4xl font-bold text-[#1a1c1b] mb-4 tracking-tight`}
                  >
                    No orders in this category.
                  </h1>
                  <p
                    className={`${roboto.className} text-[#5f5e5e] text-base max-w-md mx-auto leading-relaxed`}
                  >
                    Try another tab or view all orders.
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <h1
                    className={`${gelasio.className} text-3xl md:text-4xl font-bold text-[#1a1c1b] mb-4 tracking-tight`}
                  >
                    No purchases so far.
                  </h1>
                  <p
                    className={`${roboto.className} text-[#5f5e5e] text-base max-w-md mx-auto leading-relaxed`}
                  >
                    Make a purchase to get started.
                  </p>
                </div>
              )}
            </section>
          </div>

          <div className="p-8 md:p-12 lg:p-16 max-w">
            <Footer />
          </div>
        </div>
      </div>
    </main>
  );
}
