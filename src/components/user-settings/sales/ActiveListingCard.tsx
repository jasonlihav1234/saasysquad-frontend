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

export interface ActiveListingCardProps {
  title: string;
  price: string;
  stock: number;
  imageSrc: string;
  imageAlt: string;
  showQuickManageOverlay?: boolean;
}

export default function ActiveListingCard({
  title,
  price,
  stock,
  imageSrc,
  imageAlt,
  showQuickManageOverlay = false,
}: ActiveListingCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-[4/5] bg-[#e9e8e6] overflow-hidden mb-5 relative">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            type="button"
            className="w-8 h-8 bg-[#faf9f7]/90 backdrop-blur-md flex items-center justify-center hover:bg-[#775a19] hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
        </div>
        {showQuickManageOverlay ? (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <p
              className={`${roboto.className} text-[0.6rem] text-white uppercase tracking-widest`}
            >
              Quick Manage
            </p>
          </div>
        ) : null}
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h4 className={`${roboto.className} font-medium text-sm`}>{title}</h4>
          <p className={`${gelasio.className} text-sm`}>{price}</p>
        </div>
        <div className={`${roboto.className} flex justify-start items-center pt-2`}>
          <span className="text-[0.65rem] uppercase tracking-widest text-[#5f5e5e]/50">
            Stock: {stock}
          </span>
        </div>
      </div>
    </div>
  );
}
