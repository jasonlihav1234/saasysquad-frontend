"use client";

import { turborepoTraceAccess } from "next/dist/build/turborepo-access-trace";
import { flightRouterStateSchema } from "next/dist/server/app-render/types";
import { Gelasio, Roboto } from "next/font/google";
import { useEffect, useState } from "react";
import "material-symbols";
import { useUser } from "@/components/providers/UserProvider";

const roboto = Roboto({ subsets: ["latin"], style: ["normal", "italic"] });
const gelasio = Gelasio({ subsets: ["latin"], style: ["normal", "italic"] });

interface TierFeature {
  icon: string;
  text: string;
  enabled: boolean;
  filled?: boolean;
  sub?: string;
}

interface Tier {
  name: string;
  subtitle: string;
  subtitleAccent?: boolean;
  price: string;
  priceSuffix: string;
  badge?: string;
  cta: string;
  ctaStyle: string;
  cardStyle: string;
  prominent: boolean;
  features: TierFeature[];
}

const TIERS: Tier[] = [
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
    subtitleAccent: true,
    price: "$450",
    priceSuffix: "/yr",
    badge: "Recommended",
    cta: "Elevate Experience",
    ctaStyle: "bg-[#775a19] text-white hover:brightness-110",
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
  const { tier: currentTier, loading } = useUser();
  const [headerVisible, setHeaderVisible] = useState<boolean>(false);
  const [cardsVisible, setCardsVisible] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [quoteVisible, setQuoteVisible] = useState<boolean>(false);

  const [checkoutTier, setCheckoutTier] = useState<string | null>(null);
  const [checkoutSecret, setCheckoutSecret] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const [upgradeResult, setUpgradeResult] = useState<string | null>(null);

  useEffect(() => {
    const t0 = setTimeout(() => setHeaderVisible(true), 100);
    const t1 = setTimeout(() => setCardsVisible([true, false, false]), 300);
    const t2 = setTimeout(() => setCardsVisible([true, true, false]), 450);
    const t3 = setTimeout(() => setCardsVisible([true, true, true]), 600);
    const t4 = setTimeout(() => setQuoteVisible(true), 900);

    return () => [t0, t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  const closeCheckout = () => {
    setCheckoutTier(null);
    setCheckoutSecret(null);
    setCheckoutError(null);
  }:

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
              className={`lg:col-span-4 ${tier.cardStyle} flex flex-col h-full transition-all duration-700 ease-[cubic-bezier(0.25, 0.1, 0.25, 1)] ${tier.prominent ? "p-10 relative z-10" : "p-10 border-t-0"}`}
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
                <p
                  className={`${roboto.className} text-xs uppercase tracking-widest ${tier.subtitleAccent ? "text-[#775a19] font-semibold" : "text-[#5f5e5e]/60"}`}
                >
                  {tier.subtitle}
                </p>
              </div>

              <div className="mb-auto space-y-8">
                {tier.features.map((feat, j) => (
                  <div
                    key={j}
                    className={`flex items-start gap-4 ${!feat.enabled ? "opacity-30" : ""}`}
                  >
                    <span
                      className={`material-symbols-outlined text-lg ${feat.enabled ? "text-[#775a19]" : ""} ${feat.filled ? "filled" : ""}`}
                    >
                      {feat.icon}
                    </span>
                    <div className="flex flex-col">
                      <span
                        className={`text-sm ${roboto.className} ${feat.sub ? "font-semibold text-[#1a1c1b]" : "text-[#4e4639]"} leading-relaxed ${!feat.enabled ? "line-through" : ""}`}
                      >
                        {feat.text}
                      </span>
                      {feat.sub && (
                        <span
                          className={`text-xs text-[#4e4639] leading-relaxed ${roboto.className}`}
                        >
                          {feat.sub}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16">
                <div className={`${gelasio.className} text-4xl mb-8`}>
                  {tier.price}
                  <span
                    className={`${roboto.className} text-sm font-light text-[#5f5e5e]`}
                  >
                    {tier.priceSuffix}
                  </span>
                </div>
                <button
                  className={`${roboto.className} ${tier.name.toLowerCase() === currentTier ? "disabled" : ""} w-full py-4 text-xs uppercase tracking-widest font-medium transition-all duration-300 cursor-pointer border-none ${tier.ctaStyle}`}
                >
                  {tier.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-32 relative h-[500px] w-full overflow-hidden transition-all duration-1000`}
        >
          <img
            alt="Luxury Interior"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2lcuHAiUHBjV4RF9pNgwaGKEBH4MpNl4f_4LBvhlFem3YhjdpRYAS8zpufuJluPiBKS7fzClywc5EX1qAIinG3GRuNufJMqggA606nfS9C2z0_gMUlCvqJCM2PuH_ATAmD32KWeIHACCjbn3Igz7Tu5zmLKaWLPg_dWnivaA8zAdKNXKz3HHenaGADZpeWQjagSRNG0kMMjrfQQvTJ18r-8LNwm5tAXMIeUpCTfFHHX00rkFrcs71GrnN0Ci2_DXgA9zH66wDgHiy"
          ></img>
          <div className="absolute inset-0 bg-[#e3e2e0]/20 mix-blend-multiply"></div>
          <div className="absolute bottom-12 left-12 max-w-lg bg-[#faf9f7]/90 backdrop-blur-md p-10">
            <h3 className={`${gelasio.className} text-3xl mb-4 italic`}>
              Luxury is not in the expense, but in the intentional curation of
              functional beauty.
            </h3>
            <p
              className={`${roboto.className} text-xs uppercase tracking-widest text-[#775a19]`}
            >
              - The Founder's Note
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
