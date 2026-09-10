<template>
  <div class="result-display" data-axiom-section="result">
    <p class="result-display__label">Il tuo codice fiscale</p>
    <p class="result-display__value">{{ codiceFiscale ?? SEGNAPOSTO_RISULTATO }}</p>
    <div v-if="copiaDisponibile" class="result-display__actions">
      <button type="button" class="result-display__copy">Copia</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RisultatoCodiceFiscale } from '../features/fiscalCode.types';

withDefaults(defineProps<RisultatoCodiceFiscale>(), {
  codiceFiscale: null,
  copiaDisponibile: false,
});

const SEGNAPOSTO_RISULTATO = '\u2014 \u2014 \u2014';
</script>

<style scoped>
.result-display {
  padding: 28px 20px 22px;
  margin-bottom: 28px;
  border-radius: 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
}

.result-display__label {
  margin: 0 0 10px;
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #94a3b8;
}

.result-display__value {
  min-height: 54px;
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: #f0f0ff;
}

.result-display__actions {
  display: flex;
  justify-content: center;
  margin-top: 14px;
}

.result-display__copy {
  padding: 8px 22px;
  font-size: 0.82rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
