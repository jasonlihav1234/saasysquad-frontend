import type { SavedItemProps } from "@/components/user-settings/saved/SavedItemCard";

const KEY = "saved_items";
const EVENT = "saved-items-changed";

export function getSavedItems(): SavedItemProps[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isSaved(id: string): boolean {
  return getSavedItems().some((i) => i.id === id);
}

export function addSavedItem(item: SavedItemProps): void {
  if (typeof window === "undefined") return;
  const current = getSavedItems();
  if (current.some((i) => i.id === item.id)) return;
  const next = [...current, item];
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
}

export function removeSavedItem(id: string): void {
  if (typeof window === "undefined") return;
  const next = getSavedItems().filter((i) => i.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
}

export function subscribe(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
