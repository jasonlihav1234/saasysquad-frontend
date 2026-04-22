"use client";

import Sidebar from "@/components/user-settings/shared-components/Sidebar";
import Footer from "@/components/universal/Footer";
import PageSectionHeading from "@/components/user-settings/shared-components/PageSectionHeading";
import SubpageHeader from "@/components/user-settings/shared-components/SubpageHeader";
import SavedItemCard, {
  SavedItemProps,
} from "@/components/user-settings/saved/SavedItemCard";
import {
  getSavedItems,
  removeSavedItem,
  subscribe,
} from "@/lib/savedItemsStorage";
import { Gelasio, Roboto } from "next/font/google";
import { useEffect, useState } from "react";
import "material-symbols";

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export default function SavedPage() {
  const [items, setItems] = useState<SavedItemProps[]>([]);

  useEffect(() => {
    setItems(getSavedItems());
    const unsubscribe = subscribe(() => setItems(getSavedItems()));
    return unsubscribe;
  }, []);

  const handleRemove = (id: string) => {
    removeSavedItem(id);
    setItems(getSavedItems());
  };

  return (
    <main className="bg-[#F9F8F6] min-h-screen w-full flex flex-col">
      <SubpageHeader title="Saved" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage="saved" />

        <div className="flex-1 overflow-y-auto bg-[#faf9f7] flex flex-col min-h-0 text-[#1a1c1b]">
          <div className="w-full max-w-[1400px] px-8 md:px-12 lg:px-16 pt-8 md:pt-12 lg:pt-16">
            <header className="w-full flex justify-between items-end pb-10">
              <PageSectionHeading
                title="Saved Items"
                description="Your curated list of saved items."
              />
            </header>
            
            <section className="w-full">
              {items.length === 0 ? (
                <div className="text-center py-6">
                  <h1
                    className={`${gelasio.className} text-3xl md:text-4xl font-bold text-[#1a1c1b] mb-4 tracking-tight`}
                  >
                    Your archive is currently empty.
                  </h1>
                  <p
                    className={`${roboto.className} text-[#5f5e5e] text-base max-w-md mx-auto leading-relaxed`}
                  >
                    Start exploring and save items you'd like to revisit!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {items.map((item) => (
                    <SavedItemCard
                      key={item.id}
                      {...item}
                      onRemove={handleRemove}
                    />
                  ))}
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
