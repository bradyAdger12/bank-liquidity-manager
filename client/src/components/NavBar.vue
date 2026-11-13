<script setup lang="ts">
import { useRouter } from "vue-router";
import { authToken, logout } from "../lib/auth";

const router = useRouter();

function handleLogout() {
  logout();
  router.push({ name: "home" });
}
</script>

<template>
  <div class="navbar bg-base-100 border-b border-base-200 px-4">
    <div class="flex-1">
      <router-link to="/" class="btn btn-ghost text-xl">Bank Liquidity Manager</router-link>
    </div>
    <div class="flex-none">
      <router-link v-if="!authToken" to="/login" class="btn btn-primary">Login</router-link>
      <button v-else class="btn btn-ghost" @click="handleLogout">Logout</button>
    </div>
  </div>
</template>
