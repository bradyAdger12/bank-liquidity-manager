<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { YieldCurve } from "shared";
import { getYieldCurve } from "../lib/yields";
import YieldCurveChart from "../components/YieldCurveChart.vue";

const curve = ref<YieldCurve | null>(null);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    curve.value = await getYieldCurve();
  } catch (err) {
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
        <p v-if="error" class="text-error">{{ error }}</p>
        <YieldCurveChart v-else-if="curve" :curve="curve" />
        <p v-else class="text-base-content/60">Loading…</p>
      </div>
    </div>
  </div>
</template>
