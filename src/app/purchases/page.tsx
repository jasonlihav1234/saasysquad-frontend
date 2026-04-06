"use client";

import { PurchasesProfileFetch } from "@/app/purchases/PurchasesProfileFetch";
import PurchaseOrderItem, {
  type PurchaseOrderItemProps,
} from "@/components/user-settings/purchases/PurchaseOrderItem";
import Sidebar from "@/components/user-settings/shared-components/Sidebar";
import Footer from "@/components/universal/Footer";
import PageSectionHeading from "@/components/user-settings/shared-components/PageSectionHeading";
import SubpageHeader from "@/components/user-settings/shared-components/SubpageHeader";
import { Gelasio, Roboto } from "next/font/google";
import { useState } from "react";

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});


const STATUS_TABS = ["All Orders", "Processing", "In Transit", "Delivered"];

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseOrderItemProps[]>([]);

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
                <div className="flex items-center space-x-2 cursor-pointer group">
                  <span
                    className={`${roboto.className} text-[0.7rem] uppercase tracking-widest text-[#5f5e5e]/60`}
                  >
                    Sort By
                  </span>
                  <span
                    className={`${roboto.className} text-[0.7rem] uppercase tracking-widest font-bold`}
                  >
                    Date: Newest
                  </span>
                  <span className="material-symbols-outlined text-xs uppercase">
                    Expand More
                  </span>
                </div>
              </div>
            </header>

            <nav className="w-full border-b border-[#d1c5b4]/10">
              <div className="flex space-x-12">
                {STATUS_TABS.map((label) => {
                  const isActive = label === "All Orders";
                  return (
                    <button
                      key={label}
                      type="button"
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
              {purchases.length > 0 ? (
                purchases.map((order) => (
                  <PurchaseOrderItem key={order.orderNumber} {...order} />
                ))
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
