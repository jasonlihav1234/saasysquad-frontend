import Sidebar from "@/components/settings/Sidebar";
import Footer from "@/components/universal/Footer";
import SubpageHeader from "@/components/universal/SubpageHeader";

export const metadata = {
  title: "Purchases | The Curated Althaïr",
  description: "View your order history and purchase status.",
};

const STATUS_TABS = [
  "All Orders",
  "Processing",
  "In Transit",
  "Delivered",
];

export default function PurchasesPage() {
  return (
    <main className="bg-[#F9F8F6] min-h-screen w-full flex flex-col">
      <SubpageHeader title="Purchases" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-y-auto flex flex-col min-h-0 text-black">
          <header className="purchases-page-header flex flex-wrap justify-between gap-4">
            <div>
              <h1>Your Purchases</h1>
              <p>Page description here</p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>Sort By</span>
                <span>Date: Newest</span>
                <span>Expand more</span>
              </div>
            </div>
          </header>

          <nav
            className="purchases-status-tabs flex flex-wrap gap-8"
          >
            {STATUS_TABS.map((label) => (
              <button key={label} type="button">
                {label}
              </button>
            ))}
          </nav>

          <section className="purchases-orders" />

          <div className="p-8 md:p-12 lg:p-16 max-w-4xl">
            <Footer />
          </div>
        </div>
      </div>
    </main>
  );
}
