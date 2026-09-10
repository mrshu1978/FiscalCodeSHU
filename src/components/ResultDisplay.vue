<template>
  <div
    class="result-display"
    data-axiom-section="result"
    :class="{ 'result-display--attivo': isRisultatoAttivo }"
  >
    <p class="result-display__label">Il tuo codice fiscale</p>
    <p class="result-display__value">
      <span
        v-for="(carattere, indice) in caratteriCodiceFiscale"
        :key="indice"
        class="result-display__lettera"
        :style="{ animationDelay: `${indice * 60}ms` }"
      >{{ carattere }}</span>
      <span v-if="!codiceFiscale" class="result-display__segnaposto">{{ SEGNAPOSTO_RISULTATO }}</span>
    </p>
    <div v-if="copiaDisponibile" class="result-display__actions">
      <button type="button" class="result-display__copy">Copia</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { RisultatoCodiceFiscale } from '../features/fiscalCode.types';

const props = withDefaults(defineProps<RisultatoCodiceFiscale>(), {
  codiceFiscale: null,
  copiaDisponibile: false,
});

const SEGNAPOSTO_RISULTATO = '\u2014 \u2014 \u2014';

const caratteriCodiceFiscale = computed<string[]>(() =>
  props.codiceFiscale ? [...props.codiceFiscale] : [],
);

const isRisultatoAttivo = computed<boolean>(() => props.codiceFiscale !== null);
</script>

<style scoped>
.result-display {
  padding: 28px 20px 22px;
  margin-bottom: 28px;
  border-radius: 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  transition: box-shadow 0.4s ease;
}

.result-display--attivo {
  animation: glowPulse 2s ease-in-out infinite;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1px;
}

.result-display__lettera {
  display: inline-block;
  opacity: 0;
  animation: letterReveal 0.35s forwards;
}

.result-display__segnaposto {
  color: #94a3b8;
  font-size: 1rem;
  letter-spacing: 0.04em;
  font-family: inherit;
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

@keyframes letterReveal {
  0% {
    opacity: 0;
    transform: translateY(-12px) scale(0.7);
  }
  60% {
    opacity: 1;
    transform: translateY(2px) scale(1.08);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes glowPulse {
  0%,
  100% {
    box-shadow: 0 0 18px 2px rgba(124, 58, 237, 0.5);
  }
  50% {
    box-shadow: 0 0 36px 8px rgba(6, 182, 212, 0.6);
  }
}
</style>
