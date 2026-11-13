<template>
  <div class="space-y-3">
    <p v-if="error" class="alert-banner-error">{{ error }}</p>

    <div v-else class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>Term</th>
            <th>Amount</th>
            <th>Yield %</th>
            <th>Placed by</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="4" class="text-base-content/60">Loading…</td>
          </tr>
          <tr v-else-if="orders.length === 0">
            <td colspan="4" class="text-base-content/60">No orders yet</td>
          </tr>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.term }}</td>
            <td>${{ order.amount }}</td>
            <td>{{ order.yieldPercent }}%</td>
            <td>{{ order.userEmail }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination v-model:page="page" :total-pages="totalPages" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { OrderWithUser } from "shared";
import { listOrders } from "../lib/orders";
import { ApiError } from "../lib/api";
import Pagination from "./Pagination.vue";

const PAGE_SIZE = 10;

const orders = ref<OrderWithUser[]>([]);
const total = ref(0);
const page = ref(1);
const error = ref<string | null>(null);
const isLoading = ref(false);

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)));

async function load() {
  isLoading.value = true;
  error.value = null;
  try {
    const result = await listOrders((page.value - 1) * PAGE_SIZE, PAGE_SIZE);
    orders.value = result.orders;
    total.value = result.total;
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : "Failed to load orders";
  } finally {
    isLoading.value = false;
  }
}

defineExpose({ reload: load });

watch(page, load);
onMounted(load);
</script>
