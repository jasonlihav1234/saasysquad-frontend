import { Gelasio, Roboto } from "next/font/google";

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal"],
});

interface Item {
  item_id: string;
  item_name: string;
  price: number;
  image_url: string;
  maker: string;
  date: string;
  items_sold: number;
}

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const { item_id, item_name, price, image_url, maker, date } = item;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

  return (
    <div className="group cursor-pointer transition-all duration-500 hover:bg-[#F4F3F1] p-4">
      <div className="aspect-[4/5] overflow-hidden mb-8 bg-[#E9E8E6]">
        <img
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
          alt={item_name}
          src={image_url}
        />
      </div>

      <div>
        <div className="flex justify-between items-start mb-1">
          <h3
            className={`${gelasio.className} text-xl text-[#1a1c1b] group-hover:text-[#775a19] transition-colors`}
          >
            {item_name}
          </h3>
          <span className={`${roboto.className} text-sm font-medium text-[#1a1c1b]`}>
            ${price}
          </span>
        </div>

        <div
          className={`${roboto.className} flex justify-between items-center text-[0.75rem] uppercase tracking-[0.05em] text-[#7f7667]`}
        >
          <span>{maker}</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
