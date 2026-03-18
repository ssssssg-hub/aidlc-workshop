import { createContext, useContext, useReducer, useEffect, useMemo, type ReactNode } from 'react';
import type { CartState, CartAction, CartItem } from '../types';
import { getItem, setItem } from '../utils/storage';

const STORAGE_KEY = 'cart_items';

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

function calcTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
}

function cartReducer(state: CartState, action: CartAction): CartState {
  let items: CartItem[];
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.menuId === action.payload.menuId);
      items = existing
        ? state.items.map((i) => (i.menuId === action.payload.menuId ? { ...i, quantity: i.quantity + 1 } : i))
        : [...state.items, { ...action.payload, quantity: 1 }];
      return { items, totalAmount: calcTotal(items) };
    }
    case 'REMOVE_ITEM':
      items = state.items.filter((i) => i.menuId !== action.payload.menuId);
      return { items, totalAmount: calcTotal(items) };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        items = state.items.filter((i) => i.menuId !== action.payload.menuId);
      } else {
        items = state.items.map((i) =>
          i.menuId === action.payload.menuId ? { ...i, quantity: action.payload.quantity } : i,
        );
      }
      return { items, totalAmount: calcTotal(items) };
    case 'CLEAR':
      return { items: [], totalAmount: 0 };
    case 'RESTORE':
      return { items: action.payload, totalAmount: calcTotal(action.payload) };
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const initial: CartState = useMemo(() => {
    const saved = getItem<CartItem[]>(STORAGE_KEY, []);
    return { items: saved, totalAmount: calcTotal(saved) };
  }, []);

  const [state, dispatch] = useReducer(cartReducer, initial);

  useEffect(() => {
    setItem(STORAGE_KEY, state.items);
  }, [state.items]);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
