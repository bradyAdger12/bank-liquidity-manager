<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../lib/auth";

const email = ref("");
const password = ref("");
const error = ref<string | null>(null);
const isSubmitting = ref(false);

const router = useRouter();

async function handleSubmit() {
  error.value = null;
  isSubmitting.value = true;
  try {
    await login(email.value, password.value);
    router.push({ name: "dashboard" });
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Login failed";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="flex justify-center items-center min-h-[60vh]">
    <form class="card w-full max-w-sm bg-base-100 shadow-md" @submit.prevent="handleSubmit">
      <div class="card-body gap-4">
        <h2 class="section-title">Login</h2>

        <label class="form-control">
          <span class="label-text">Email</span>
          <input v-model="email" type="text" class="input input-bordered" required />
        </label>

        <label class="form-control">
          <span class="label-text">Password</span>
          <input v-model="password" type="password" class="input input-bordered" required />
        </label>

        <p v-if="error" class="alert-banner-error">{{ error }}</p>

        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? "Logging in..." : "Login" }}
        </button>
      </div>
    </form>
  </div>
</template>
