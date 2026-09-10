import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { validaCampi } from '../src/features/formValidation';
import type { FormDatiAnagrafici } from '../src/features/fiscalCode.types';

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const FORM_VALIDO: FormDatiAnagrafici = {
  cognome: 'Rossi',
  nome: 'Marco',
  dataNascita: '1985-04-15',
  sesso: 'M',
  comuneNascita: 'Venezia',
};

function formConOverride(override: Partial<FormDatiAnagrafici>): FormDatiAnagrafici {
  return { ...FORM_VALIDO, ...override };
}

describe('TASK-002 - validazione dei campi del form', () => {
  it('segnala CAMPO_OBBLIGATORIO_MANCANTE per Cognome e Nome composti da soli spazi', () => {
    const esito = validaCampi(formConOverride({ cognome: '   ', nome: '  ' }));

    expect(esito.valido).toBe(false);
    const erroriCognome = esito.errori.filter(
      (errore) => errore.campo === 'cognome' && errore.codiceErrore === 'CAMPO_OBBLIGATORIO_MANCANTE',
    );
    const erroriNome = esito.errori.filter(
      (errore) => errore.campo === 'nome' && errore.codiceErrore === 'CAMPO_OBBLIGATORIO_MANCANTE',
    );
    expect(erroriCognome).toHaveLength(1);
    expect(erroriNome).toHaveLength(1);
    expect(erroriCognome[0].messaggio.length).toBeGreaterThan(0);
    expect(erroriNome[0].messaggio.length).toBeGreaterThan(0);
  });

  it('segnala DATA_NASCITA_NON_VALIDA per una data non reale', () => {
    const esito = validaCampi(formConOverride({ dataNascita: '2023-02-31' }));

    expect(esito.valido).toBe(false);
    expect(esito.errori).toContainEqual(
      expect.objectContaining({ campo: 'dataNascita', codiceErrore: 'DATA_NASCITA_NON_VALIDA' }),
    );
  });

  it('segnala SESSO_NON_VALIDO per un sesso diverso da M o F', () => {
    const esito = validaCampi(formConOverride({ sesso: 'X' as FormDatiAnagrafici['sesso'] }));

    expect(esito.valido).toBe(false);
    expect(esito.errori).toContainEqual(
      expect.objectContaining({ campo: 'sesso', codiceErrore: 'SESSO_NON_VALIDO' }),
    );
  });

  it('segnala CAMPO_OBBLIGATORIO_MANCANTE quando il comune non è selezionato', () => {
    const esito = validaCampi(formConOverride({ comuneNascita: '' }));

    expect(esito.valido).toBe(false);
    expect(esito.errori).toContainEqual(
      expect.objectContaining({
        campo: 'comuneNascita',
        codiceErrore: 'CAMPO_OBBLIGATORIO_MANCANTE',
      }),
    );
  });

  it('restituisce valido=true e nessun errore con tutti i campi formalmente corretti', () => {
    const esito = validaCampi(FORM_VALIDO);

    expect(esito.valido).toBe(true);
    expect(esito.errori).toEqual([]);
  });

  it('espone nel componente un gestore di change riusabile per la validazione in tempo reale', () => {
    const source = readFileSync(resolve(ROOT_DIR, 'src/components/CalculatorForm.vue'), 'utf8');

    expect(source).toContain('onFieldChange');
    expect(source).toContain('defineExpose');
    expect(source).toContain("'campo-modificato'");
    expect(source).toMatch(/@input="onFieldChange/);
    expect(source).toMatch(/@change="onFieldChange/);
  });
});
