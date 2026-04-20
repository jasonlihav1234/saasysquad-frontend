"use client";

import { Gelasio, Inter, Noto_Serif } from "next/font/google";
import { useState } from "react";
import Link from "next/link";
import "material-symbols";

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootPage() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Hook up your newsletter signup endpoint here.
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <div
      className={`${inter.className} bg-[#faf9f7] text-[#1a1c1b] antialiased min-h-screen`}
    >
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf9f7] transition-opacity duration-300">
        <nav className="flex justify-between items-center w-full px-8 py-6 max-w-[1920px] mx-auto">
          <div
            className={`${gelasio.className} text-3xl font-black tracking-tighter text-[#1a1c1b] uppercase`}
          >
            The Althaïr
          </div>
        </nav>
      </header>

      <main className="pt-24">
        <section className="relative h-[921px] w-full px-8 mb-24 overflow-hidden">
          <div className="relative h-full w-full overflow-hidden">
            <img
              className="w-full h-full object-cover"
              alt="Minimalist luxury living room with beige sofa"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSkvNvQLVg9TzIbAFYLGZ7HGgiXLGvzPXFtWTS9XEbrhmYcblLReoGZGeufVHETdOEZ0ksvQ3gulXTuSY3V5-d4xgfTcYaTUOSDpo6c2MlI7xXCIk13ktlt8moDIx5Jg8bY7kkBqMe0tzGZG2y8Sjub0rbIjjC65R4_sp5A9nwC4VhgqVlS1OVC2AYh9n9FMpdCPAO-b-9RvfmusrStFFvdmogtzTUC4aou09sgqXyJHT1in03F1QxKCW9mpvmNit0M6mAEqrX_1Jo"
            />
            <div className="absolute inset-0 bg-black/5" />

            <div className="absolute bottom-16 left-12 md:left-24 max-w-2xl bg-[#faf9f7]/85 backdrop-blur-[20px] p-12">
              <h1
                className={`${notoSerif.className} text-5xl md:text-7xl font-light tracking-tight leading-tight mb-8`}
              >
                The art of{" "}
                <span className={`${notoSerif.className} italic`}>refined</span>{" "}
                living.
              </h1>
              <p className="text-[#5f5e5e] text-lg mb-10 max-w-md leading-relaxed">
                Discover a meticulously curated selection of homeware that
                transforms houses into personal sanctuaries.
              </p>
              <button
                type="button"
                className="bg-[#5f5e5e] text-white px-10 py-5 uppercase tracking-widest text-xs hover:bg-[#775a19] transition-colors duration-300 cursor-pointer border-none"
              >
                Shop the Collection
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-[1920px] mx-auto px-8 space-y-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 relative group">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-700"
                  alt="Modern sculptural lounge chair in architectural space"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmm6qGRKsR0ZWAp0dS_lEVdt1Wt03JzI44qSuIXI2mlgbzBUyFOV_ZO_3c72bipg24GCO8dGdaEn-3BVXI7VjE4LJP8Vh27SjLFSgopXGB2uyZFUvkvWeCosF8MrbQ6EO0RhWQckh1SnDvpdFDDzqO8jGNGZ-t6esflu7ZtYbt0QpvQ-XoTeXqoHsgX0Zr_vCHkp7MCfhw7ZSx2LANX3kwyxuJrnFCMheOn7OTKfgIkcZ42pcaFyQVMFogej3w-UQmV_vz5YXwVi4e"
                />
              </div>

              <div className="absolute -bottom-12 -right-12 hidden lg:block w-64 h-80 bg-[#e3e2e0] p-4">
                <img
                  className="w-full h-full object-cover"
                  alt="Close up of high quality textile texture"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIP7LSb_JrVxF0nkPIgS0umyun7W-0zlcEb8g-75tQqnC4-S1JZSSKyScCAXkq2JGvJnYTWr6Fx585BtZ7vY3rnEgvK1BhyTX3dcvAUBrvl8Y4r51Yc1kWR4uEtRDLe6eBhOSMfU4HQWzaHGNnux5_H3t3qLcG1Hu-1L-79HoAc0v_UAN0lwofK24-MqkjnQHUqkhWiEQRsIuuEy6qQtmZ1NZFnTGk1K-u1v9QTE3LwXqTcKWS6iEeE8O3gu5alyHe615IaYWEyn_9"
                />
              </div>
            </div>

            <div className="md:col-span-5 md:pl-16">
              <span className="text-[0.75rem] uppercase tracking-[0.2em] text-[#775a19] mb-4 block">
                Collection 01
              </span>
              <h2
                className={`${notoSerif.className} text-4xl md:text-5xl font-light mb-6`}
              >
                Living
              </h2>
              <p className="text-[#5f5e5e] leading-relaxed mb-8 text-lg">
                Sculptural forms meet uncompromising comfort. Each piece in our
                living collection is selected for its ability to anchor a room
                while inviting quiet contemplation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 pt-12">
            <div className="space-y-8 flex flex-col items-start">
              <div className="aspect-square w-full bg-[#f4f3f1] overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt="Elegant minimal dining table setting"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXTidJqgJcIleS74516Ku2ZXAES29QCE3Bd_vnOeeBqLNSuZW266DHN35kspVpwVM42v2NlCLRyy2tbKoTXWf4yL6fxWJjIS67liBMFc7izoP3_7Anzz1MwwiQs1m6_8-Aap2U4jBP98ZhFLOALeqxYFjI3-iu_6jKXI838s1hee7CWZFOFQOv_yAjwkTiPA2NrQPVExwvBUW-YIg_w3Ovp6hemzeIEw_2e9WFytl2aF2PjwmtmAp3q77t6jqJsv1prhGcAlpGHhZr"
                />
              </div>
              <div className="max-w-md">
                <span className="text-[0.75rem] uppercase tracking-[0.2em] text-[#775a19] mb-4 block">
                  Collection 02
                </span>
                <h2
                  className={`${notoSerif.className} text-3xl font-light mb-4`}
                >
                  Dining
                </h2>
                <p className="text-[#5f5e5e]/80 leading-relaxed mb-6">
                  From hand-carved oak tables to artisanal ceramic sets, explore
                  the essentials of the modern host.
                </p>
              </div>
            </div>

            <div className="space-y-8 flex flex-col items-end md:mt-32">
              <div className="aspect-[3/4] w-4/5 bg-[#f4f3f1] overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt="Abstract ceramic vase on a pedestal"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIU0R9XHF6qrvkUE4R3hCIjjflw0s8eMUuLocC6XjNtjldYmfXU8CwZVv9u9LKu4rWeua8t2zNwrw1I0tZx723uhAZoLUBG4NXW8K2x4-ab8-NE8G0JPRO7tiATFaCWTUwaMWp-_nsGinV_JYSHGKNhQHdptIOPM3grdtTFFRR52HIoTHfcYJrjS3i7RLzHLR0ziNpAnB2bCw1QELsH_Yur8Vp32sDs5JVnW8N4pZLTEdEpvWedODoyy2vuBvVvQCHQHeY5sjIAh8b"
                />
              </div>
              <div className="max-w-md w-full text-right">
                <span className="text-[0.75rem] uppercase tracking-[0.2em] text-[#775a19] mb-4 block">
                  Collection 03
                </span>
                <h2
                  className={`${notoSerif.className} text-3xl font-light mb-4`}
                >
                  Objects
                </h2>
                <p className="text-[#5f5e5e]/80 leading-relaxed mb-6">
                  The final layer of curation. Hand-blown glass, textured
                  bronzes, and rare stoneware.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#1a1c1b] text-[#faf9f7] py-16 px-8 mt-24 border-t border-[#5f5e5e]/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full px-6 md:px-12">
          <div className="space-y-6">
            <div
              className={`${notoSerif.className} text-[#C5A059] font-bold text-xl uppercase tracking-wider`}
            >
              The Althaïr
            </div>
            <p className="text-[0.75rem] tracking-widest text-[#a7a5a5] leading-relaxed">
              A HIGHER STANDARD OF CURATION FOR THE DISCERNING COLLECTOR.
            </p>
          </div>
          <div className="flex flex-col justify-end text-right">
            <p className="text-[0.7rem] tracking-widest uppercase text-[#a7a5a5]">
              © 2026 The Curated Atelier. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
