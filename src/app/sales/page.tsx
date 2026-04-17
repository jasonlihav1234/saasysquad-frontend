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
import Link from "next/link";
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

function MetricBox({
  label,
  value,
  sublabel,
  valueStyle,
  accent,
}: {
  label: string;
  value: string | number;
  sublabel?: string;
  valueStyle?: string;
  accent?: "warning";
}) {
  return (
    <div className="bg-[#efeeec] p-6 flex flex-col justify-center min-h-[120px]">
      <p
        className={`${roboto.className} text-[0.6rem] uppercase tracking-widest text-[#5f5e5e]/60 mb-2`}
      >
        {label}
      </p>
      <h4
        className={`${gelasio.className} text-2xl ${valueStyle || ""} ${
          accent === "warning" ? "text-[#ba1a1a]" : "text-[#1a1c1b]"
        }`}
      >
        {value}
      </h4>
      {sublabel && (
        <p
          className={`${roboto.className} text-[0.65rem] text-[#5f5e5e]/50 mt-1`}
        >
          {sublabel}
        </p>
      )}
    </div>
  );
}

function MiniBarChart({
  data,
}: {
  data: { month: string; revenue: number }[];
}) {
  const max = useMemo(() => Math.max(...data.map((d) => d.revenue), 1), [data]);

  return (
    <div className="flex items-end justify-between gap-4 h-32">
      {data.map((d) => {
        const heightPct = (d.revenue / max) * 100;
        return (
          <div
            key={d.month}
            className="flex-1 flex flex-col items-center gap-2"
          >
            <div className="w-full flex items-end h-24">
              <div
                className="w-full bg-[#775a19] transition-all duration-500"
                style={{ height: `${heightPct}%` }}
              />
            </div>
            <span
              className={`${roboto.className} text-[0.65rem] uppercase tracking-widest text-[#5f5e5e]/60`}
            >
              {d.month}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block bg-[#d1c5b4]/30 animate-pulse ${className}`}
    />
  );
}

function BasicSection({
  data,
  loading,
}: {
  data: BasicAnalytics | null;
  loading: boolean;
}) {
  const revenue = loading
    ? "—"
    : `$${(data?.revenueThisQuarter ?? 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

  const mom = data?.monthOverMonth;
  const momLabel = loading
    ? "—"
    : mom !== null && mom !== undefined
      ? `${mom >= 0 ? "+" : ""}${mom}% from last month`
      : "Not enough history yet";
  const momPositive = (mom ?? 0) >= 0;

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 md:col-span-5 bg-[#f4f3f1] p-10 flex flex-col justify-between min-h-[220px]">
        <div>
          <span
            className={`${roboto.className} text-[0.7rem] uppercase tracking-widest text-[#775a19] mb-2 block`}
          >
            Performance Overview
          </span>
          <h2
            className={`${gelasio.className} text-5xl font-light text-[#1a1c1b]`}
          >
            {loading ? <Skeleton className="h-12 w-48" /> : revenue}
          </h2>
          <p
            className={`${roboto.className} text-sm text-[#5f5e5e]/70 mt-2 italic`}
          >
            Total Revenue this Quarter
          </p>
        </div>
        <div
          className={`mt-12 flex items-center gap-2 ${momPositive ? "text-[#775a19]" : "text-red-600"}`}
        >
          <span className="material-symbols-outlined">
            {momPositive ? "trending_up" : "trending_down"}
          </span>
          <span className={`${roboto.className} text-sm font-bold`}>
            {momLabel}
          </span>
        </div>
      </div>

      <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-8">
        <div className={statCardShell}>
          <h3 className={`${gelasio.className} text-4xl mb-1 text-[#1a1c1b]`}>
            {loading ? (
              <Skeleton className="h-10 w-12" />
            ) : (
              (data?.activeListings ?? 0)
            )}
          </h3>
          <p className={statCardCaption}>Active Listings</p>
        </div>
        <div className={statCardShell}>
          <h3 className={`${gelasio.className} text-4xl mb-1 text-[#1a1c1b]`}>
            {loading ? (
              <Skeleton className="h-10 w-12" />
            ) : (
              (data?.itemsSoldTotal ?? 0)
            )}
          </h3>
          <p className={statCardCaption}>Items Sold</p>
        </div>
      </div>
    </div>
  );
}

const MOCK_PRO: ProAnalytics = {
  conversionRate: 3.8,
  averageOrderValue: 518.75,
  viewsToSales: 2834,
  repeatBuyerRate: 28,
  topCategory: { name: "Furniture", revenue: 6240 },
  revenueByMonth: [
    { month: "Jul", revenue: 3200 },
    { month: "Aug", revenue: 4100 },
    { month: "Sep", revenue: 5150 },
    { month: "Oct", revenue: 6240 },
  ],
};

const MOCK_ENTERPRISE: EnterpriseAnalytics = {
  forecastNextQuarter: 18200,
  customerLifetimeValue: 1840,
  uniqueBuyers: 62,
  churnRiskCount: 3,
  inventoryTurnoverDays: 47,
  competitivePosition: "strong",
  marketShareSegment: 75.4,
};

function ProSection({
  data,
  loading,
}: {
  data: ProAnalytics | null;
  loading: boolean;
}) {
  const d = data ?? MOCK_PRO;

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 md:col-span-6 bg-[#f4f3f1] p-10 flex flex-col justify-between min-h-[280px]">
        <div>
          <span
            className={`${roboto.className} text-[0.7rem] uppercase tracking-widest text-[#775a19] mb-2 block`}
          >
            Conversion Rate
          </span>
          <h2
            className={`${gelasio.className} text-6xl font-light text-[#1a1c1b]`}
          >
            {loading ? (
              <Skeleton className="h-16 w-36" />
            ) : d.conversionRate !== null ? (
              `${d.conversionRate}%`
            ) : (
              "—"
            )}
          </h2>
          <p
            className={`${roboto.className} text-sm text-[#5f5e5e]/70 mt-2 italic`}
          >
            Views converting to purchases
          </p>
        </div>
        <div className={`${roboto.className} text-xs text-[#5f5e5e]/60 mt-6`}>
          {d.conversionRate !== null
            ? d.conversionRate > 2.1
              ? "Industry avg: 2.1% — you're outperforming"
              : "Industry avg: 2.1%"
            : "Not enough view data yet"}
        </div>
      </div>

      <div className="col-span-12 md:col-span-6 grid grid-cols-1 gap-8">
        <div className="bg-[#efeeec] p-8 flex items-center justify-between">
          <div>
            <p className={statCardCaption}>Average Order Value</p>
            <h3 className={`${gelasio.className} text-3xl mt-2 text-[#1a1c1b]`}>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                `$${d.averageOrderValue.toFixed(2)}`
              )}
            </h3>
          </div>
          <span className="material-symbols-outlined text-3xl text-[#775a19]/40">
            payments
          </span>
        </div>
        <div className="bg-[#efeeec] p-8 flex items-center justify-between">
          <div>
            <p className={statCardCaption}>Repeat Buyer Rate</p>
            <h3 className={`${gelasio.className} text-3xl mt-2 text-[#1a1c1b]`}>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                `${d.repeatBuyerRate}%`
              )}
            </h3>
          </div>
          <span className="material-symbols-outlined text-3xl text-[#775a19]/40">
            refresh
          </span>
        </div>
      </div>

      <div className="col-span-12 bg-[#faf9f7] border border-[#d1c5b4]/30 p-10">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p
              className={`${roboto.className} text-[0.65rem] uppercase tracking-widest text-[#5f5e5e]/60 mb-1`}
            >
              Revenue · Last 6 months
            </p>
            <h3 className={`${gelasio.className} text-2xl text-[#1a1c1b]`}>
              Top category:{" "}
              {loading ? (
                <Skeleton className="h-7 w-28 inline-block align-middle" />
              ) : (
                (d.topCategory?.name ?? "—")
              )}
            </h3>
          </div>
          <span className={`${roboto.className} text-xs text-[#5f5e5e]/70`}>
            {loading ? (
              <Skeleton className="h-4 w-20" />
            ) : d.topCategory ? (
              `$${d.topCategory.revenue.toLocaleString()} this period`
            ) : (
              ""
            )}
          </span>
        </div>
        {loading ? (
          <Skeleton className="h-32 w-full" />
        ) : d.revenueByMonth.length > 0 ? (
          <MiniBarChart data={d.revenueByMonth} />
        ) : (
          <p className={`${roboto.className} text-sm text-[#5f5e5e]/60 italic`}>
            No sales data in the last 6 months.
          </p>
        )}
      </div>
    </div>
  );
}

function EnterpriseSection({
  data,
  loading,
}: {
  data: EnterpriseAnalytics | null;
  loading: boolean;
}) {
  const d = data ?? MOCK_ENTERPRISE;

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 md:col-span-6 bg-[#1a1c1b] text-white p-10 flex flex-col justify-between min-h-[280px]">
        <div>
          <span
            className={`${roboto.className} text-[0.7rem] uppercase tracking-widest text-white/60 mb-2 block`}
          >
            Forecast · Next Quarter
          </span>
          <h2 className={`${gelasio.className} text-6xl font-light`}>
            {loading ? (
              <Skeleton className="h-16 w-48 bg-white/10" />
            ) : (
              `$${d.forecastNextQuarter.toLocaleString()}`
            )}
          </h2>
          <p
            className={`${roboto.className} text-sm text-white/60 mt-2 italic`}
          >
            Projected based on current trajectory
          </p>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <span className="material-symbols-outlined text-white/40">
            auto_graph
          </span>
          <span className={`${roboto.className} text-xs text-white/60`}>
            Based on last 6 months · updates hourly
          </span>
        </div>
      </div>

      <div className="col-span-12 md:col-span-6 grid grid-cols-2 gap-4">
        <MetricBox
          label="Market Position"
          value={loading ? "—" : `${d.marketShareSegment}%`}
          sublabel="percentile in segment"
        />
        <MetricBox
          label="Position"
          value={loading ? "—" : d.competitivePosition}
          sublabel="vs. competitors"
          valueStyle="capitalize"
        />
        <MetricBox
          label="Customer LTV"
          value={loading ? "—" : `$${d.customerLifetimeValue.toLocaleString()}`}
          sublabel={`${d.uniqueBuyers} unique buyers`}
        />
        <MetricBox
          label="Churn Risk"
          value={loading ? "—" : d.churnRiskCount}
          sublabel="customers at risk"
          accent={d.churnRiskCount > 0 ? "warning" : undefined}
        />
      </div>

      <div className="col-span-12 bg-[#faf9f7] border border-[#d1c5b4]/30 p-8 flex items-center justify-between">
        <div>
          <p
            className={`${roboto.className} text-[0.65rem] uppercase tracking-widest text-[#5f5e5e]/60 mb-1`}
          >
            Inventory Turnover
          </p>
          <h3 className={`${gelasio.className} text-2xl text-[#1a1c1b]`}>
            {loading ? (
              <Skeleton className="h-7 w-48" />
            ) : d.inventoryTurnoverDays > 0 ? (
              <>Every {d.inventoryTurnoverDays} days</>
            ) : (
              "No sold-out items yet"
            )}
          </h3>
        </div>
        {!loading && d.inventoryTurnoverDays > 0 && (
          <div
            className={`${roboto.className} text-xs text-[#5f5e5e]/70 max-w-xs text-right`}
          >
            Average time from listing to selling out.
          </div>
        )}
      </div>
    </div>
  );
}

interface AnalyticsTierProps {
  label: string;
  tier: string;
  tierColor?: string;
  description: string;
  locked?: boolean;
  unlockCopy?: string;
  children: React.ReactNode;
}

function AnalyticsTier({
  label,
  tier,
  tierColor = "#5f5e5e",
  description,
  locked = false,
  unlockCopy,
  children,
}: AnalyticsTierProps) {
  return (
    <section className="pb-24">
      <div className="flex justify-between items-end mb-10">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`${roboto.className} text-[0.6rem] uppercase tracking-[0.2em] px-2 py-0.5 border`}
              style={{ borderColor: tierColor, color: tierColor }}
            >
              {tier}
            </span>
          </div>
          <h3 className={`${gelasio.className} text-3xl mb-3`}>{label}</h3>
          <p
            className={`${roboto.className} text-sm text-[#5f5e5e] leading-relaxed`}
          >
            {description}
          </p>
        </div>
      </div>

      <div className="relative">
        <div
          className={`transition-all duration-500 ${
            locked ? "blur-md opacity-40 pointer-events-none select-none" : ""
          }`}
          aria-hidden={locked}
        >
          {children}
        </div>

        {locked && (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="bg-[#faf9f7] border border-[#d1c5b4] p-10 max-w-md text-center shadow-[0_10px_40px_-10px_rgba(26,28,27,0.12)]">
              <span className="material-symbols-outlined text-3xl text-[#775a19] mb-4 inline-block">
                lock
              </span>
              <h4 className={`${gelasio.className} text-2xl mb-3`}>
                Reserved for {tier} members
              </h4>
              <p
                className={`${roboto.className} text-sm text-[#5f5e5e] leading-relaxed mb-8`}
              >
                {unlockCopy}
              </p>
              <Link
                href="/subscribe"
                className={`${roboto.className} inline-block px-8 py-4 bg-[#775a19] text-white text-[0.65rem] uppercase tracking-[0.2em] font-medium hover:brightness-110 transition-all duration-300 no-underline`}
              >
                Upgrade to {tier}
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
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
                <span className="material-symbols-outlined text-red-500">
                  error
                </span>
                <span className={`${roboto.className} text-sm text-red-800`}>
                  {fetchError}
                </span>
              </div>
            )}

            <AnalyticsTier
              label="Overview"
              tier="Included"
              description="Core performance metrics available to all members."
            >
              <BasicSection data={basic} loading={analyticsLoading} />
            </AnalyticsTier>

            <AnalyticsTier
              label="Advanced Insights"
              tier="Pro"
              tierColor="#775a19"
              description="Conversion metrics, buyer behavior, and trend analysis."
              locked={!canAccessPro}
              unlockCopy="Unlock deeper insights into how your listings perform, which categories drive revenue, and how often buyers return."
            >
              <ProSection
                data={canAccessPro ? pro : MOCK_PRO}
                loading={analyticsLoading && canAccessPro}
              />
            </AnalyticsTier>

            <AnalyticsTier
              label="Market Intelligence"
              tier="Enterprise"
              tierColor="#1a1c1b"
              description="Forecasting, competitive positioning, and customer lifetime value."
              locked={!canAccessEnterprise}
              unlockCopy="Predict next quarter's revenue, understand your position against competitors, and identify customers at risk of churn before you lose them."
            >
              <EnterpriseSection
                data={canAccessEnterprise ? enterprise : MOCK_ENTERPRISE}
                loading={analyticsLoading && canAccessEnterprise}
              />
            </AnalyticsTier>

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
