import "material-symbols";
import Sidebar from "@/components/user-settings/shared-components/Sidebar";
import Footer from "@/components/universal/Footer";
import PageSectionHeading from "@/components/user-settings/shared-components/PageSectionHeading";
import SubpageHeader from "@/components/user-settings/shared-components/SubpageHeader";
import { Gelasio, Roboto } from "next/font/google";

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const statCardShell =
  "bg-[#efeeec] p-10 flex flex-col justify-center items-center text-center";

const statCardCaption = `${roboto.className} text-[0.65rem] uppercase tracking-widest text-[#5f5e5e]/60`;

export const metadata = {
  title: "Sales | The Curated Althaïr",
  description: "View your sales performance and recent transactions.",
};

export default function SalesPage() {
  return (
    <main className="bg-[#F9F8F6] min-h-screen w-full flex flex-col">
      <SubpageHeader title="Sales" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage="sales" />

        <div className="flex-1 overflow-y-auto bg-[#faf9f7] flex flex-col min-h-0 text-[#1a1c1b]">
          <div className="w-full max-w-[1400px] px-8 md:px-12 lg:px-16 pt-8 md:pt-12 lg:pt-16">
            <header className="w-full flex justify-between items-end pb-10">
              <PageSectionHeading
                title="Your Sales"
                description="Page description here"
              />
            </header>

            <section className="pb-24">
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 md:col-span-5 bg-[#f4f3f1] p-10 flex flex-col justify-between">
                  <div>
                    <span
                      className={`${roboto.className} text-[0.7rem] uppercase tracking-widest text-[#775a19] mb-2 block`}
                    >
                      Performance Overview
                    </span>
                    <h2
                      className={`${gelasio.className} text-5xl font-light text-[#1a1c1b]`}
                    >
                      $12,450.00
                    </h2>
                    <p
                      className={`${roboto.className} text-sm text-[#5f5e5e]/70 mt-2 italic`}
                    >
                      Total Revenue this Quarter
                    </p>
                  </div>
                  <div className="mt-12 flex items-center gap-2 text-[#775a19]">
                    <span className="material-symbols-outlined">trending_up</span>
                    <span
                      className={`${roboto.className} text-sm font-bold`}
                    >
                      +12.4% from last month
                    </span>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-8">
                  <div className={statCardShell}>
                    <h3
                      className={`${gelasio.className} text-4xl mb-1 text-[#1a1c1b]`}
                    >
                      8
                    </h3>
                    <p className={statCardCaption}>Active Listings</p>
                  </div>
                  <div className={statCardShell}>
                    <h3
                      className={`${gelasio.className} text-4xl mb-1 text-[#1a1c1b]`}
                    >
                      24
                    </h3>
                    <p className={statCardCaption}>Items Sold</p>
                  </div>
                </div>
              </div>
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
