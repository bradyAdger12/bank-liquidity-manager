<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { YieldCurve } from "shared";
import { getYieldCurve } from "../lib/yields";
import YieldCurveChart from "../components/YieldCurveChart.vue";
import OrderForm from "../components/OrderForm.vue";

const curve = ref<YieldCurve | null>(null);
const error = ref<string | null>(null);
const fetchedAt = ref<Date | null>(null);

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
    <h1 class="text-2xl font-semibold">Dashboard</h1>

    <div class="card bg-base-100 border border-base-200 shadow-sm">
      <div class="card-body">
        <h2 class="card-title text-lg">Treasury Yield Curve</h2>
        <p v-if="fetchedAt" class="text-base-content/60 text-sm">
          Last updated: {{ localFormatter.format(fetchedAt) }} ({{ easternFormatter.format(fetchedAt) }})
        </p>
        <p class="text-warning-content bg-warning/20 border border-warning/40 rounded-md px-3 py-2 text-sm">
          Treasury updates these yields at 4:15pm Eastern, Monday–Friday. If loaded before then, the curve
          may reflect the prior day's rates.
        </p>
        <p v-if="error" class="text-error">{{ error }}</p>
        <YieldCurveChart v-else-if="curve" :curve="curve" />
        <p v-else class="text-base-content/60">Loading…</p>
      </div>
    </div>

    <div class="card bg-base-100 border border-base-200 shadow-sm max-w-sm">
      <div class="card-body">
        <h2 class="card-title text-lg">Place Order</h2>
        <OrderForm v-if="curve" :terms="curve.points.map((p) => p.term)" />
        <p v-else class="text-base-content/60">Loading…</p>
      </div>
    </div>
  </div>
</template>
