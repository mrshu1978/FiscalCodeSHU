<template>
  <div class="app">
    <header class="app__header">
      <h1 class="app__title">Calcolatore Codice Fiscale</h1>
      <p class="app__subtitle">Inserisci i dati anagrafici</p>
    </header>

    <main class="app__main">
      <ResultDisplay
        :codice-fiscale="risultato.codiceFiscale"
        :copia-disponibile="risultato.copiaDisponibile"
        :stato-copia="statoCopia"
        :messaggio-copia="messaggioCopia"
        :messaggio-errore="erroreCalcolo"
        @copia="onCopia"
      />
      <CalculatorForm
        v-model:form="formDati"
        @calcola="onCalcola"
        @campo-modificato="onCampoModificato"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CalculatorForm from './components/CalculatorForm.vue';
import ResultDisplay from './components/ResultDisplay.vue';
import { DATI_FORM_VUOTI, type FormDatiAnagrafici } from './features/fiscalCode.types';
import { calcolaCodiceFiscale } from './state/codiceFiscale';
import { creaStatoRisultatoCodiceFiscale } from './state/store';

const formDati = ref<FormDatiAnagrafici>({ ...DATI_FORM_VUOTI });
const erroreCalcolo = ref<string | null>(null);
const {
  risultato,
  statoCopia,
  messaggioCopia,
  impostaSuccesso,
  registraEsitoNegativo,
  invalidaRisultato,
  copiaNegliAppunti,
} = creaStatoRisultatoCodiceFiscale();

function onCalcola(): void {
  const esito = calcolaCodiceFiscale(formDati.value);
  if (esito.esito === 'successo') {
    erroreCalcolo.value = null;
    impostaSuccesso(esito.codiceFiscale);
    return;
  }
  erroreCalcolo.value =
    esito.esito === 'comune-non-riconosciuto'
      ? 'Comune di nascita non riconosciuto: seleziona Venezia o Padova.'
      : esito.messaggio;
  registraEsitoNegativo();
}

function onCampoModificato(): void {
  erroreCalcolo.value = null;
  invalidaRisultato();
}

function onCopia(): void {
  void copiaNegliAppunti();
}
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

:root {
  color-scheme: dark;
}

html,
body {
  max-width: 100%;
  overflow-x: hidden;
}

body {
  margin: 0;
  background: #0d0d24;
  color: #f0f0ff;
}

.app {
  max-width: 560px;
  margin: 0 auto;
  padding: 24px 16px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.app__header {
  margin-bottom: 24px;
}

.app__title {
  margin: 0;
  font-size: 1.15rem;
}

.app__subtitle {
  margin: 4px 0 0;
  font-size: 0.78rem;
  color: #94a3b8;
}

.app__main {
  min-width: 0;
}

@media (max-width: 360px) {
  .app {
    padding: 16px 12px;
  }

  .app__header {
    margin-bottom: 16px;
  }
}
</style>
