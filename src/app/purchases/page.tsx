import { PurchasesProfileFetch } from "@/app/purchases/PurchasesProfileFetch";
import PurchaseOrderItem, {
  type PurchaseOrderItemProps,
} from "@/components/user-settings/purchases/PurchaseOrderItem";
import Sidebar from "@/components/user-settings/shared-components/Sidebar";
import Footer from "@/components/universal/Footer";
import PageSectionHeading from "@/components/user-settings/shared-components/PageSectionHeading";
import SubpageHeader from "@/components/user-settings/shared-components/SubpageHeader";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const STATUS_TABS = ["All Orders", "Processing", "In Transit", "Delivered"];

const SAMPLE_ORDERS: PurchaseOrderItemProps[] = [
  {
    imageSrc: "",
    status: "delivered",
    productTitle: "Height Adjusting Desk",
    orderNumber: "AT-89012",
    dateLabel: "October 12, 2026",
    price: "$1,240.00",
    actionLabel: "View Details",
  },
  {
    imageSrc: "",
    status: "in_transit",
    productTitle: "Lounge Chair",
    orderNumber: "AT-90234",
    dateLabel: "October 28, 2026",
    price: "$4,850.00",
    actionLabel: "View Details",
  },
  {
    imageSrc: "",
    status: "processing",
    productTitle: "Floor Lamp",
    orderNumber: "AT-91442",
    dateLabel: "November 02, 2026",
    price: "$890.00",
    actionLabel: "View Details",
  },
];

export default function PurchasesPage() {
  return (
    <main className="bg-[#F9F8F6] min-h-screen w-full flex flex-col">
      <PurchasesProfileFetch />
      <SubpageHeader title="Purchases" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage="purchases" />

        <div className="flex-1 overflow-y-auto bg-[#faf9f7] flex flex-col min-h-0 text-[#1a1c1b]">
          <div className="w-full max-w-[1400px] px-8 md:px-12 lg:px-16 pt-8 md:pt-12 lg:pt-16">
            <header className="w-full flex justify-between items-end pb-10">
              <PageSectionHeading
                title="Your Purchases"
                description="Page description here"
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
              {SAMPLE_ORDERS.map((order) => (
                <PurchaseOrderItem key={order.orderNumber} {...order} />
              ))}
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
