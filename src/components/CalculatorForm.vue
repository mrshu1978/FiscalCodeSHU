<template>
  <form class="calculator-form" data-axiom-section="calculator" @submit.prevent="emettiCalcolo">
    <div class="calculator-form__row">
      <div class="calculator-form__field">
        <label class="calculator-form__label" for="cognome">Cognome</label>
        <input id="cognome" v-model="form.cognome" class="calculator-form__input" type="text" placeholder="es. Rossi" />
      </div>
      <div class="calculator-form__field">
        <label class="calculator-form__label" for="nome">Nome</label>
        <input id="nome" v-model="form.nome" class="calculator-form__input" type="text" placeholder="es. Marco" />
      </div>
    </div>

    <div class="calculator-form__row">
      <div class="calculator-form__field">
        <label class="calculator-form__label" for="data-nascita">Data di nascita</label>
        <input id="data-nascita" v-model="form.dataNascita" class="calculator-form__input" type="date" />
      </div>
      <div class="calculator-form__field calculator-form__field--sesso">
        <label class="calculator-form__label" for="sesso">Sesso</label>
        <select id="sesso" v-model="form.sesso" class="calculator-form__input">
          <option value="">—</option>
          <option value="M">M</option>
          <option value="F">F</option>
        </select>
      </div>
    </div>

    <div class="calculator-form__field">
      <label class="calculator-form__label" for="comune-nascita">Comune di nascita</label>
      <select id="comune-nascita" v-model="form.comuneNascita" class="calculator-form__input">
        <option value="">Seleziona comune…</option>
        <option v-for="comune in comuniDisponibili" :key="comune.sigla" :value="comune.nome">
          {{ comune.nome }} ({{ comune.sigla }})
        </option>
      </select>
    </div>

    <button type="submit" class="calculator-form__submit">Calcola Codice Fiscale</button>
  </form>
</template>

<script setup lang="ts">
import { COMUNI_DISPONIBILI, type FormDatiAnagrafici } from '../features/fiscalCode.types';

const form = defineModel<FormDatiAnagrafici>('form', { required: true });

const emit = defineEmits<{ calcola: [] }>();
const comuniDisponibili = COMUNI_DISPONIBILI;

function emettiCalcolo(): void {
  emit('calcola');
}
</script>

<style scoped>
.calculator-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 28px 24px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
}

.calculator-form__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.calculator-form__field {
  flex: 1 1 140px;
}

.calculator-form__field--sesso {
  flex: 0 0 80px;
}

.calculator-form__label {
  display: block;
  margin-bottom: 7px;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #94a3b8;
}

.calculator-form__input {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.07);
  color: #f0f0ff;
  font-family: inherit;
  font-size: 0.95rem;
}

.calculator-form__submit {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
}
</style>
