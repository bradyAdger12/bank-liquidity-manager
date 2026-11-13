<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { YieldCurve } from "shared";

const props = defineProps<{ curve: YieldCurve }>();
const chartEl = ref<HTMLDivElement | null>(null);

async function render() {
  if (!chartEl.value) return;
  const Plotly = (await import("plotly.js-dist-min")).default;

  await Plotly.newPlot(
    chartEl.value,
    [
      {
        x: props.curve.points.map((p) => p.term),
        y: props.curve.points.map((p) => p.yieldPercent),
        type: "scatter",
        mode: "lines+markers",
        line: { shape: "spline", color: "#2563eb" },
        marker: { color: "#2563eb" },
        hovertemplate: "%{x}: %{y:.2f}%<extra></extra>",
      },
    ],
    {
      margin: { t: 16, r: 16, b: 48, l: 48 },
      xaxis: { title: "Term", fixedrange: true },
      yaxis: { title: "Yield", ticksuffix: "%", fixedrange: true },
      dragmode: false,
    },
    { responsive: true, displayModeBar: false, scrollZoom: false, doubleClick: false },
  );
}

onMounted(render);
watch(() => props.curve, render);
</script>

<template>
  <div ref="chartEl" class="h-96 w-full"></div>
</template>
