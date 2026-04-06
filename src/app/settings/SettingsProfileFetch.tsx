"use client";

import { useEffect } from "react";
import type { AccountFormValues } from "@/components/user-settings/settings/AccountForm";

function asTrimmedString(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}

/**
 * Maps GET /profile JSON to form state.
 * Contract (cursor.md): `{ message, response: [{ user_id, user_name, email, password_hash, created_at }] }`.
 * Biography is not in the documented GET body; if present on the row we still map it for forward compatibility.
 */
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

type SettingsProfileFetchProps = {
  onLoaded: (values: AccountFormValues) => void;
};

export function SettingsProfileFetch({ onLoaded }: SettingsProfileFetchProps) {
  useEffect(() => {
    const run = () => {
      fetch("https://sassysquad-backend.vercel.app/profile", {
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
