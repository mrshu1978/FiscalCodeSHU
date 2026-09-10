import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { calcolaCodiceFiscale, risolviCodiceCatastale } from '../src/state/codiceFiscale';
import { validaCampi } from '../src/features/formValidation';
import type { FormDatiAnagrafici } from '../src/features/fiscalCode.types';

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const DATI_MASCHIO_VENEZIA: FormDatiAnagrafici = {
  cognome: 'Rossi',
  nome: 'Marco',
  dataNascita: '1985-04-15',
  sesso: 'M',
  comuneNascita: 'Venezia',
};

function readSource(relativePath: string): string {
  return readFileSync(resolve(ROOT_DIR, relativePath), 'utf8');
}

describe('TASK-003 - calcolo del codice fiscale', () => {
  it('calcola il codice fiscale atteso per un maschio nato a Venezia', () => {
    const esito = calcolaCodiceFiscale(DATI_MASCHIO_VENEZIA);

    expect(esito).toEqual({ esito: 'successo', codiceFiscale: 'RSSMRC85D15L736V' });
  });

  it('calcola il codice fiscale atteso per una femmina nata a Padova con giorno +40', () => {
    const esito = calcolaCodiceFiscale({
      ...DATI_MASCHIO_VENEZIA,
      nome: 'Maria',
      sesso: 'F',
      comuneNascita: 'Padova',
    });

    expect(esito).toEqual({ esito: 'successo', codiceFiscale: 'RSSMRA85D55G224Z' });
    if (esito.esito === 'successo') {
      expect(esito.codiceFiscale.slice(9, 11)).toBe('55');
    }
  });

  it('non invoca il calcolo quando la validazione fallisce e ne preserva l esito', () => {
    const datiInvalidi: FormDatiAnagrafici = {
      ...DATI_MASCHIO_VENEZIA,
      cognome: '   ',
      comuneNascita: '',
    };
    const validazione = validaCampi(datiInvalidi);
    const sorgenteForm = readSource('src/components/CalculatorForm.vue');

    expect(validazione.valido).toBe(false);
    expect(sorgenteForm).toMatch(/if \(!esito\.valido\)[\s\S]*?return;[\s\S]*?emit\('calcola'\)/);
  });

  it('restituisce COMUNE_NON_RICONOSCIUTO senza produrre un codice parziale', () => {
    const esito = calcolaCodiceFiscale({ ...DATI_MASCHIO_VENEZIA, comuneNascita: 'Milano' });

    expect(esito.esito).toBe('comune-non-riconosciuto');
    expect(esito).not.toHaveProperty('codiceFiscale');
    if (esito.esito === 'comune-non-riconosciuto') {
      expect(esito.codiceErrore).toBe('COMUNE_NON_RICONOSCIUTO');
    }
  });

  it('qualifica la mappatura catastale Venezia e Padova accettata dalla libreria', () => {
    expect(risolviCodiceCatastale('Venezia')).toBe('L736');
    expect(risolviCodiceCatastale('Padova')).toBe('G224');
    expect(risolviCodiceCatastale('Milano')).toBeNull();

    const venezia = calcolaCodiceFiscale(DATI_MASCHIO_VENEZIA);
    const padova = calcolaCodiceFiscale({ ...DATI_MASCHIO_VENEZIA, comuneNascita: 'Padova' });
    expect(venezia.esito).toBe('successo');
    expect(padova.esito).toBe('successo');
    if (venezia.esito === 'successo') {
      expect(venezia.codiceFiscale.endsWith('L736V')).toBe(true);
    }
    if (padova.esito === 'successo') {
      expect(padova.codiceFiscale.endsWith('G224X')).toBe(true);
    }
  });

  it('produce comunque 16 caratteri con cognome e nome molto corti', () => {
    const esito = calcolaCodiceFiscale({
      ...DATI_MASCHIO_VENEZIA,
      cognome: 'R',
      nome: 'A',
      dataNascita: '2000-01-01',
    });

    expect(esito.esito).toBe('successo');
    if (esito.esito === 'successo') {
      expect(esito.codiceFiscale).toHaveLength(16);
      expect(esito.codiceFiscale).toMatch(/^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/);
    }
  });
});
