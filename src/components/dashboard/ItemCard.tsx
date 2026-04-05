interface Item {
  item_id: string;
  item_name: string;
  price: number;
  image_url: string;
}

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const { item_id, item_name, price, image_url } = item;

  return (
    <div className="cursor-pointer text-[black]">
      <div className="aspect-[4/5] overflow-hidden mb-6 bg-[#efeeec]">
        <img
          className="w-full h-full object-cover"
          src={image_url}
        />
      </div>

      <div className="px-2">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-xl">{item_name}</h3>
          <span>${price}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Maker</span>
          <span>Date</span>
        </div>
      </div>
    </div>
  );
}
