"use client";

import { turborepoTraceAccess } from "next/dist/build/turborepo-access-trace";
import { flightRouterStateSchema } from "next/dist/server/app-render/types";
import { Gelasio, Roboto } from "next/font/google";
import { useEffect, useState } from "react";

const roboto = Roboto({ subsets: ["latin"], style: ["normal", "italic"] });
const gelasio = Gelasio({ subsets: ["latin"], style: ["normal", "italic"] });

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
          <p
            className={`${roboto.className} text-[0.75rem] uppercase tracking-[0.2em] text-[#775a19] mb-4`}
          >
            Pricing & Membership
          </p>
          <h1
            className={`${roboto.className} text-5xl md:text-7xl font-bold tracking-tight text-[#1a1c1b] leading-tight`}
          >
            Choose Your Path in <br />
            <span className="italic font-normal">The Althair</span>
          </h1>
          <div className="mt-8 h-px w-24 bg-[#775a19]"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {TIERS.map((tier, i) => (
            <div
              key={tier.name}
              className={`lg:col-span-4 ${tier.cardStyle} flex flex-col h-full transition-all duration-700 ease-[cubic-bezier(0.25, 0.1, 0.25, 1)] ${tier.prominent ? "pg-12 lg:-mt-12 relative z-10" : "p-10 border-t-0"}`}
            >
              {tier.badge && (
                <div
                  className={`${roboto.className} absolute top-0 right-0 bg-[#775a19] text-white px-4 py-2 text-[0.6rem] tracking-[0.2em] uppercase`}
                >
                  {tier.badge}
                </div>
              )}

              <div className="mb-12">
                <h2
                  className={`${gelasio.className} ${tier.prominent ? "text-4xl" : "text-3xl"} mb-2`}
                >
                  {tier.name}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
