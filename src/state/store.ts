/**
 * Stato condiviso del risultato del calcolo codice fiscale (client-only).
 * Seam tipizzato tra l'adapter di calcolo e i componenti di visualizzazione.
 * Modella l'esito contrattuale di ResetRisultatoSuModificaCampo (CONTRACT-001).
 */

import { ref, type Ref } from 'vue';

import type { RisultatoCodiceFiscale } from '../features/fiscalCode.types';

export type StatoForm = 'in_attesa_di_calcolo' | 'calcolo_eseguito';

export type CodiceErroreInvalidazione = 'NESSUN_RISULTATO_DA_INVALIDARE';

export interface EsitoInvalidazione {
  risultatoInvalidato: boolean;
  copiaDisponibile: boolean;
  statoForm: StatoForm;
  codiceErrore?: CodiceErroreInvalidazione;
}

export interface StatoRisultatoCodiceFiscale {
  risultato: Ref<RisultatoCodiceFiscale>;
  statoForm: Ref<StatoForm>;
  impostaSuccesso: (codiceFiscale: string) => void;
  registraEsitoNegativo: () => void;
  invalidaRisultato: () => EsitoInvalidazione;
}

export function creaStatoRisultatoCodiceFiscale(): StatoRisultatoCodiceFiscale {
  const risultato = ref<RisultatoCodiceFiscale>({
    codiceFiscale: null,
    copiaDisponibile: false,
  });
  const statoForm = ref<StatoForm>('in_attesa_di_calcolo');
  const esitoPrecedentePresente = ref(false);

  function registraEsito(stato: StatoForm): void {
    statoForm.value = stato;
    esitoPrecedentePresente.value = true;
  }

  function impostaSuccesso(codiceFiscale: string): void {
    risultato.value = { codiceFiscale, copiaDisponibile: true };
    registraEsito('calcolo_eseguito');
  }

  function registraEsitoNegativo(): void {
    risultato.value = { codiceFiscale: null, copiaDisponibile: false };
    registraEsito('calcolo_eseguito');
  }

  function invalidaRisultato(): EsitoInvalidazione {
    if (!esitoPrecedentePresente.value) {
      return {
        risultatoInvalidato: false,
        copiaDisponibile: false,
        statoForm: statoForm.value,
        codiceErrore: 'NESSUN_RISULTATO_DA_INVALIDARE',
      };
    }

    risultato.value = { codiceFiscale: null, copiaDisponibile: false };
    statoForm.value = 'in_attesa_di_calcolo';
    esitoPrecedentePresente.value = false;
    return {
      risultatoInvalidato: true,
      copiaDisponibile: false,
      statoForm: 'in_attesa_di_calcolo',
    };
  }

  return { risultato, statoForm, impostaSuccesso, registraEsitoNegativo, invalidaRisultato };
}
