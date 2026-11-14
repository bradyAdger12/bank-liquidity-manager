<script setup lang="ts">
import { ref } from "vue";
import { ORDER_AMOUNT_PATTERN, type Order } from "shared";
import { createOrder } from "../lib/orders";
import { ApiError } from "../lib/api";
import { formatAmount } from "../lib/util";

const props = defineProps<{ terms: string[] }>();
const emit = defineEmits<{ placed: [order: Order] }>();

const CONFIRM_WORD = "confirm";

const term = ref("");
const amount = ref("");
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const isSubmitting = ref(false);

const confirmDialog = ref<HTMLDialogElement | null>(null);
const confirmText = ref("");
const idempotencyKey = ref("");
const isConfirmed = () => confirmText.value.trim().toLowerCase() === CONFIRM_WORD;

function validate(): string | null {
  if (!term.value) return "Select a term";
  if (!amount.value) return "Enter an amount greater than 0";
  if (!ORDER_AMOUNT_PATTERN.test(amount.value)) {
    return "Enter a valid amount with up to 16 digits and 2 decimal places";
  }
  if (Number(amount.value) <= 0) return "Enter an amount greater than 0";
  return null;
}

function handleSubmit() {
  error.value = null;
  successMessage.value = null;

  const validationError = validate();
  if (validationError) {
    error.value = validationError;
    return;
  }

  confirmText.value = "";
  idempotencyKey.value = crypto.randomUUID();
  confirmDialog.value?.showModal();
}

function cancelConfirm() {
  confirmDialog.value?.close();
}

async function confirmOrder() {
  if (!isConfirmed()) return;

  isSubmitting.value = true;
  try {
    const order = await createOrder({
      term: term.value,
      amount: amount.value,
      side: "buy",
      idempotencyKey: idempotencyKey.value,
    });
    successMessage.value = `Order placed: ${order.term} for $${formatAmount(order.amount)}`;
    term.value = "";
    amount.value = "";
    emit("placed", order);
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : "Failed to place order";
  } finally {
    isSubmitting.value = false;
    confirmDialog.value?.close();
  }
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <label class="form-control">
      <span class="label-text">Term</span>
      <select v-model="term" class="select select-bordered">
        <option value="" disabled>Select a term</option>
        <option v-for="t in props.terms" :key="t" :value="t">{{ t }}</option>
      </select>
    </label>

    <label class="form-control">
      <span class="label-text">Amount (USD)</span>
      <input
        v-model="amount"
        type="text"
        inputmode="decimal"
        placeholder="0.00"
        class="input input-bordered"
      />
      <span class="field-hint">
        Enter digits only, no commas (e.g. 10000.50)
      </span>
    </label>

    <p v-if="error" class="alert-banner-error">{{ error }}</p>
    <p v-if="successMessage" class="alert-banner-success">{{ successMessage }}</p>

    <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
      {{ isSubmitting ? "Placing order..." : "Place order" }}
    </button>
  </form>

  <dialog ref="confirmDialog" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Confirm order</h3>
      <p class="py-4">
        You are about to place an order for <strong>${{ formatAmount(amount) }}</strong> of the
        <strong>{{ term }}</strong> term.
      </p>

      <label class="form-control">
        <span class="label-text">Type <strong>confirm</strong> to proceed</span>
        <input
          v-model="confirmText"
          type="text"
          class="input input-bordered"
          autocomplete="off"
          @keyup.enter="confirmOrder"
        />
      </label>

      <div class="modal-action">
        <button type="button" class="btn" @click="cancelConfirm">Cancel</button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="!isConfirmed() || isSubmitting"
          @click="confirmOrder"
        >
          {{ isSubmitting ? "Placing order..." : "Confirm" }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
