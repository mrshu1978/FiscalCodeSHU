/**
 * Stato condiviso del risultato del calcolo codice fiscale (client-only).
 * Seam tipizzato tra l'adapter di calcolo e i componenti di visualizzazione.
 */

import { ref, type Ref } from 'vue';

import type { RisultatoCodiceFiscale } from '../features/fiscalCode.types';

export interface StatoRisultatoCodiceFiscale {
  risultato: Ref<RisultatoCodiceFiscale>;
  impostaCodiceFiscale: (codiceFiscale: string) => void;
  azzeraRisultato: () => void;
}

export function creaStatoRisultatoCodiceFiscale(): StatoRisultatoCodiceFiscale {
  const risultato = ref<RisultatoCodiceFiscale>({
    codiceFiscale: null,
    copiaDisponibile: false,
  });

  function impostaCodiceFiscale(codiceFiscale: string): void {
    risultato.value = { codiceFiscale, copiaDisponibile: true };
  }

  function azzeraRisultato(): void {
    risultato.value = { codiceFiscale: null, copiaDisponibile: false };
  }

  return { risultato, impostaCodiceFiscale, azzeraRisultato };
}
