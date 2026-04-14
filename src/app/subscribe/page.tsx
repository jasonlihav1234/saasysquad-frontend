"use client";

import { flightRouterStateSchema } from "next/dist/server/app-render/types";
import { Gelasio, Roboto } from "next/font/google";
import { useEffect, useState } from "react";

const TIERS = [
  {
    name: "Free",
    subtitle: "Complimentary Entry",
    price: "$0",
    priceSuffix: "/yr",
    cta: "Join the Althair",
    ctaStyle: "bg-[#5f5e5e] text-white hover:bg-[#1a1c1b]",
    cardStyle: "bg-[#f4f3f1]",
    prominent: false,
    features: [
      {
        icon: "check_circle",
        text: "Standard transaction fees on curated pieces",
        enabled: true,
      },
      {
        icon: "check_circle",
        text: "Basic acquisition analytics",
        enabled: true,
      },
      {
        icon: "block",
        text: "AI-powered item recommendations",
        enabled: true,
      },
    ],
  },
  {
    name: "Pro",
    subtitle: "Professional Standard",
    price: "$450",
    priceSuffix: "/yr",
    badge: "Recommended",
    cta: "Elevate Experience",
    ctaStyle: "bg-[#775a19] text-white hover:brightness-100",
    cardStyle: "bg-white shadow-[0_10px_40px_-10px_rgba(26,28,27,0.04)]",
    prominent: true,
    features: [
      {
        icon: "auto_awesome",
        filled: true,
        text: "AI Recommendations",
        sub: "Personalized discovery for curated finds",
        enabled: true,
      },
      {
        icon: "trending_up",
        text: "Market prediction tools & trends",
        enabled: true,
      },
      {
        icon: "insights",
        text: "Advanced collection analytics",
        enabled: true,
      },
      {
        icon: "percent",
        text: "Reduction transactions fees (5%)",
        enabled: true,
      },
    ],
  },
  {
    name: "Enterprise",
    subtitle: "Enterprise Partnership",
    price: "$700",
    priceSuffix: "/yr",
    cta: "Simplify workflows",
    ctaStyle: "bg-[#1a1c1b] text-[#faf9f7] hover:bg-[#5f5e5e]",
    cardStyle: "bg-[#e9e8e6]",
    prominent: false,
    features: [
      {
        icon: "bolt",
        text: "Agentic Workflow",
        sub: "Automated item creation & cataloging",
        enabled: true,
      },
      {
        icon: "support_agent",
        text: "Priority support 24/7",
        enabled: true,
      },
      {
        icon: "handshake",
        text: "Further reduced fees (2.5%)",
        enabled: true,
      },
      {
        icon: "all_inclusive",
        text: "Includes all Curator features",
        enabled: true,
      },
    ],
  },
];

export default function SubscribePage() {
  const [headerVisible, setHeaderVisible] = useState<boolean>(false);

  useEffect(() => {
    const t0 = setTimeout(() => setHeaderVisible(true), 100);

    return () => [t0].forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1c1b]">
      <main className="pt-40 pb-24 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <header
          className={`mb-24 max-w-3xl transition-all duration-1000 ease-[cubic-bezier(0.25, 0.1, 0.25, 0.1)] ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p>Pricing & Membership</p>
          <h1>
            Choose Your Path in <br />
            <span>The Althair</span>
          </h1>
        </header>
      </main>
    </div>
  );
}
