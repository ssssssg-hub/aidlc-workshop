// Auth
export interface LoginRequest {
  storeId: string;
  username: string;
  password: string;
}

export interface TokenResponse {
  token: string;
  expiresIn: number;
}

// Menu
export interface Category {
  id: number;
  name: string;
  displayOrder: number;
}

export interface Menu {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
}

export interface CreateMenuRequest {
  name: string;
  price: number;
  description?: string;
  categoryId: number;
  imageUrl?: string;
  displayOrder?: number;
}

export interface UpdateMenuRequest extends CreateMenuRequest {}

export interface MenuOrderRequest {
  menuId: number;
  displayOrder: number;
}

// Order
export interface OrderItem {
  id: number;
  menuId: number;
  menuName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  storeId: number;
  tableId: number;
  sessionId: number;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'PENDING' | 'PREPARING' | 'COMPLETED';

export interface UpdateStatusRequest {
  status: OrderStatus;
}

// Table
export interface TableStatus {
  id: number;
  tableNumber: number;
  activeSessionId: number | null;
  orders: Order[];
  totalAmount: number;
}

export interface SetupTableRequest {
  tableNumber: number;
  password: string;
}

export interface TableResponse {
  id: number;
  tableNumber: number;
}

// Order History
export interface OrderHistoryItem {
  menuName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderHistory {
  id: number;
  originalOrderId: number;
  orderNumber: string;
  totalAmount: number;
  items: OrderHistoryItem[];
  orderedAt: string;
  completedAt: string;
}

// SSE Events
export type SseEventType =
  | 'NEW_ORDER'
  | 'ORDER_STATUS_CHANGED'
  | 'ORDER_DELETED'
  | 'PAYMENT_COMPLETED';

export interface SseNewOrderEvent {
  type: 'NEW_ORDER';
  order: Order;
}

export interface SseOrderStatusEvent {
  type: 'ORDER_STATUS_CHANGED';
  orderId: number;
  status: OrderStatus;
}

export interface SseOrderDeletedEvent {
  type: 'ORDER_DELETED';
  orderId: number;
  tableId: number;
}

export interface SsePaymentCompletedEvent {
  type: 'PAYMENT_COMPLETED';
  tableId: number;
}

export type SseEvent =
  | SseNewOrderEvent
  | SseOrderStatusEvent
  | SseOrderDeletedEvent
  | SsePaymentCompletedEvent;

// Image
export interface ImageResponse {
  imageUrl: string;
}

// Notification
export type NotificationSeverity = 'success' | 'error' | 'info' | 'warning';
