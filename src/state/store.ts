/**
 * Stato condiviso del risultato del calcolo codice fiscale (client-only).
 * Seam tipizzato tra l'adapter di calcolo e i componenti di visualizzazione.
 * Modella gli esiti contrattuali di ResetRisultatoSuModificaCampo e CopiaNegliAppunti (CONTRACT-001).
 */

import { ref, type Ref } from 'vue';

import type { RisultatoCodiceFiscale } from '../features/fiscalCode.types';

export type StatoForm = 'in_attesa_di_calcolo' | 'calcolo_eseguito';

export type StatoCopia = 'inattivo' | 'copiato' | 'errore';

export type CodiceErroreInvalidazione = 'NESSUN_RISULTATO_DA_INVALIDARE';

export type MotivoErroreCopia = 'RISULTATO_NON_DISPONIBILE' | 'PERMESSO_CLIPBOARD_NEGATO';

export type ScriviAppunti = (testo: string) => Promise<void>;

export interface EsitoInvalidazione {
  risultatoInvalidato: boolean;
  copiaDisponibile: boolean;
  statoForm: StatoForm;
  codiceErrore?: CodiceErroreInvalidazione;
}

export type EsitoCopia =
  | { esito: 'successo'; codiceFiscaleCopiato: string }
  | { esito: 'fallimento'; motivo: MotivoErroreCopia };

export interface StatoRisultatoCodiceFiscale {
  risultato: Ref<RisultatoCodiceFiscale>;
  statoForm: Ref<StatoForm>;
  statoCopia: Ref<StatoCopia>;
  messaggioCopia: Ref<string | null>;
  impostaSuccesso: (codiceFiscale: string) => void;
  registraEsitoNegativo: () => void;
  invalidaRisultato: () => EsitoInvalidazione;
  copiaNegliAppunti: (scriviAppunti?: ScriviAppunti) => Promise<EsitoCopia>;
}

const FORMATO_CODICE_FISCALE = /^[A-Z0-9]{16}$/;
const DURATA_FEEDBACK_COPIATO_MS = 1800;

const scriviAppuntiPredefinito: ScriviAppunti = (testo) => navigator.clipboard.writeText(testo);

export function creaStatoRisultatoCodiceFiscale(): StatoRisultatoCodiceFiscale {
  const risultato = ref<RisultatoCodiceFiscale>({
    codiceFiscale: null,
    copiaDisponibile: false,
  });
  const statoForm = ref<StatoForm>('in_attesa_di_calcolo');
  const statoCopia = ref<StatoCopia>('inattivo');
  const messaggioCopia = ref<string | null>(null);
  const esitoPrecedentePresente = ref(false);

  function registraEsito(stato: StatoForm): void {
    statoForm.value = stato;
    esitoPrecedentePresente.value = true;
  }

  function azzeraFeedbackCopia(): void {
    statoCopia.value = 'inattivo';
    messaggioCopia.value = null;
  }

  function impostaSuccesso(codiceFiscale: string): void {
    risultato.value = { codiceFiscale, copiaDisponibile: true };
    registraEsito('calcolo_eseguito');
    azzeraFeedbackCopia();
  }

  function registraEsitoNegativo(): void {
    risultato.value = { codiceFiscale: null, copiaDisponibile: false };
    registraEsito('calcolo_eseguito');
    azzeraFeedbackCopia();
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
    azzeraFeedbackCopia();
    return {
      risultatoInvalidato: true,
      copiaDisponibile: false,
      statoForm: 'in_attesa_di_calcolo',
    };
  }

  async function copiaNegliAppunti(
    scriviAppunti: ScriviAppunti = scriviAppuntiPredefinito,
  ): Promise<EsitoCopia> {
    const codiceFiscale = risultato.value.codiceFiscale;
    if (codiceFiscale === null || !FORMATO_CODICE_FISCALE.test(codiceFiscale)) {
      return { esito: 'fallimento', motivo: 'RISULTATO_NON_DISPONIBILE' };
    }

    try {
      await scriviAppunti(codiceFiscale);
      statoCopia.value = 'copiato';
      messaggioCopia.value = null;
      globalThis.setTimeout(azzeraFeedbackCopia, DURATA_FEEDBACK_COPIATO_MS);
      return { esito: 'successo', codiceFiscaleCopiato: codiceFiscale };
    } catch {
      statoCopia.value = 'errore';
      messaggioCopia.value = 'Copia non riuscita: accesso agli appunti negato dal browser.';
      return { esito: 'fallimento', motivo: 'PERMESSO_CLIPBOARD_NEGATO' };
    }
  }

  return {
    risultato,
    statoForm,
    statoCopia,
    messaggioCopia,
    impostaSuccesso,
    registraEsitoNegativo,
    invalidaRisultato,
    copiaNegliAppunti,
  };
}
