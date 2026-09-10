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
    <p v-if="!codiceFiscale && messaggioErrore" class="result-display__errore" role="alert">
      {{ messaggioErrore }}
    </p>
    <div v-if="copiaDisponibile" class="result-display__actions">
      <button type="button" class="result-display__copy" @click="$emit('copia')">
        {{ statoCopia === 'copiato' ? 'Copiato!' : 'Copia' }}
      </button>
      <p v-if="messaggioCopia" class="result-display__errore" role="alert">{{ messaggioCopia }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { RisultatoCodiceFiscale } from '../features/fiscalCode.types';
import type { StatoCopia } from '../state/store';

interface ResultDisplayProps extends RisultatoCodiceFiscale {
  statoCopia?: StatoCopia;
  messaggioCopia?: string | null;
  messaggioErrore?: string | null;
}

const props = withDefaults(defineProps<ResultDisplayProps>(), {
  codiceFiscale: null,
  copiaDisponibile: false,
  statoCopia: 'inattivo',
  messaggioCopia: null,
  messaggioErrore: null,
});

defineEmits<{ copia: [] }>();

const SEGNAPOSTO_RISULTATO = '\u2014 \u2014 \u2014';

const caratteriCodiceFiscale = computed<string[]>(() =>
  props.codiceFiscale ? [...props.codiceFiscale] : [],
);

const isRisultatoAttivo = computed<boolean>(() => props.codiceFiscale !== null);
</script>

<style scoped src="./result-display.css"></style>
