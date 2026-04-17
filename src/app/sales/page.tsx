"use client";

import "material-symbols";
import Sidebar from "@/components/user-settings/shared-components/Sidebar";
import Footer from "@/components/universal/Footer";
import PageSectionHeading from "@/components/user-settings/shared-components/PageSectionHeading";
import SubpageHeader from "@/components/user-settings/shared-components/SubpageHeader";
import ActiveListingCard, {
  type ActiveListingCardProps,
} from "@/components/user-settings/sales/ActiveListingCard";
import SalesTableRow, {
  type SaleRowItem,
} from "@/components/user-settings/sales/SalesTableRow";
import { Gelasio, Roboto } from "next/font/google";
import { useUser } from "@/components/providers/UserProvider";
import { useEffect, useState, useMemo } from "react";
import Link from "next/Link";
import { resumeAndPrerenderToNodeStream } from "react-dom/static";

interface BasicAnalytics {
  revenueThisQuarter: number;
  revenueThisMonth: number;
  ordersThisQuarter: number;
  itemsSoldTotal: number;
  activeListings: number;
  monthOverMonth: number | null;
}

interface ProAnalytics {
  conversionRate: number | null;
  averageOrderValue: number;
  viewsToSales: number;
  repeatBuyerRate: number;
  topCategory: { name: string; revenue: number } | null;
  revenueByMonth: { month: string; revenue: number }[];
}

interface EnterpriseAnalytics {
  forecastNextQuarter: number;
  customerLifetimeValue: number;
  uniqueBuyers: number;
  churnRiskCount: number;
  inventoryTurnoverDays: number;
  competitivePosition: "leading" | "strong" | "mid" | "emerging";
  marketShareSegment: number;
}

const gelasio = Gelasio({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const roboto = Roboto({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const backendUrl: string =
  "https://saasysquad-frontend-git-story-s-10518e-jasons-projects-ac5e4f90.vercel.app";

const statCardShell =
  "bg-[#efeeec] p-10 flex flex-col justify-center items-center text-center";

const statCardCaption = `${roboto.className} text-[0.65rem] uppercase tracking-widest text-[#5f5e5e]/60`;

const ACTIVE_LISTINGS: ActiveListingCardProps[] = [
  {
    title: "Oak dining chair",
    price: "$850.00",
    stock: 2,
    imageSrc: "",
    imageAlt: "Oak dining chair",
    showQuickManageOverlay: true,
  },
  {
    title: "Marble Bowl",
    price: "$310.00",
    stock: 1,
    imageSrc: "",
    imageAlt: "Marble Bowl",
  },
  {
    title: "Amber Glass Decanter",
    price: "$145.00",
    stock: 5,
    imageSrc: "",
    imageAlt: "Amber Glass Decanter",
  },
];

const SALES_ROWS: SaleRowItem[] = [
  {
    id: "AT-8829",
    productTitle: "Stoneware Vase",
    sku: "AT-8829",
    orderDate: "Oct 24, 2026",
    customer: "Julianne Moore",
    price: "$420.00",
    status: "awaiting_shipment",
  },
  {
    id: "AT-1092",
    productTitle: "Salt Set",
    sku: "AT-1092",
    orderDate: "Oct 21, 2026",
    customer: "John Smith",
    price: "$185.00",
    status: "delivered",
  },
];

const TIER_ORDER: any = {
  free: 0,
  pro: 1,
  enterprise: 2,
};

function hasAccess(
  userTier: string | undefined,
  requiredTier: string,
): boolean {
  const user = TIER_ORDER[userTier || "free"] ?? 0;
  const required = TIER_ORDER[requiredTier] ?? 0;

  return user >= required;
}

export default function SalesPage() {
  const { tier, loading: userLoading } = useUser();

  const [basic, setBasic] = useState<any>(null);
  const [pro, setPro] = useState<any>(null);
  const [enterprise, setEnterprise] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const canAccessPro = hasAccess(tier, "pro");
  const canAccessEnterprise = hasAccess(tier, "enterprise");

  useEffect(() => {
    if (userLoading) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setAnalyticsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchJson = async <T,>(path: string): Promise<T | null> => {
      try {
        const res = await fetch(`${backendUrl}${path}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return null;

        return (await res.json()) as T;
      } catch (error: any) {
        console.log(error);
        return null;
      }
    };

    const loadAll = async () => {
      const [basicData, proData, enterpriseData] = await Promise.all([
        fetchJson<BasicAnalytics>("/v1/analytics/basic"),
        canAccessPro ? fetchJson<ProAnalytics>("/v1/analytics/pro") : null,
        canAccessEnterprise
          ? fetchJson<EnterpriseAnalytics>("/v1/analytics/enterprise")
          : null,
      ]);

      if (cancelled) return;

      setBasic(basicData);
      setPro(proData);
      setEnterprise(enterpriseData);

      if (!basicData) {
        setFetchError("Could not load analytics. Please refresh.");
      }

      setAnalyticsLoading(false);
    };

    loadAll();

    return () => {
      cancelled = true;
    };
  }, [canAccessPro, canAccessEnterprise]);

  return (
    <main className="bg-[#F9F8F6] min-h-screen w-full flex flex-col">
      <SubpageHeader title="Sales" />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage="sales" />

        <div className="flex-1 overflow-y-auto bg-[#faf9f7] flex flex-col min-h-0 text-[#1a1c1b]">
          <div className="w-full max-w-[1400px] px-8 md:px-12 lg:px-16 pt-8 md:pt-12 lg:pt-16">
            <header className="w-full flex justify-between items-end pb-10">
              <PageSectionHeading
                title="Your Sales"
                description="Page description here"
              />
              {!userLoading && tier && (
                <span
                  className={`${roboto.className} text-[0.65rem] uppercase tracking-[0.2em] px-3 py-1 border ${
                    tier === "enterprise"
                      ? "border-[#1a1c1b] text-[#1a1c1b]"
                      : tier === "pro"
                        ? "border-[#775a19] text-[#775a19]"
                        : "border-[#5f5e5e]/40 text-[#5f5e5e]"
                  }`}
                >
                  {tier} plan
                </span>
              )}
            </header>

            {fetchError && (
              <div className="mb-10 px-6 py-4 bg-red-50 border border-red-200 flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500">error</span>
                <span className={`${roboto.className} text-sm text-red-800`}>{fetchError}</span>
              </div>
            )}

            <section className="pb-24">
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 md:col-span-5 bg-[#f4f3f1] p-10 flex flex-col justify-between">
                  <div>
                    <span
                      className={`${roboto.className} text-[0.7rem] uppercase tracking-widest text-[#775a19] mb-2 block`}
                    >
                      Performance Overview
                    </span>
                    <h2
                      className={`${gelasio.className} text-5xl font-light text-[#1a1c1b]`}
                    >
                      $12,450.00
                    </h2>
                    <p
                      className={`${roboto.className} text-sm text-[#5f5e5e]/70 mt-2 italic`}
                    >
                      Total Revenue this Quarter
                    </p>
                  </div>
                  <div className="mt-12 flex items-center gap-2 text-[#775a19]">
                    <span className="material-symbols-outlined">
                      trending_up
                    </span>
                    <span className={`${roboto.className} text-sm font-bold`}>
                      +12.4% from last month
                    </span>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-8">
                  <div className={statCardShell}>
                    <h3
                      className={`${gelasio.className} text-4xl mb-1 text-[#1a1c1b]`}
                    >
                      8
                    </h3>
                    <p className={statCardCaption}>Active Listings</p>
                  </div>
                  <div className={statCardShell}>
                    <h3
                      className={`${gelasio.className} text-4xl mb-1 text-[#1a1c1b]`}
                    >
                      24
                    </h3>
                    <p className={statCardCaption}>Items Sold</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="pb-24">
              <div className="flex justify-between items-end mb-10">
                <div className="max-w-md">
                  <h3 className={`${gelasio.className} text-3xl mb-4`}>
                    Recent Sales
                  </h3>
                  <p
                    className={`${roboto.className} text-sm text-[#5f5e5e] leading-relaxed`}
                  >
                    Sales tab description here.
                  </p>
                </div>
              </div>

              <div className="overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr
                      className={`${roboto.className} text-[0.65rem] uppercase tracking-widest text-[#5f5e5e] bg-[#f4f3f1]`}
                    >
                      <th className="px-6 py-4 font-medium">Product Detail</th>
                      <th className="px-6 py-4 font-medium">Order Date</th>
                      <th className="px-6 py-4 font-medium">Customer</th>
                      <th className="px-6 py-4 font-medium">Price</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SALES_ROWS.map((item) => (
                      <SalesTableRow key={item.id} item={item} />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="pb-24">
              <div className="flex justify-between items-center mb-10">
                <h3 className={`${gelasio.className} text-3xl`}>
                  Active Listings
                </h3>
                <div className="flex gap-4">
                  <div className="relative group">
                    <label htmlFor="sales-inventory-search" className="sr-only">
                      Search inventory
                    </label>
                    <input
                      id="sales-inventory-search"
                      type="search"
                      placeholder="Search inventory..."
                      className={`${roboto.className} bg-[#f4f3f1] border-b border-[#d1c5b4]/30 px-4 py-2 text-xs focus:outline-none focus:border-[#775a19] w-64 transition-all`}
                    />
                    <span className="material-symbols-outlined absolute right-2 top-2 text-[#5f5e5e] opacity-40 pointer-events-none">
                      search
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {ACTIVE_LISTINGS.map((listing) => (
                  <ActiveListingCard key={listing.title} {...listing} />
                ))}

                <button
                  type="button"
                  className="group cursor-pointer border-2 border-dashed border-[#d1c5b4]/30 hover:border-[#775a19]/50 transition-colors text-left w-full"
                >
                  <div className="aspect-[4/5] flex flex-col items-center justify-center text-center p-8">
                    <span className="material-symbols-outlined text-4xl text-[#5f5e5e]/30 group-hover:text-[#775a19] transition-colors mb-4">
                      add_circle
                    </span>
                    <p
                      className={`${roboto.className} text-[0.7rem] uppercase tracking-widest text-[#5f5e5e]/60`}
                    >
                      New Listing
                    </p>
                    <p
                      className={`${roboto.className} text-[0.6rem] text-[#5f5e5e]/40 mt-2 px-4`}
                    >
                      Description here (Upload Image here).
                    </p>
                  </div>
                </button>
              </div>
            </section>
          </div>
          <div className="p-8 md:p-12 lg:p-16 max-w">
            <Footer />
          </div>
        </div>
      </div>
    </main>
  );
}
