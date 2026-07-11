"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import * as cartStore from "@/lib/cart-store";
import { CartItem } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (slug: string, color: string) => void;
  updateQuantity: (slug: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot
  );
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const addItem = useCallback(
    (item: CartItem) => {
      cartStore.addItem(item);
      setDrawerOpen(true);
    },
    []
  );

  const totalItems = useMemo(() => items.reduce((sum, line) => sum + line.quantity, 0), [items]);
  const totalPrice = useMemo(
    () => items.reduce((sum, line) => sum + line.quantity * line.price, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      removeItem: cartStore.removeItem,
      updateQuantity: cartStore.updateQuantity,
      clearCart: cartStore.clearCart,
      totalItems,
      totalPrice,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
    }),
    [items, addItem, totalItems, totalPrice, isDrawerOpen, openDrawer, closeDrawer]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart, CartProvider içinde kullanılmalıdır");
  return ctx;
}
