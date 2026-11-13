import type { CreateOrderRequest, Order } from "shared";
import { authFetch } from "./api";

export function createOrder(request: CreateOrderRequest): Promise<Order> {
  return authFetch<Order>("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
}
