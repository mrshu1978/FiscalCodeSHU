/**
 * Adapter client-only per il calcolo del codice fiscale (TDP-002: third-party-cf-library).
 * Incapsula la libreria npm `codice-fiscale-js` e normalizza il comune della form
 * verso i codici catastali supportati. Nessuna chiamata di rete, nessuna persistenza.
 */

import CodiceFiscaleDaNpm, { type Gender, type ICodiceFiscaleObject } from 'codice-fiscale-js';

import type { FormDatiAnagrafici } from '../features/fiscalCode.types';

const CODICI_CATASTALI_COMUNI: Readonly<Record<string, string>> = {
  Venezia: 'L736',
  Padova: 'G224',
};

const LUNGHEZZA_CODICE_FISCALE = 16;

type CostruttoreCodiceFiscale = typeof CodiceFiscaleDaNpm;
type ModuloCodiceFiscale = { CodiceFiscale?: CostruttoreCodiceFiscale };

/** La build CommonJS espone il costruttore come export nominato; i tipi npm come default. */
const CostruttoreCodiceFiscale: CostruttoreCodiceFiscale =
  (CodiceFiscaleDaNpm as unknown as ModuloCodiceFiscale).CodiceFiscale ?? CodiceFiscaleDaNpm;

export type EsitoCalcoloCodiceFiscale =
  | { esito: 'successo'; codiceFiscale: string }
  | { esito: 'comune-non-riconosciuto'; codiceErrore: 'COMUNE_NON_RICONOSCIUTO' }
  | { esito: 'errore-calcolo'; messaggio: string };

export function risolviCodiceCatastale(comuneNascita: string): string | null {
  const codice = CODICI_CATASTALI_COMUNI[comuneNascita.trim()];
  return codice ?? null;
}

function isDataValida(data: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(data);
}

function dividiData(data: string): { year: number; month: number; day: number } {
  const [anno, mese, giorno] = data.split('-');
  return { year: Number(anno), month: Number(mese), day: Number(giorno) };
}

export function calcolaCodiceFiscale(dati: FormDatiAnagrafici): EsitoCalcoloCodiceFiscale {
  const codiceCatastale = risolviCodiceCatastale(dati.comuneNascita);
  if (!codiceCatastale) {
    return { esito: 'comune-non-riconosciuto', codiceErrore: 'COMUNE_NON_RICONOSCIUTO' };
  }

  const sesso: string = dati.sesso;
  if ((sesso !== 'M' && sesso !== 'F') || !isDataValida(dati.dataNascita)) {
    return { esito: 'errore-calcolo', messaggio: 'Dati anagrafici non validi per il calcolo.' };
  }

  const { year, month, day } = dividiData(dati.dataNascita);
  const richiesta: ICodiceFiscaleObject = {
    name: dati.nome.trim(),
    surname: dati.cognome.trim(),
    gender: sesso as Gender,
    day,
    month,
    year,
    birthplace: codiceCatastale,
    birthplaceProvincia: '',
  };

  try {
    const codiceFiscale = new CostruttoreCodiceFiscale(richiesta).toString().toUpperCase();
    if (codiceFiscale.length !== LUNGHEZZA_CODICE_FISCALE) {
      return { esito: 'errore-calcolo', messaggio: 'Il calcolo non ha prodotto un codice fiscale valido.' };
    }
    return { esito: 'successo', codiceFiscale };
  } catch (causa) {
    const messaggio = causa instanceof Error ? causa.message : 'Errore durante il calcolo del codice fiscale.';
    return { esito: 'errore-calcolo', messaggio };
  }
}
