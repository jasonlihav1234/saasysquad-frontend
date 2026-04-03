"use client";

import { useState } from "react";
import { Gelasio, Roboto } from "next/font/google";

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

type ThemeMode = "light" | "dark";

interface AccentSwatch {
  label: string;
  color: string;
}

const accentSwatches: AccentSwatch[] = [
  { label: "Gold Tone", color: "#C5A059" },
  { label: "Tan Tone", color: "#8b7355" },
  { label: "Charcoal Tone", color: "#474747" },
];

export default function AestheticOptions() {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [activeAccent, setActiveAccent] = useState<string>("#C5A059");

  return (
    <div>
      {/* Aesthetic Preferences */}
      <section id="aesthetic" className="mb-24">
        <h2 className={`${gelasio.className} text-black text-2xl font-medium mb-2`}>
          Aesthetic Preferences
        </h2>
        <p className={`${roboto.className} text-[#5F5E5E] text-sm mb-8`}>
          Tailor the visual environment to your curated taste.
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 bg-[#F1F1EF] p-6">
            <h3 className={`${roboto.className} text-black text-xs uppercase tracking-widest mb-6`}>
              ENVIRONMENT MODE
            </h3>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setMode("light")}
                className={`${roboto.className} flex-1 p-4 border text-center text-sm uppercase tracking-widest transition-all duration-200 cursor-pointer
                  ${mode === "light"
                    ? "border-[#C5A059] bg-[#F9F8F6] text-black"
                    : "border-[#E3E2E0] bg-[#E3E2E0] text-[#5F5E5E] hover:border-[#474747]"
                  }`}
              >
                ☀ Light
              </button>
              <button
                type="button"
                onClick={() => setMode("dark")}
                className={`${roboto.className} flex-1 p-4 border text-center text-sm uppercase tracking-widest transition-all duration-200 cursor-pointer
                  ${mode === "dark"
                    ? "border-[#C5A059] bg-[#2f3130] text-white"
                    : "border-[#474747] bg-[#474747] text-[#F1F1EF] hover:border-[#C5A059]"
                  }`}
              >
                ☾ Dark
              </button>
            </div>
          </div>

          <div className="flex-1 bg-[#F1F1EF] p-6">
            <h3 className={`${roboto.className} text-black text-xs uppercase tracking-widest mb-6`}>
              ACCENT TONE
            </h3>
            <div className="flex gap-4 flex-wrap items-center">
              {accentSwatches.map((swatch) => (
                <button
                  key={swatch.color}
                  type="button"
                  onClick={() => setActiveAccent(swatch.color)}
                  style={{ backgroundColor: swatch.color }}
                  className={`w-10 h-10 cursor-pointer transition-all duration-200 focus:outline-none
                    ${activeAccent === swatch.color
                      ? "ring-2 ring-offset-2 ring-offset-[#F1F1EF] ring-[#C5A059]"
                      : "hover:ring-2 hover:ring-offset-2 hover:ring-offset-[#F1F1EF] hover:ring-[#474747]"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-[#C5A059]/20 mb-24" />

      <section id="requests" className="mb-12">
        <div className="bg-[#474747] p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <h2 className={`${gelasio.className} text-white text-2xl font-medium`}>
                The Curator&apos;s Input
              </h2>
            </div>
            <p className={`${roboto.className} text-[#F1F1EF] text-sm mb-8 max-w-lg opacity-90`}>
              Your perspective shapes the future of The Atelier. Propose additions or refinements to our digital space.
            </p>

            <form className="flex flex-col gap-6">
              <textarea
                id="suggestion"
                name="suggestion"
                rows={3}
                placeholder="Share your vision..."
                className={`${roboto.className} focus:outline-none bg-white/10 border border-white/30 text-white placeholder:text-white/50 p-4 resize-none`}
              />
              <button
                type="submit"
                className={`${roboto.className} self-start cursor-pointer bg-[#F9F8F6] hover:bg-white transition duration-300 text-[#474747] tracking-widest font-bold text-sm px-8 py-4 uppercase`}
              >
                SUBMIT SUGGESTION
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
