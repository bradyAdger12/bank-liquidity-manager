<template>
  <div class="flex items-center justify-between" v-if="totalPages > 1">
    <button class="btn btn-sm" :disabled="page <= 1" @click="goTo(page - 1)">Prev</button>
    <span class="text-sm text-base-content/60">Page {{ page }} of {{ totalPages }}</span>
    <button class="btn btn-sm" :disabled="page >= totalPages" @click="goTo(page + 1)">Next</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ page: number; totalPages: number }>();
const emit = defineEmits<{ "update:page": [page: number] }>();

function goTo(page: number) {
  if (page < 1 || page > props.totalPages || page === props.page) return;
  emit("update:page", page);
}
</script>
