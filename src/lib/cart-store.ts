import { CartItem } from "./types";

const STORAGE_KEY = "otopolik-cart";

let items: CartItem[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function readFromStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  items = readFromStorage();
  hydrated = true;
}

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function emit() {
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): CartItem[] {
  ensureHydrated();
  return items;
}

export function getServerSnapshot(): CartItem[] {
  return [];
}

function setItems(next: CartItem[]) {
  items = next;
  persist();
  emit();
}

export function addItem(item: CartItem) {
  ensureHydrated();
  const existing = items.find((line) => line.slug === item.slug && line.color === item.color);
  if (existing) {
    setItems(
      items.map((line) =>
        line.slug === item.slug && line.color === item.color
          ? { ...line, quantity: line.quantity + item.quantity }
          : line
      )
    );
  } else {
    setItems([...items, item]);
  }
}

export function removeItem(slug: string, color: string) {
  ensureHydrated();
  setItems(items.filter((line) => !(line.slug === slug && line.color === color)));
}

export function updateQuantity(slug: string, color: string, quantity: number) {
  ensureHydrated();
  setItems(
    items
      .map((line) => (line.slug === slug && line.color === color ? { ...line, quantity } : line))
      .filter((line) => line.quantity > 0)
  );
}

export function clearCart() {
  ensureHydrated();
  setItems([]);
}
