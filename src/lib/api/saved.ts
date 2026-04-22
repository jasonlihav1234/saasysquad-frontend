import { authFetch } from "../../../lib/api";

const BASE_URL = "https://sassysquad-backend.vercel.app";

export interface BackendSavedItemReview {
  review_id: string;
  user_id: string;
  item_id: string;
  review: string;
  review_date: string;
  rating: number;
  user_name: string;
}

export interface BackendSavedItem {
  item_id: string;
  item_name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  itemTags: string[];
  reviews?: BackendSavedItemReview[];
}

export class SavedApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "SavedApiError";
    this.status = status;
    this.body = body;
  }
}

function stringifyError(value: unknown, fallback: string): string {
  if (typeof value === "string") return value;
  if (value == null) return fallback;
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return fallback;
    }
  }
  return String(value);
}

async function parseErrorBody(res: Response): Promise<{
  message: string;
  body: unknown;
}> {
  const raw = await res.text().catch(() => "");
  let body: unknown = raw;
  try {
    body = raw ? JSON.parse(raw) : null;
  } catch {
  }
  const fallback = `Request failed with status ${res.status}`;
  if (body && typeof body === "object") {
    const b = body as Record<string, unknown>;
    const message =
      stringifyError(b.error, "") ||
      stringifyError(b.message, "") ||
      fallback;
    return { message, body };
  }
  return { message: stringifyError(body, fallback), body };
}

export async function addSavedItem(itemId: string): Promise<void> {
  const res = await authFetch(`${BASE_URL}/saved`, {
    method: "POST",
    body: JSON.stringify({ itemId }),
  });

  if (res.ok) return;

  const { message, body } = await parseErrorBody(res);
  console.error("POST /saved failed", {
    status: res.status,
    body,
    itemId,
  });
  throw new SavedApiError(message, res.status, body);
}

export async function getSavedItemIds(userId: string): Promise<string[]> {
  const res = await authFetch(`${BASE_URL}/users/${userId}/saved`);

  if (!res.ok) {
    const { message, body } = await parseErrorBody(res);
    console.error("GET /users/{userId}/saved failed", {
      status: res.status,
      body,
      userId,
    });
    throw new SavedApiError(message, res.status, body);
  }

  const data = await res.json();
  const saved = data?.saved;
  return Array.isArray(saved) ? saved : [];
}

export async function fetchItemById(
  itemId: string,
): Promise<BackendSavedItem | null> {
  const res = await authFetch(`${BASE_URL}/items/${itemId}`);

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new SavedApiError("Failed to fetch item", res.status);
  }

  const data = await res.json();
  return data?.items?.[0] ?? null;
}
