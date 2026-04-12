"use client";

import Sidebar from "@/components/user-settings/shared-components/Sidebar";
import Footer from "@/components/universal/Footer";
import PageSectionHeading from "@/components/user-settings/shared-components/PageSectionHeading";
import SubpageHeader from "@/components/user-settings/shared-components/SubpageHeader";
import SavedItemCard, { SavedItemProps } from "@/components/user-settings/saved/SavedItemCard";
import { Gelasio, Roboto } from "next/font/google";
import "material-symbols";

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const STATIC_SAVED_ITEMS: SavedItemProps[] = [
  {
    id: "1",
    tag: "Ceramics",
    name: "The Ethereal Vessel",
    price: 1250,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5simToNh6aO0bWPsZG10CQ0XnbEz6U7QxrADhy-IEvRIlyMZLL9b8MDErmhszi4kC-xJGle0UTsdnJiXUoKhkaG4c_sJ5jQpfCfpZnKWf7PuL_99znil8RE11rKhbmCEZ2oPOQuZicmM4Me0-nAP2ab7rAmYL1zUMqE8aj5cohOE_LtuTp18l1064Q0nYgYOuTPykfQkVolt79vqHr6e6QjjPXA0fQabxLa-b1ao0dfY23ZHYvfGH1BnsyXA9tWO30jDXxAAIFaiO",
  },
  {
    id: "2",
    tag: "Furniture",
    name: "Arcane Lounge Chair",
    price: 4800,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCIUJT7vZ9eBeWtKxNnsYEKpQTP9ga3Nyj8di9US4hhDm10-No7SF75PpkZkaVuTtKtcBYedKVlKozgRKQUuAFLxtd0bFxtKc0OJXEwQ27HkHoJ4-qbcBDBNo_fDc78t5C__VyNri28KsDFWve8_LVeDyiIiPrYw3XZ41CftUegrr_i7BBFg_COrHKsw_W6E5BzooqvBxtW-A9MfJ0TExxbTAwZ1fCaKgQaiDwm_LVQkHstUfS42KqfqQZieKVgS67wDXvAV8FBgVu",
  },
  {
    id: "3",
    tag: "Fine Art",
    name: "Monolith Study 04",
    price: 3200,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAin3rxPH5O3HTnmwJDnR7TeyIsCe3AfcJz0A1M9bk43IycPzxFQP3dCcCQSmM-_w0yf3_nPCIQgMB7ocqpH4ylnfVlQDomVi_kskK3B19kwPqZiLEyi61nA5O78UblerhQxzdZCKt7WUc45XdwOC-mIQfOGHop6wAvetUrjMFz6WW1ONdw0pQueBPSew81DEpBXHP7094sW6N9jmm-3VRaGeA0glQLd1i8nb6LmU4jM9lU_77KdMF2rAmy8IKTWaxUda1ALYEEEXrM",
  },
  {
    id: "4",
    tag: "Lighting",
    name: "Obsidian Pillar Lamp",
    price: 2100,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfegjHsqmc5jLtk9JHHe9LP23smlMjcKKtx6mwx6GXDOVI-Q0afpo_6ROp3_FExoTCqcQC75frSmm6S8mr74YNZ7Iee9tBAmmsWNfjMwpi3AfqiSl1anqnJWBSA2wWBk1RYOONUEeX3ylKj75b7e8AG_HfxMCvFKwq6RnVLJBjIShA_ewtvPpSi6JBz7biZkKvowXiJ70hd9quzPUfGkMx8rTwNOoeSlg5t0lPKMCYGiqDu-yrxG-AOFFO3o9Xb2Jj1kfzIuNs14o_",
  },
  {
    id: "5",
    tag: "Textiles",
    name: "Nordic Relief Rug",
    price: 5500,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBncFY_zEgWxkTZzbDY5xnOlSkx-iqDJl-AB2-NGrb4gcCN-4mxVP5xilEUut0iQ6nQfUP4t_aVs2MK07X0evT3uEdYy0ggvVJ-mtdnlyYiy1j7OnDUZkxTFxm96FQ_NZ2n1BZ691SmAVhzBVo9fI8b-wUR3PZlR058DrRUlnj_kY3y20dnv8ftg-BO8LZifesjucgCJ022PThzsDf4wN2rB5UfgrFVeYZfy_77EgcXa3cQNhLTyObQ9K3Iitb5SFJlxzgKgI2PSMrd",
  },
  {
    id: "6",
    tag: "Furniture",
    name: "Heritage Oak Table",
    price: 8900,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBX9LF2tkSsG3twWCeLrJWhOspFCCJW9tAhAWOZWHt6FyN5B_zQGSw5douQRHj4D2I6EuAvRNqmOQeH6WgwxgwILONiz9wQXZZheDT2hrW98MWB6GZqidIPFCBHPVonFn7Y47G2-7NUIqfodf6pPzUG1p_Ssj2fQ3T7YaRO7UPE-b6C5qyiFvzbOVuVWhgo_6lgCJELEeM8CGtAbg7cqYpthEyJnn3zCdWrqMB5tW49MC0RIwJWyUVpJ5XhZ9Zjj5K-GHr3Fl5iGEjh",
  }
];

export default function SavedPage() {
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
              {STATIC_SAVED_ITEMS.length === 0 ? (
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
                  {STATIC_SAVED_ITEMS.map((item) => (
                    <SavedItemCard key={item.id} {...item} />
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
