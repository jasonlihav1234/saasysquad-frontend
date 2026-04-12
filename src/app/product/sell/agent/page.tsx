"use client";

import TopNavBar from "@/components/universal/TopNavBar";
import { Roboto, Gelasio } from "next/font/google";
import { useState } from "react";

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const ITEMS = [
  {
    id: 1,
    category: "Furniture",
    name: "Vintage oak bookshelf",
    tags: ["oak", "vintage", "storage"],
    priceLabel: "Optimal price",
    price: 340,
    metrics: [
      { label: "Est. volume / mo", value: "16—20", suffix: "units" },
      { label: "Max revenue potential", value: "$6,120", accent: true },
    ],
    confidence: 92,
    qty: 12,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAfM2XPNjOoNKA_Ke5rcHdFEONWP3bdSPwvsl0BeDUROcQ7bXIaCXhoRB8JQrMrxB71hKcoAvmUQFT9PTrPzpseW--kjP0JQsv9ZJOO9s5Nk_xX2qQ1GSA35YweIJy4LFqW2MgV04BPqieOIvD48xY_CRJm8c6F7MVpW2RHT0_jHR8EhU7QtmgzfUdDQ5Tb26Q_0WKp1dvyEVwCGCwJJCeQVvWX6ygV3ErBjR8t-pHdhlaMKLEyz7-1Cyw_-OvI0GXGgL6aRwMkeRxo",
  },
  {
    id: 2,
    category: "Soft furnishings",
    name: "Linen throw cushion — sage",
    tags: ["linen", "sage", "handmade"],
    priceLabel: "AI Midpoint",
    price: 65,
    metrics: [
      { label: "Market Range", value: "$45 — $85" },
      { label: "Trend Velocity", value: "High", suffix: "+12%", accent: true },
    ],
    confidence: 88,
    qty: 45,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDZd1i4B2GzPbw4_2d6psUdfOp0wAQ301bKlXfzigx8EFHdqVfeiRHqxURfLwcmU2VOiVgU6LpHMYQrCofSzYXRJi13AP2taJ3UtmZA4CRkIhAKoIxeuZXVE47OOd4ZJ0o97KVJRLdz0gQJVKaZbM3qhcNg9-xzwaxwSGETtNWM6AvYNxXKlrr2KsfmqZDTt6G8iaqdws3dXW-fSZodooo3hKqKe6r8TVFTHdsrRTeIryquApxDRwAiSj59TZ7CgN83GTSUPQEXBv1u",
  },
];

export default function AgentPage() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [statuses, setStatuses] = useState({});

  const counts = {
    pending: ITEMS.filter(
      (i) => !statuses[i.id] || statuses[i.id] === "pending",
    ).length,
    published: ITEMS.filter((i) => statuses[i.id] === "accepted").length,
  };

  return (
    <>
      <TopNavBar />
      <main className="pt-32 pb-24 max-w-[1120px] mx-auto px-12">
        <section className="grid grid-cols-4 gap-4 mb-16">
          {[
            {
              label: "Uploaded",
              val: 3,
              sub: "Images in current session",
              bg: "bg-[#f4f3f1]",
            },
            {
              label: "Processed",
              val: 3,
              sub: "Drafts generated",
              bg: "bg-[#efeeec]",
            },
            {
              label: "Pending review",
              val: counts.pending,
              sub: "Requires seller approval",
              bg: "bg-[#e9e8e6]",
              accent: true,
            },
            {
              label: "Published",
              val: counts.published,
              sub: "Active live listings",
              bg: "bg-[#e3e2e0]",
            },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} p-8 border-b border-[#d1c5b4]/15`}>
              <span
                className={`block text-[9px] uppercase tracking-[0.15em] mb-2 ${s.accent ? "text-[#775a19]" : "text-[#5f5e5e]"}`}
              >
                {s.label}
              </span>
              <span
                className={`font-gelasio text-4xl font-light ${s.accent ? "text-[#775a19]" : "text-[#1a1c1b]"}`}
              >
                {s.val}
              </span>
              <span className="block text-[9px] text-[#5f5e5e]/60 mt-1">
                {s.sub}
              </span>
            </div>
          ))}
        </section>

        <section className="flex justify-between items-end mb-12">
          <div>
            <h2>Review board</h2>
            <div></div>
          </div>
          <button>Approve all</button>
        </section>
      </main>
    </>
  );
}
