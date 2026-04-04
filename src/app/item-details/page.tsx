"use client";

import { Roboto, Gelasio } from "next/font/google";
import "material-symbols";

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
      <main className="max-w-[1920px] mx-auto">
        <section className="flex flex-col md:flex-row min-h-[819px]">
          <div className="w-full md:w-3/5 bg-[black] overflow-hidden relative group min-h-[400px]">
            <div className="w-full h-full flex items-center justify-center text-[#5f5e5e]/20">
              <span className="material-symbols-outlined text-6xl">image</span>
            </div>
          </div>

          <div className="w-full md:w-2/5 p-8 md:p-24 flex flex-col justify-center bg-[#faf9f7]">
            <div className="space-y-12">
              <div className="h-4 w-full bg-[black]"></div>
              <div className="h-4 w-full bg-[black]"></div>
              <div className="h-4 w-full bg-[black]"></div>
              <div className="h-24 w-full bg-[black]"></div>
              <div className="space-y-4">
                <div className="h-16 w-full bg-[black]"></div>
                <div className="h-16 w-full bg-[black]"></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
