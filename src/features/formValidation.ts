/**
 * Validazione formale dei campi del calcolatore codice fiscale (client-only).
 * Operazione ValidaCampiForm del contratto CONTRACT-001: nessuna chiamata di rete.
 */

import type { FormDatiAnagrafici } from './fiscalCode.types';

export type CampoForm = 'cognome' | 'nome' | 'dataNascita' | 'sesso' | 'comuneNascita';

export type CodiceErroreValidazione =
  | 'CAMPO_OBBLIGATORIO_MANCANTE'
  | 'DATA_NASCITA_NON_VALIDA'
  | 'SESSO_NON_VALIDO';

export interface ErroreValidazione {
  campo: CampoForm;
  codiceErrore: CodiceErroreValidazione;
  messaggio: string;
}

export interface EsitoValidazione {
  valido: boolean;
  errori: ErroreValidazione[];
}

export const CAMPI_FORM: readonly CampoForm[] = [
  'cognome',
  'nome',
  'dataNascita',
  'sesso',
  'comuneNascita',
];

const ETICHETTE_CAMPO: Record<CampoForm, string> = {
  cognome: 'Cognome',
  nome: 'Nome',
  dataNascita: 'Data di nascita',
  sesso: 'Sesso',
  comuneNascita: 'Comune di nascita',
};

function errore(
  campo: CampoForm,
  codiceErrore: CodiceErroreValidazione,
  messaggio: string,
): ErroreValidazione {
  return { campo, codiceErrore, messaggio };
}

function isCampoTestualeObbligatorioValorizzato(valore: string): boolean {
  return valore.trim().length > 0;
}

function isDataReale(data: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data);
  if (!match) {
    return false;
  }
  const anno = Number(match[1]);
  const mese = Number(match[2]);
  const giorno = Number(match[3]);
  const dataVerificata = new Date(Date.UTC(anno, mese - 1, giorno));
  return (
    dataVerificata.getUTCFullYear() === anno &&
    dataVerificata.getUTCMonth() === mese - 1 &&
    dataVerificata.getUTCDate() === giorno
  );
}

export function validaCampo(
  campo: CampoForm,
  form: FormDatiAnagrafici,
): ErroreValidazione | null {
  switch (campo) {
    case 'cognome':
    case 'nome': {
      if (!isCampoTestualeObbligatorioValorizzato(form[campo])) {
        return errore(
          campo,
          'CAMPO_OBBLIGATORIO_MANCANTE',
          `Il campo ${ETICHETTE_CAMPO[campo]} è obbligatorio.`,
        );
      }
      return null;
    }
    case 'dataNascita': {
      if (!form.dataNascita) {
        return errore(
          'dataNascita',
          'CAMPO_OBBLIGATORIO_MANCANTE',
          `Il campo ${ETICHETTE_CAMPO.dataNascita} è obbligatorio.`,
        );
      }
      if (!isDataReale(form.dataNascita)) {
        return errore(
          'dataNascita',
          'DATA_NASCITA_NON_VALIDA',
          'La data di nascita non è una data reale.',
        );
      }
      return null;
    }
    case 'sesso': {
      const sesso: string = form.sesso;
      if (!sesso) {
        return errore(
          'sesso',
          'CAMPO_OBBLIGATORIO_MANCANTE',
          `Il campo ${ETICHETTE_CAMPO.sesso} è obbligatorio.`,
        );
      }
      if (sesso !== 'M' && sesso !== 'F') {
        return errore('sesso', 'SESSO_NON_VALIDO', 'Il sesso deve essere M oppure F.');
      }
      return null;
    }
    case 'comuneNascita': {
      if (!form.comuneNascita) {
        return errore(
          'comuneNascita',
          'CAMPO_OBBLIGATORIO_MANCANTE',
          'Seleziona il comune di nascita.',
        );
      }
      return null;
    }
  }
}

export function validaCampi(form: FormDatiAnagrafici): EsitoValidazione {
  const errori = CAMPI_FORM.map((campo) => validaCampo(campo, form)).filter(
    (esito): esito is ErroreValidazione => esito !== null,
  );
  return { valido: errori.length === 0, errori };
}
