const EVENT = "saved-items-changed";

const ids = new Set<string>();
let hydrated = false;

function dispatch(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EVENT));
}

export function isSaved(id: string): boolean {
  return ids.has(id);
}

export function isHydrated(): boolean {
  return hydrated;
}

export function markSaved(id: string): void {
  if (ids.has(id)) return;
  ids.add(id);
  dispatch();
}

export function hydrateSavedIds(next: string[]): void {
  ids.clear();
  for (const id of next) ids.add(id);
  hydrated = true;
  dispatch();
}

export function getSavedIds(): string[] {
  return Array.from(ids);
}

export function subscribe(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
