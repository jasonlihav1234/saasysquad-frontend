import Sidebar from "@/components/settings/Sidebar";
import Footer from "@/components/universal/Footer";
import SubpageHeader from "@/components/universal/SubpageHeader";

export const metadata = {
  title: "Purchases | The Curated Althaïr",
  description: "View your order history and purchase status.",
};

export default function PurchasesPage() {
  return (
    <main className="bg-[#F9F8F6] min-h-screen w-full flex flex-col">
      <SubpageHeader title="Purchases" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-y-auto p-8 md:p-12 lg:p-16 max-w-4xl">
          <Footer />
        </div>
      </div>
    </main>
  );
}
