import type { CreateOrderRequest, Order, OrderListResponse } from "shared";
import { authFetch } from "./api";

export function createOrder(request: CreateOrderRequest): Promise<Order> {
  return authFetch<Order>("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
}

export function listOrders(offset: number, limit: number): Promise<OrderListResponse> {
  return authFetch<OrderListResponse>(`/api/orders?offset=${offset}&limit=${limit}`);
}
