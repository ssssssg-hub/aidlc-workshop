# Domain Entities (TypeScript Types) — Unit 2: Customer App

## API Response Types

### Category
```typescript
interface Category {
  id: number;
  name: string;
  displayOrder: number;
}
```

### Menu
```typescript
interface Menu {
  id: number;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  categoryId: number;
  displayOrder: number;
}
```

### Order
```typescript
interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
}

type OrderStatus = 'PENDING' | 'PREPARING' | 'COMPLETED';

interface OrderItem {
  menuName: string;
  quantity: number;
  unitPrice: number;
}
```

### Recommendation
```typescript
interface Recommendation {
  items: RecommendationItem[];
  totalAmount: number;
}

interface RecommendationItem {
  menuId: number;
  menuName: string;
  quantity: number;
  unitPrice: number;
}
```

### Auth
```typescript
interface TableLoginRequest {
  storeIdentifier: string;
  tableNumber: number;
  password: string;
}

interface TableLoginResponse {
  token: string;
  sessionId: string;
}
```

## Client-Side Types

### CartItem
```typescript
interface CartItem {
  menuId: number;
  menuName: string;
  unitPrice: number;
  quantity: number;
}
```

### CartState
```typescript
interface CartState {
  items: CartItem[];
  totalAmount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { menuId: number; menuName: string; unitPrice: number } }
  | { type: 'REMOVE_ITEM'; payload: { menuId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { menuId: number; quantity: number } }
  | { type: 'CLEAR' }
  | { type: 'RESTORE'; payload: CartItem[] };
```

### AuthState
```typescript
interface AuthState {
  token: string | null;
  sessionId: string | null;
  storeId: string | null;
  tableId: number | null;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'LOGIN'; payload: { token: string; sessionId: string; storeId: string; tableId: number } }
  | { type: 'LOGOUT' };
```

### API Request Types

```typescript
interface CreateOrderRequest {
  storeId: string;
  tableId: number;
  sessionId: string;
  items: { menuId: number; menuName: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
}

interface RecommendRequest {
  partySize: number;
  diningType: 'SHARE' | 'INDIVIDUAL';
}
```
