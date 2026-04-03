import Image from "next/image";
import { Gelasio, Roboto } from "next/font/google";

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export type PurchaseOrderStatus = "delivered" | "in_transit" | "processing";

export type PurchaseOrderItemProps = {
  imageSrc: string;
  status: PurchaseOrderStatus;
  productTitle: string;
  orderNumber: string;
  dateLabel: string;
  price: string;
  actionLabel: string;
};

const STATUS_BADGE: Record<
  PurchaseOrderStatus,
  { label: string; className: string }
> = {
  delivered: {
    label: "Delivered",
    className: "bg-[#ffffff] text-[#775a19]",
  },
  in_transit: {
    label: "In Transit",
    className: "bg-[#5f5e5e] text-white",
  },
  processing: {
    label: "Processing",
    className: "bg-[#e3e2e0] text-[#5f5e5e]",
  },
};

export default function PurchaseOrderItem({
  imageSrc,
  status,
  productTitle,
  orderNumber,
  dateLabel,
  price,
  actionLabel,
}: PurchaseOrderItemProps) {
  const badge = STATUS_BADGE[status];

  return (
    <article className="group flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 md:space-x-10 p-4">
      <div className="relative w-40 h-52 shrink-0 overflow-hidden bg-[#e9e8e6]">
        <Image
          src={imageSrc}
          alt={productTitle}
          fill
          className="object-cover"
          sizes="160px"
        />
        <div className="absolute top-0 right-0 p-2">
          <span
            className={`${roboto.className} inline-block px-2 py-1 text-[0.6rem] uppercase tracking-widest font-bold ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-8 w-full min-w-0">
        <div className="col-span-1 md:col-span-1">
          <p
            className={`${roboto.className} text-[0.65rem] uppercase tracking-widest text-[#5f5e5e]/40 mb-1`}
          >
            Product
          </p>
          <h3
            className={`${gelasio.className} text-xl text-[#1a1c1b] font-normal`}
          >
            {productTitle}
          </h3>
          <p
            className={`${roboto.className} text-[0.7rem] text-[#5f5e5e]/60 mt-2`}
          >
            Order #{orderNumber}
          </p>
        </div>
        <div>
          <p
            className={`${roboto.className} text-[0.65rem] uppercase tracking-widest text-[#5f5e5e]/40 mb-1`}
          >
            Date
          </p>
          <p className={`${roboto.className} text-sm text-[#1a1c1b]`}>
            {dateLabel}
          </p>
        </div>
        <div>
          <p
            className={`${roboto.className} text-[0.65rem] uppercase tracking-widest text-[#5f5e5e]/40 mb-1`}
          >
            Price
          </p>
          <p className={`${roboto.className} text-sm font-bold text-[#1a1c1b]`}>
            {price}
          </p>
        </div>
        <div className="flex justify-end items-center">
          <button
            type="button"
            className={`${roboto.className} px-6 py-2 border-b border-[#775a19]/30 text-[#775a19] text-[0.7rem] uppercase tracking-widest`}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </article>
  );
}
