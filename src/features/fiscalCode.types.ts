/**
 * Contratti tipizzati del calcolatore codice fiscale (client-only).
 * Punto di integrazione per dati del form e risultato: nessuna chiamata di rete.
 */

export type Sesso = 'M' | 'F';

export interface ComuneNascita {
  readonly nome: string;
  readonly sigla: string;
}

export interface FormDatiAnagrafici {
  cognome: string;
  nome: string;
  dataNascita: string;
  sesso: Sesso | '';
  comuneNascita: string;
}

export interface RisultatoCodiceFiscale {
  codiceFiscale: string | null;
  copiaDisponibile: boolean;
}

export const COMUNI_DISPONIBILI: readonly ComuneNascita[] = [
  { nome: 'Venezia', sigla: 'VE' },
  { nome: 'Padova', sigla: 'PD' },
];

export const DATI_FORM_VUOTI: FormDatiAnagrafici = {
  cognome: '',
  nome: '',
  dataNascita: '',
  sesso: '',
  comuneNascita: '',
};
