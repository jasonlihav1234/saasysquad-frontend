import type { SavedItemProps } from "@/components/user-settings/saved/SavedItemCard";

export const STATIC_SAVED_ITEMS: SavedItemProps[] = [
  {
    id: "1",
    tag: "Ceramics",
    name: "The Ethereal Vessel",
    price: 1250,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5simToNh6aO0bWPsZG10CQ0XnbEz6U7QxrADhy-IEvRIlyMZLL9b8MDErmhszi4kC-xJGle0UTsdnJiXUoKhkaG4c_sJ5jQpfCfpZnKWf7PuL_99znil8RE11rKhbmCEZ2oPOQuZicmM4Me0-nAP2ab7rAmYL1zUMqE8aj5cohOE_LtuTp18l1064Q0nYgYOuTPykfQkVolt79vqHr6e6QjjPXA0fQabxLa-b1ao0dfY23ZHYvfGH1BnsyXA9tWO30jDXxAAIFaiO",
  },
  {
    id: "2",
    tag: "Furniture",
    name: "Arcane Lounge Chair",
    price: 4800,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCIUJT7vZ9eBeWtKxNnsYEKpQTP9ga3Nyj8di9US4hhDm10-No7SF75PpkZkaVuTtKtcBYedKVlKozgRKQUuAFLxtd0bFxtKc0OJXEwQ27HkHoJ4-qbcBDBNo_fDc78t5C__VyNri28KsDFWve8_LVeDyiIiPrYw3XZ41CftUegrr_i7BBFg_COrHKsw_W6E5BzooqvBxtW-A9MfJ0TExxbTAwZ1fCaKgQaiDwm_LVQkHstUfS42KqfqQZieKVgS67wDXvAV8FBgVu",
  },
  {
    id: "3",
    tag: "Fine Art",
    name: "Monolith Study 04",
    price: 3200,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAin3rxPH5O3HTnmwJDnR7TeyIsCe3AfcJz0A1M9bk43IycPzxFQP3dCcCQSmM-_w0yf3_nPCIQgMB7ocqpH4ylnfVlQDomVi_kskK3B19kwPqZiLEyi61nA5O78UblerhQxzdZCKt7WUc45XdwOC-mIQfOGHop6wAvetUrjMFz6WW1ONdw0pQueBPSew81DEpBXHP7094sW6N9jmm-3VRaGeA0glQLd1i8nb6LmU4jM9lU_77KdMF2rAmy8IKTWaxUda1ALYEEEXrM",
  },
  {
    id: "4",
    tag: "Lighting",
    name: "Obsidian Pillar Lamp",
    price: 2100,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfegjHsqmc5jLtk9JHHe9LP23smlMjcKKtx6mwx6GXDOVI-Q0afpo_6ROp3_FExoTCqcQC75frSmm6S8mr74YNZ7Iee9tBAmmsWNfjMwpi3AfqiSl1anqnJWBSA2wWBk1RYOONUEeX3ylKj75b7e8AG_HfxMCvFKwq6RnVLJBjIShA_ewtvPpSi6JBz7biZkKvowXiJ70hd9quzPUfGkMx8rTwNOoeSlg5t0lPKMCYGiqDu-yrxG-AOFFO3o9Xb2Jj1kfzIuNs14o_",
  },
  {
    id: "5",
    tag: "Textiles",
    name: "Nordic Relief Rug",
    price: 5500,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBncFY_zEgWxkTZzbDY5xnOlSkx-iqDJl-AB2-NGrb4gcCN-4mxVP5xilEUut0iQ6nQfUP4t_aVs2MK07X0evT3uEdYy0ggvVJ-mtdnlyYiy1j7OnDUZkxTFxm96FQ_NZ2n1BZ691SmAVhzBVo9fI8b-wUR3PZlR058DrRUlnj_kY3y20dnv8ftg-BO8LZifesjucgCJ022PThzsDf4wN2rB5UfgrFVeYZfy_77EgcXa3cQNhLTyObQ9K3Iitb5SFJlxzgKgI2PSMrd",
  },
  {
    id: "6",
    tag: "Furniture",
    name: "Heritage Oak Table",
    price: 8900,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBX9LF2tkSsG3twWCeLrJWhOspFCCJW9tAhAWOZWHt6FyN5B_zQGSw5douQRHj4D2I6EuAvRNqmOQeH6WgwxgwILONiz9wQXZZheDT2hrW98MWB6GZqidIPFCBHPVonFn7Y47G2-7NUIqfodf6pPzUG1p_Ssj2fQ3T7YaRO7UPE-b6C5qyiFvzbOVuVWhgo_6lgCJELEeM8CGtAbg7cqYpthEyJnn3zCdWrqMB5tW49MC0RIwJWyUVpJ5XhZ9Zjj5K-GHr3Fl5iGEjh",
  },
];

export function toItemCardItem(i: SavedItemProps) {
  return {
    item_id: i.id,
    item_name: i.name,
    price: i.price,
    image_url: i.imageUrl,
    seller_user_name: "The Atelier",
    last_updated: "2026-04-22",
  };
}

export function findSavedItemById(id: string | null) {
  if (!id) return null;
  return STATIC_SAVED_ITEMS.find((i) => i.id === id) ?? null;
}
