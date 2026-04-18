import { Gelasio, Roboto } from "next/font/google";

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export type SaleStatus =
  | "awaiting_shipment"
  | "delivered"
  | "cancelled"
  | "completed";

export interface SaleRowItem {
  id: string;
  productTitle: string;
  sku: string;
  orderDate: string;
  customer: string;
  price: string;
  payout: string;
  status: SaleStatus;
}

function getStatusDisplay(status: SaleStatus) {
  switch (status) {
    case "awaiting_shipment":
      return {
        label: "Awaiting Shipment",
        badge: "bg-[#fed488]/20 text-[#785a1a]",
        dot: "bg-[#775a19]",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        badge: "bg-red-50 text-red-700",
        dot: "bg-red-500/70",
      };
    case "completed":
    case "delivered":
    default:
      return {
        label: "Completed",
        badge: "bg-[#e3e2e0] text-[#5f5e5e]",
        dot: "bg-[#5f5e5e]/40",
      };
  }
}

export default function SalesTableRow({ item }: { item: SaleRowItem }) {
  const { label, badge, dot } = getStatusDisplay(item.status);

  return (
    <tr className="bg-[#faf9f7] border-b border-[#d1c5b4]/20">
      <td className="px-6 py-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-20 bg-[#e9e8e6]" />
          <div>
            <p className={`${roboto.className} font-semibold text-sm`}>
              {item.productTitle}
            </p>
            <p
              className={`${roboto.className} text-[0.65rem] text-[#5f5e5e]/60 uppercase tracking-wider`}
            >
              SKU: {item.sku}
            </p>
          </div>
        </div>
      </td>
      <td className={`${roboto.className} px-6 py-8 text-sm text-[#5f5e5e]`}>
        {item.orderDate}
      </td>
      <td className={`${roboto.className} px-6 py-8 text-sm text-[#5f5e5e]`}>
        {item.customer}
      </td>
      <td className={`${gelasio.className} px-6 py-8 text-lg text-[#1a1c1b]`}>
        {item.price}
      </td>
      <td className={`${gelasio.className} px-6 py-8 text-lg text-[#1a1c1b]`}>
        {item.payout}
      </td>
      <td className="px-6 py-8">
        <span
          className={`${roboto.className} inline-flex items-center gap-1.5 px-3 py-1 text-[0.65rem] uppercase tracking-widest ${badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
          {label}
        </span>
      </td>
    </tr>
  );
}
