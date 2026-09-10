<template>
  <div class="form-field">
    <label class="form-field__label" :for="inputId">{{ label }}</label>
    <slot />
    <p v-if="errore" class="form-field__error" role="alert">{{ errore }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  inputId: string;
  errore?: string;
}>();
</script>

<style scoped>
.form-field {
  flex: 1 1 140px;
}

.form-field__label {
  display: block;
  margin-bottom: 7px;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #94a3b8;
}

.form-field__error {
  margin: 6px 0 0;
  font-size: 0.72rem;
  color: #f87171;
}
</style>
