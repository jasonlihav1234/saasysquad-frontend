"use client";

import { useEffect } from "react";
import type {
  AccountFormValues,
  SaveProfileResult,
} from "@/components/user-settings/settings/AccountForm";

const PROFILE_URL = "https://sassysquad-backend.vercel.app/profile";

function asTrimmedString(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}

export function mapGetProfileJsonToForm(
  json: unknown,
): AccountFormValues | null {
  if (!json || typeof json !== "object") return null;
  const root = json as Record<string, unknown>;
  const response = root.response;
  if (!Array.isArray(response) || response.length === 0) return null;
  const rowRaw = response[0];
  if (!rowRaw || typeof rowRaw !== "object") return null;
  const row = rowRaw as Record<string, unknown>;

  const email = asTrimmedString(row.email) ?? "";
  const userName = asTrimmedString(row.user_name) ?? "";
  const biography = asTrimmedString(row.biography) ?? "";

  const spaceIdx = userName.indexOf(" ");
  if (spaceIdx === -1) {
    return {
      firstName: userName,
      lastName: "",
      email,
      biography,
    };
  }
  return {
    firstName: userName.slice(0, spaceIdx).trim(),
    lastName: userName.slice(spaceIdx + 1).trim(),
    email,
    biography,
  };
}

export function userNameFromAccountForm(values: AccountFormValues): string {
  const parts = [values.firstName.trim(), values.lastName.trim()].filter(
    (p) => p.length > 0,
  );
  return parts.join(" ");
}

export async function patchProfileFromForm(
  values: AccountFormValues,
): Promise<SaveProfileResult> {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return { ok: false, error: "Not signed in." };
  }

  const username = userNameFromAccountForm(values);
  const email = values.email.trim();
  const biography = values.biography.trim();

  try {
    const response = await fetch(PROFILE_URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        accessToken,
        email,
        username,
        biography,
      }),
    });

    if (response.status === 200) {
      return { ok: true };
    }

    const data: unknown = await response.json().catch(() => null);
    let message = `Update failed (${response.status}).`;
    if (data && typeof data === "object") {
      const rec = data as Record<string, unknown>;
      const m = rec.message ?? rec.error;
      if (typeof m === "string" && m.trim()) message = m.trim();
    }
    return { ok: false, error: message };
  } catch {
    return { ok: false, error: "Network error. Try again." };
  }
}

type SettingsProfileFetchProps = {
  onLoaded: (values: AccountFormValues) => void;
};

export function SettingsProfileFetch({ onLoaded }: SettingsProfileFetchProps) {
  useEffect(() => {
    const run = () => {
      fetch(PROFILE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
        .then((response) => {
          if (response.status !== 200) return null;
          return response.json();
        })
        .then((data: unknown) => {
          if (data == null) return;
          const mapped = mapGetProfileJsonToForm(data);
          if (mapped) onLoaded(mapped);
        })
        .catch(() => {});
    };
    run();
  }, [onLoaded]);

  return null;
}
