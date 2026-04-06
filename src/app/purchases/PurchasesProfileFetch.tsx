"use client";

import { useEffect } from "react";

const BACKEND_BASE = "https://sassysquad-backend.vercel.app";
const PROFILE_URL = `${BACKEND_BASE}/profile`;

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
  if (typeof refresh === "string") localStorage.setItem("refreshToken", refresh);
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
): Promise<void> {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.log("purchases no accessToken for purchases request");
    return;
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
    await fetchUserPurchases(userId, true);
    return;
  }

  const data: unknown = await res.json().catch(() => null);
  console.log("[purchases] GET /users/{userId}/purchases", {
    status: res.status,
    ok: res.ok,
    body: data,
  });
}

export function PurchasesProfileFetch() {
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

      await fetchUserPurchases(userId, false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
