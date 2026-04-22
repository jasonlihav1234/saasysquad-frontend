import { Gelasio, Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export interface SavedItemProps {
  id: string;
  imageUrl: string;
  tag: string;
  name: string;
  price: number;
}

interface SavedItemCardProps extends SavedItemProps {
  onRemove?: (id: string) => void;
}

export default function SavedItemCard({
  id,
  imageUrl,
  tag,
  name,
  price,
  onRemove,
}: SavedItemCardProps) {
  return (
    <div className="group relative flex flex-col h-full">
      <button
        type="button"
        onClick={() => onRemove?.(id)}
        className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 text-[#1a1c1b] hover:text-[#ba1a1a] transition-colors bg-[#faf9f7]/80 backdrop-blur-sm cursor-pointer"
      >
        <span className="material-symbols-outlined text-xl">close</span>
      </button>

      <div className="aspect-[4/5] bg-[#f4f3f1] overflow-hidden relative w-full">
        <img
          src={imageUrl}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[#5f5e5e]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="mt-6 flex flex-col items-start flex-1 w-full">
        <span
          className={`${roboto.className} text-[9px] tracking-[0.15em] uppercase text-[#775a19] font-semibold mb-1`}
        >
          {tag}
        </span>
        <h3 className={`${gelasio.className} text-lg font-bold text-[#1a1c1b]`}>
          {name}
        </h3>

        <div className="flex-1" />

        <p
          className={`${roboto.className} text-md font-medium mt-3 text-[#1a1c1b]`}
        >
          {`$${price.toLocaleString()}`}
        </p>
        <button
          className={`${roboto.className} mt-4 w-full bg-[#5f5e5e] text-white py-3 text-xs tracking-widest uppercase font-bold transition-all hover:bg-[#1a1c1b] active:scale-[0.98]`}
        >
          Purchase
        </button>
      </div>
    </div>
  );
}
