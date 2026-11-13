# API Call Conventions

All HTTP calls to the server go through `client/src/lib/api.ts` — never call
`fetch` directly from a component or page.

`api.ts` exports two low-level helpers:

- `apiFetch<T>(path, init)` — unauthenticated requests
- `authFetch<T>(path, init)` — attaches the bearer token and clears it on 401

Don't call these directly from components either. Instead, wrap each endpoint
in a small named function inside the relevant `client/src/lib/*.ts` file (one
file per resource — `orders.ts`, `yields.ts`, `auth.ts`), and have components
import that function. For example:

```ts
// client/src/lib/orders.ts
export function listOrders(offset: number, limit: number): Promise<OrderListResponse> {
  return authFetch<OrderListResponse>(`/api/orders?offset=${offset}&limit=${limit}`);
}
```

```vue
<script setup lang="ts">
import { listOrders } from "../lib/orders";
</script>
```

This keeps request shape, auth handling, and error handling (`ApiError`,
`handleResponse`) centralized in one place, and gives each endpoint a single
typed call site instead of ad hoc `fetch`/`authFetch` calls scattered across
components.
