"use client";

import { Roboto, Gelasio } from "next/font/google";
import "material-symbols";
import TopNavBar from "@/components/universal/TopNavBar";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
});

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export default function ItemDetails() {
  return (
    <div className={`min-h-screen bg-[#faf9f7] text-[#1a1c1b] ${roboto.className} selection:bg-[#fed488] selection:text-[#785a1a]`}>
      <TopNavBar />
      <main className="max-w-[1920px] mx-auto pt-20">
        <section className="flex flex-col md:flex-row min-h-[819px]">
          <div className="w-full md:w-3/5 bg-[grey] overflow-hidden relative group min-h-[400px]">
            <div className="w-full h-full flex items-center justify-center text-[#5f5e5e]/20">
              <span className="material-symbols-outlined text-6xl">image</span>
            </div>
          </div>
          <div className="w-full md:w-2/5 p-8 md:p-24 flex flex-col justify-center bg-[#faf9f7]">
            <nav className="mb-12">
              <span className={`text-[0.65rem] uppercase tracking-[0.2em] text-[#7f7667] ${roboto.className}`}>
                Objects / Ceramics
              </span>
            </nav>

            <h1 className={`${gelasio.className} text-5xl md:text-6xl italic tracking-tight text-[#1a1c1b] mb-12`}>
              Handcrafted Ceramic Vessel
            </h1>

            <div className="mb-12">
              <p className={`${gelasio.className} text-2xl text-[#1a1c1b] mb-8`}>$450</p>
              <p className={`text-sm leading-relaxed max-w-md text-[#5f5e5e] ${roboto.className}`}>
                Placeholder.
              </p>
            </div>

            <div className="space-y-4">
              <button className={`w-full bg-[#5f5e5e] text-white py-6 text-[0.7rem] uppercase tracking-[0.2em] hover:bg-[#1a1c1b] ${roboto.className}`}>
                Add to Cart
              </button>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-8 pt-8 border-t border-[#d1c5b4]/30">
              <div>
                <h4 className={`text-[0.6rem] uppercase tracking-widest text-[#7f7667] mb-2 ${roboto.className}`}>
                  Dimensions
                </h4>
                <p className="text-sm text-[#1a1c1b]">Place cm × Holder cm</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
