"use client";

import { Gelasio, Roboto } from "next/font/google";
import { useEffect, useState, useCallback } from "react";
import "material-symbols";
import { useUser } from "@/components/providers/UserProvider";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const roboto = Roboto({ subsets: ["latin"], style: ["normal", "italic"] });
const gelasio = Gelasio({ subsets: ["latin"], style: ["normal", "italic"] });

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const backendUrl = "https://sassysquad-backend.vercel.app";

interface TierFeature {
  icon: string;
  text: string;
  enabled: boolean;
  filled?: boolean;
  sub?: string;
}

interface Tier {
  id: string;
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
    id: "free",
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
    id: "pro",
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
    id: "enterprise",
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

const TIER_ORDER: Record<string, number> = { free: 0, pro: 1, enterprise: 2 };

export default function SubscribePage() {
  const { tier: currentTier, loading, refreshTier } = useUser();
  console.log(currentTier);
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
  };

  // determine button state by tier

  const getButtonState = (tierId: string) => {
    if (loading) {
      return {
        label: "Loading...",
        disabled: true,
      };
    }

    if (tierId === currentTier) {
      return {
        label: "Current Plan",
        disabled: true,
      };
    }

    if (tierId === "free") {
      return {
        label: "Cancel & Downgrade",
        disabled: false,
      };
    }

    const currentOrder = TIER_ORDER[currentTier || "free"] ?? 0;
    const targetOrder = TIER_ORDER[tierId] ?? 0;

    if (targetOrder > currentOrder) {
      return {
        label: TIERS.find((t: any) => t.id === tierId)?.cta || "Upgrade",
        disabled: false,
      };
    }

    return {
      label: "Switch Plan",
      disabled: false,
    };
  };

  const handleSubscribe = useCallback(
    async (tierId: string) => {
      if (tierId === "free") {
        if (
          !confirm(
            "This will cancel your subscription at the end of the billing period. Continue?",
          )
        ) {
          return;
        }

        setCheckoutLoading(true);
        setCheckoutError(null);

        try {
          const res = await fetch(`${backendUrl}/v1/subscription/cancel`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Cancellation failed");
          }

          setUpgradeResult(data.message);
          refreshTier();
        } catch (error: any) {
          setCheckoutError(error.message);
        } finally {
          setCheckoutLoading(false);
        }

        return;
      }

      setCheckoutLoading(true);
      setCheckoutError(null);
      setCheckoutTier(tierId);

      try {
        const res = await fetch(`${backendUrl}/v1/subscription/checkout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ tier: tierId }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to start checkout");
        }

        if (data.upgraded) {
          setUpgradeResult(
            `Subscription updated to ${tierId}. Proration applied.`,
          );
          setCheckoutTier(null);
          setCheckoutLoading(false);
          refreshTier();
          return;
        }

        setCheckoutSecret(data.clientSecret);
      } catch (error: any) {
        setCheckoutError(error.message);
        setCheckoutTier(null);
      } finally {
        setCheckoutLoading(false);
      }
    },
    [currentTier, refreshTier],
  );

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1c1b]">
      <main className="pt-15 pb-24 px-6 md:px-12 max-w-screen-2xl mx-auto">
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

        {upgradeResult && (
          <div className="mb-12 px-6 py-4 bg-emerald-50 border border-emerald-200 flex items-center justify-between transition-all duration-500">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-600">
                check_circle
              </span>
              <span className={`${roboto.className} text-sm text-emerald-800`}>
                {upgradeResult}
              </span>
            </div>
            <button
              onClick={() => setUpgradeResult(null)}
              className="text-emerald-600 hover:text-emerald-800 bg-transparent border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        )}

        {checkoutError && (
          <div className="mb-12 px-6 py-4 bg-red-50 border border-red-200 flex items-center justify-between transition-all duration-500">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500">
                error
              </span>
              <span className={`${roboto.className} text-sm text-red-800`}>
                {checkoutError}
              </span>
            </div>
            <button
              onClick={() => setCheckoutError(null)}
              className="text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {TIERS.map((tier: any, i: any) => {
            const btn = getButtonState(tier.id);
            const isCurrent = tier.id === currentTier;
            const isProcessing = checkoutLoading && checkoutTier === tier.id;

            return (
              <div
                key={tier.id}
                className={`lg:col-span-4 ${tier.cardStyle} flex flex-col h-full transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] relative ${
                  tier.prominent ? "p-10 z-10" : "p-10 border-t-0"
                } ${
                  cardsVisible[i]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
              >
                {tier.badge && (
                  <div
                    className={`${roboto.className} absolute top-0 right-0 bg-[#775a19] text-white px-4 py-2 text-[0.6rem] tracking-[0.2em] uppercase`}
                  >
                    {tier.badge}
                  </div>
                )}

                {isCurrent && (
                  <div
                    className={`${roboto.className} absolute top-0 left-0 bg-[#1a1c1b] text-white px-4 py-2 text-[0.6rem] tracking-[0.2em] uppercase`}
                  >
                    Current
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
                  {tier.features.map((feat: any, j: any) => (
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
                    onClick={() => !btn.disabled && handleSubscribe(tier.id)}
                    disabled={btn.disabled || isProcessing}
                    className={`${roboto.className} w-full py-4 text-xs uppercase tracking-widest font-medium transition-all duration-300 cursor-pointer border-none flex items-center justify-center gap-2 ${
                      btn.disabled
                        ? "bg-[#e3e2e0] text-[#5f5e5e]/40 !cursor-not-allowed"
                        : isProcessing
                          ? "bg-[#775a19] text-white cursor-wait"
                          : tier.ctaStyle
                    }`}
                  >
                    {isProcessing && (
                      <span className="material-symbols-outlined animate-spin text-sm">
                        progress_activity
                      </span>
                    )}
                    {isProcessing ? "Loading…" : btn.label}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {checkoutSecret && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-[#1a1c1b]/60 backdrop-blur-sm transition-opacity duration-300"
              onClick={closeCheckout}
            />

            <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className={`${gelasio.className} text-2xl`}>
                  Complete Subscription
                </h3>
                <button
                  onClick={closeCheckout}
                  className="text-[#5f5e5e] hover:text-[#1a1c1b] bg-transparent border-none cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ clientSecret: checkoutSecret }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          </div>
        )}

        <div
          className={`mt-32 relative h-[500px] w-full overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
            quoteVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          <img
            alt="Luxury Interior"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2lcuHAiUHBjV4RF9pNgwaGKEBH4MpNl4f_4LBvhlFem3YhjdpRYAS8zpufuJluPiBKS7fzClywc5EX1qAIinG3GRuNufJMqggA606nfS9C2z0_gMUlCvqJCM2PuH_ATAmD32KWeIHACCjbn3Igz7Tu5zmLKaWLPg_dWnivaA8zAdKNXKz3HHenaGADZpeWQjagSRNG0kMMjrfQQvTJ18r-8LNwm5tAXMIeUpCTfFHHX00rkFrcs71GrnN0Ci2_DXgA9zH66wDgHiy"
          />
          <div className="absolute inset-0 bg-[#e3e2e0]/20 mix-blend-multiply" />
          <div className="absolute bottom-12 left-12 max-w-lg bg-[#faf9f7]/90 backdrop-blur-md p-10">
            <h3 className={`${gelasio.className} text-3xl mb-4 italic`}>
              Luxury is not in the expense, but in the intentional curation of
              functional beauty.
            </h3>
            <p
              className={`${roboto.className} text-xs uppercase tracking-widest text-[#775a19]`}
            >
              — The Founder's Note
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
