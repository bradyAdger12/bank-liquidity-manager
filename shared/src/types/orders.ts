export const ORDER_AMOUNT_PATTERN = /^\d{1,16}(\.\d{1,2})?$/;

export type OrderSide = "buy" | "sell";

export interface Order {
  id: number;
  userId: number;
  term: string;
  amount: string;
  side: OrderSide;
  yieldPercent: string;
  idempotencyKey: string;
  createdAt: string;
}

export interface CreateOrderRequest {
  term: string;
  amount: string;
  side: OrderSide;
  idempotencyKey: string;
}

export interface OrderWithUser extends Order {
  userEmail: string;
}

export interface OrderListResponse {
  orders: OrderWithUser[];
  total: number;
}
