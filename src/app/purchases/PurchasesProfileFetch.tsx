"use client";

import { useEffect } from "react";
import type { PurchaseOrderRow } from "@/components/user-settings/purchases/PurchaseOrderItem";

const BACKEND_BASE = "https://sassysquad-backend.vercel.app";
const PROFILE_URL = `${BACKEND_BASE}/profile`;
const EMPTY_IMAGE = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";

function userIdFromProfileJson(json: unknown): string | null {
  if (!json || typeof json !== "object") return null;
  const root = json as Record<string, unknown>;
  const response = root.response;
  if (!Array.isArray(response) || response.length === 0) return null;
  const rowRaw = response[0];
  if (!rowRaw || typeof rowRaw !== "object") return null;
  const id = (rowRaw as Record<string, unknown>).user_id;
  if (typeof id !== "string") return null;
  const t = id.trim();
  return t.length ? t : null;
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return false;

  const res = await fetch(`${BACKEND_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (res.status !== 200) return false;

  const body = (await res.json()) as Record<string, unknown>;
  const access = body.accessToken;
  const refresh = body.refreshToken;
  if (typeof access === "string") localStorage.setItem("accessToken", access);
  if (typeof refresh === "string")
    localStorage.setItem("refreshToken", refresh);
  return true;
}

async function fetchProfileJson(isRetry: boolean): Promise<unknown | null> {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.log("purchases no accessToken in localStorage");
    return null;
  }

  const res = await fetch(PROFILE_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 200) {
    return res.json();
  }

  if (res.status === 401 && !isRetry && (await refreshAccessToken())) {
    return fetchProfileJson(true);
  }

  console.warn("[purchases] Profile fetch failed", res.status);
  return null;
}

async function fetchUserPurchases(
  userId: string,
  isRetry: boolean,
): Promise<unknown | null> {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.log("purchases no accessToken for purchases request");
    return null;
  }

  const url = `${BACKEND_BASE}/users/${encodeURIComponent(userId)}/purchases`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 401 && !isRetry && (await refreshAccessToken())) {
    return fetchUserPurchases(userId, true);
  }

  const data: unknown = await res.json().catch(() => null);
  console.log("[purchases] GET /users/{userId}/purchases", {
    status: res.status,
    ok: res.ok,
    body: data,
  });
  return data;
}

type PurchasesProfileFetchProps = {
  onLoaded: (purchases: PurchaseOrderRow[]) => void;
};

function asOrderList(json: unknown): Record<string, unknown>[] {
  if (!json || typeof json !== "object") return [];
  const root = json as Record<string, unknown>;
  const maybeOrders = root.orders;
  if (Array.isArray(maybeOrders)) {
    return maybeOrders.filter(
      (row): row is Record<string, unknown> =>
        !!row && typeof row === "object" && !Array.isArray(row),
    );
  }

  const maybeOrder = root.order;
  if (
    maybeOrder &&
    typeof maybeOrder === "object" &&
    !Array.isArray(maybeOrder)
  ) {
    return [maybeOrder as Record<string, unknown>];
  }

  return [];
}

function orderStatusToUiStatus(status: unknown): PurchaseOrderRow["status"] {
  if (typeof status !== "string") return "processing";
  const lower = status.trim().toLowerCase();
  if (lower === "delivered" || lower === "fulfilled" || lower === "completed") {
    return "delivered";
  }
  if (lower === "in_transit" || lower === "in transit" || lower === "shipped") {
    return "in_transit";
  }
  return "processing";
}

function currencyAndTotal(order: Record<string, unknown>): string {
  const code = order.pricingCurrencyCode;
  const total = order.totalCost;
  if (typeof total !== "number") return "$0.00";

  if (typeof code === "string" && code.trim().length > 0) {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 2,
    }).format(total);
  }

  return `$${total.toFixed(2)}`;
}

function formatIssueDate(issueDate: unknown): string {
  if (typeof issueDate !== "string" || issueDate.trim().length === 0) {
    return "Unknown date";
  }
  const parsed = new Date(issueDate);
  if (Number.isNaN(parsed.getTime())) return issueDate;
  return parsed.toLocaleDateString("en-AU", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
}

function issueDateToOrderedAtMs(issueDate: unknown): number {
  if (typeof issueDate !== "string" || issueDate.trim().length === 0) return 0;
  const t = new Date(issueDate).getTime();
  return Number.isNaN(t) ? 0 : t;
}

function mapPurchaseJsonToItems(json: unknown): PurchaseOrderRow[] {
  const orders = asOrderList(json);
  return orders.map((order) => {
    const orderIdRaw = order.orderId;
    const orderId =
      typeof orderIdRaw === "string" ? orderIdRaw : "unknown-order";
    const orderNameRaw = order.orderName;
    const orderName =
      typeof orderNameRaw === "string" && orderNameRaw.trim().length > 0
        ? orderNameRaw.trim()
        : "Purchase Order";

    return {
      imageSrc: EMPTY_IMAGE,
      status: orderStatusToUiStatus(order.status),
      productTitle: orderName,
      orderNumber: orderId.slice(0, 8).toUpperCase(),
      dateLabel: formatIssueDate(order.issueDate),
      orderedAtMs: issueDateToOrderedAtMs(order.issueDate),
      price: currencyAndTotal(order),
      actionLabel: "View Details",
    };
  });
}

export function PurchasesProfileFetch({
  onLoaded,
}: PurchasesProfileFetchProps) {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const profileJson = await fetchProfileJson(false);
      if (cancelled || profileJson == null) return;

      const userId = userIdFromProfileJson(profileJson);
      if (!userId) {
        console.log("purchases, could not read user_id from profile response");
        return;
      }

      const purchasesJson = await fetchUserPurchases(userId, false);
      if (cancelled) return;
      const items = mapPurchaseJsonToItems(purchasesJson);
      onLoaded(items);
    })();

    return () => {
      cancelled = true;
    };
  }, [onLoaded]);

  return null;
}
