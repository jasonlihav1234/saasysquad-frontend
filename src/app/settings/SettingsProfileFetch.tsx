"use client";

import { useEffect } from "react";
import type { AccountFormValues } from "@/components/user-settings/settings/AccountForm";

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
  const rowRaw =
    Array.isArray(response) && response.length > 0 ? response[0] : null;
  if (!rowRaw || typeof rowRaw !== "object") return null;
  const row = rowRaw as Record<string, unknown>;

  const email = asTrimmedString(row.email) ?? "";
  const biography = asTrimmedString(row.biography) ?? "";

  const first =
    asTrimmedString(row.first_name) ?? asTrimmedString(row.firstName);
  const last = asTrimmedString(row.last_name) ?? asTrimmedString(row.lastName);
  if (first !== undefined || last !== undefined) {
    return {
      firstName: first ?? "",
      lastName: last ?? "",
      email,
      biography,
    };
  }

  const userName = asTrimmedString(row.user_name) ?? "";
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
