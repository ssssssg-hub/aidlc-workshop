// API Response Types
export interface Category {
  id: number;
  name: string;
  displayOrder: number;
}

export interface Menu {
  id: number;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  categoryId: number;
  displayOrder: number;
}

export type OrderStatus = 'PENDING' | 'PREPARING' | 'COMPLETED';

export interface OrderItem {
  menuName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
}

export interface Recommendation {
  items: RecommendationItem[];
  totalAmount: number;
}

export interface RecommendationItem {
  menuId: number;
  menuName: string;
  quantity: number;
  unitPrice: number;
}

// Auth Types
export interface TableLoginRequest {
  storeIdentifier: string;
  tableNumber: number;
  password: string;
}

export interface TableLoginResponse {
  token: string;
  sessionId: string;
}

// Cart Types
export interface CartItem {
  menuId: number;
  menuName: string;
  unitPrice: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: { menuId: number; menuName: string; unitPrice: number } }
  | { type: 'REMOVE_ITEM'; payload: { menuId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { menuId: number; quantity: number } }
  | { type: 'CLEAR' }
  | { type: 'RESTORE'; payload: CartItem[] };

// Auth State
export interface AuthState {
  token: string | null;
  sessionId: string | null;
  storeId: string | null;
  tableId: number | null;
  isAuthenticated: boolean;
}

export type AuthAction =
  | { type: 'LOGIN'; payload: { token: string; sessionId: string; storeId: string; tableId: number } }
  | { type: 'LOGOUT' };

// API Request Types
export interface CreateOrderRequest {
  storeId: string;
  tableId: number;
  sessionId: string;
  items: { menuId: number; menuName: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
}

export interface RecommendRequest {
  partySize: number;
  diningType: 'SHARE' | 'INDIVIDUAL';
}
