<template>
  <form class="calculator-form" data-axiom-section="calculator" novalidate @submit.prevent="inviaCalcolo">
    <div class="calculator-form__row">
      <FormField label="Cognome" input-id="cognome" :errore="erroriPerCampo.cognome">
        <input id="cognome" v-model="form.cognome" class="calculator-form__input" type="text" placeholder="es. Rossi" @input="onFieldChange('cognome')" />
      </FormField>
      <FormField label="Nome" input-id="nome" :errore="erroriPerCampo.nome">
        <input id="nome" v-model="form.nome" class="calculator-form__input" type="text" placeholder="es. Marco" @input="onFieldChange('nome')" />
      </FormField>
    </div>

    <div class="calculator-form__row">
      <FormField label="Data di nascita" input-id="data-nascita" :errore="erroriPerCampo.dataNascita">
        <input id="data-nascita" v-model="form.dataNascita" class="calculator-form__input" type="date" @change="onFieldChange('dataNascita')" />
      </FormField>
      <FormField
        class="calculator-form__field--sesso"
        label="Sesso"
        input-id="sesso"
        :errore="erroriPerCampo.sesso"
      >
        <select id="sesso" v-model="form.sesso" class="calculator-form__input" @change="onFieldChange('sesso')">
          <option value="">—</option>
          <option value="M">M</option>
          <option value="F">F</option>
        </select>
      </FormField>
    </div>

    <FormField label="Comune di nascita" input-id="comune-nascita" :errore="erroriPerCampo.comuneNascita">
      <select id="comune-nascita" v-model="form.comuneNascita" class="calculator-form__input" @change="onFieldChange('comuneNascita')">
        <option value="">Seleziona comune…</option>
        <option v-for="comune in comuniDisponibili" :key="comune.sigla" :value="comune.nome">
          {{ comune.nome }} ({{ comune.sigla }})
        </option>
      </select>
    </FormField>

    <button
      type="submit"
      class="calculator-form__submit"
      :class="{ 'calculator-form__submit--errore': evidenziaErrore }"
    >
      Calcola Codice Fiscale
    </button>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { COMUNI_DISPONIBILI, type FormDatiAnagrafici } from '../features/fiscalCode.types';
import {
  validaCampo,
  validaCampi,
  type CampoForm,
  type ErroreValidazione,
  type EsitoValidazione,
} from '../features/formValidation';
import FormField from './FormField.vue';

const DURATA_EVIDENZA_ERRORE_MS = 1000;

const form = defineModel<FormDatiAnagrafici>('form', { required: true });

const emit = defineEmits<{
  calcola: [];
  'campo-modificato': [campo: CampoForm];
}>();

const comuniDisponibili = COMUNI_DISPONIBILI;
const errori = ref<ErroreValidazione[]>([]);
const evidenziaErrore = ref(false);

const erroriPerCampo = computed<Partial<Record<CampoForm, string>>>(() => {
  const mappa: Partial<Record<CampoForm, string>> = {};
  for (const errore of errori.value) {
    mappa[errore.campo] = errore.messaggio;
  }
  return mappa;
});

function onFieldChange(campo: CampoForm): void {
  const errore = validaCampo(campo, form.value);
  const altriErrori = errori.value.filter((item) => item.campo !== campo);
  errori.value = errore ? [...altriErrori, errore] : altriErrori;
  emit('campo-modificato', campo);
}

function inviaCalcolo(): void {
  const esito: EsitoValidazione = validaCampi(form.value);
  errori.value = esito.errori;
  if (!esito.valido) {
    segnalaErroreSubmit();
    return;
  }
  emit('calcola');
}

function segnalaErroreSubmit(): void {
  evidenziaErrore.value = false;
  window.requestAnimationFrame(() => {
    evidenziaErrore.value = true;
  });
  window.setTimeout(() => {
    evidenziaErrore.value = false;
  }, DURATA_EVIDENZA_ERRORE_MS);
}

defineExpose({ onFieldChange, inviaCalcolo });
</script>

<style scoped src="./calculator-form.css"></style>
