<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { YieldCurve } from "shared";
import { getYieldCurve } from "../lib/yields";
import YieldCurveChart from "../components/YieldCurveChart.vue";
import OrderForm from "../components/OrderForm.vue";
import OrdersList from "../components/OrdersList.vue";

const curve = ref<YieldCurve | null>(null);
const error = ref<string | null>(null);
const fetchedAt = ref<Date | null>(null);
const ordersList = ref<InstanceType<typeof OrdersList> | null>(null);

const localFormatter = new Intl.DateTimeFormat('en-US', {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short",
});
const easternFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short",
  timeZone: "America/New_York",
});

onMounted(async () => {
  try {
    curve.value = await getYieldCurve();
    fetchedAt.value = new Date();
  } catch (err) {
    console.log('error')
    error.value = err instanceof Error ? err.message : "Failed to load yield curve";
  }
});
</script>

<template>
  <div class="p-6 space-y-4">
    <h1 class="page-title">Dashboard</h1>

    <div class="card bg-base-100 border border-base-200 shadow-sm">
      <div class="card-body">
        <h2 class="section-title">Treasury Yield Curve</h2>
        <p v-if="fetchedAt" class="field-hint">
          Last updated: {{ localFormatter.format(fetchedAt) }} ({{ easternFormatter.format(fetchedAt) }})
        </p>
        <p class="alert-banner-warning">
          Treasury updates these yields at 4:15pm Eastern, Monday–Friday. If loaded before then, the curve
          may reflect the prior day's rates.
        </p>
        <p v-if="error" class="alert-banner-error">{{ error }}</p>
        <YieldCurveChart v-else-if="curve" :curve="curve" />
        <p v-else class="text-base-content/60">Loading…</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
      <div class="card bg-base-100 border border-base-200 shadow-sm lg:col-span-1">
        <div class="card-body">
          <h2 class="section-title">Place Order</h2>
          <OrderForm
            v-if="curve"
            :terms="curve.points.map((p) => p.term)"
            @placed="ordersList?.reload()"
          />
          <p v-else-if="!error" class="text-base-content/60">Loading…</p>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-200 shadow-sm lg:col-span-2">
        <div class="card-body">
          <h2 class="section-title">Orders</h2>
          <OrdersList ref="ordersList" />
        </div>
      </div>
    </div>
  </div>
</template>
