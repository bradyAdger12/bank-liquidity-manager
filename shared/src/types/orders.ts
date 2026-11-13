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

export interface OrderListResponse {
  orders: Order[];
}
