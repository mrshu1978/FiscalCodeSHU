import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';

import { creaStatoRisultatoCodiceFiscale } from '../src/state/store';

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CODICE_VALIDO = 'RSSMRC85D15L736V';

function readSource(relativePath: string): string {
  return readFileSync(resolve(ROOT_DIR, relativePath), 'utf8');
}

describe('TASK-005 - copia del codice fiscale negli appunti', () => {
  it('copia un codice valido e imposta lo stato Copiato', async () => {
    const store = creaStatoRisultatoCodiceFiscale();
    store.impostaSuccesso(CODICE_VALIDO);
    const scriviAppunti = vi.fn().mockResolvedValue(undefined);

    const esito = await store.copiaNegliAppunti(scriviAppunti);

    expect(scriviAppunti).toHaveBeenCalledWith(CODICE_VALIDO);
    expect(esito).toEqual({ esito: 'successo', codiceFiscaleCopiato: CODICE_VALIDO });
    expect(store.statoCopia.value).toBe('copiato');
  });

  it('segnala PERMESSO_CLIPBOARD_NEGATO senza alterare il codice mostrato', async () => {
    const store = creaStatoRisultatoCodiceFiscale();
    store.impostaSuccesso(CODICE_VALIDO);
    const scriviAppunti = vi.fn().mockRejectedValue(new Error('denied'));

    const esito = await store.copiaNegliAppunti(scriviAppunti);

    expect(esito).toEqual({ esito: 'fallimento', motivo: 'PERMESSO_CLIPBOARD_NEGATO' });
    expect(store.statoCopia.value).toBe('errore');
    expect(store.messaggioCopia.value).toBeTruthy();
    expect(store.risultato.value.codiceFiscale).toBe(CODICE_VALIDO);
  });

  it('non invoca la Clipboard API senza un risultato valido corrente', async () => {
    const store = creaStatoRisultatoCodiceFiscale();
    const scriviAppunti = vi.fn().mockResolvedValue(undefined);

    const esito = await store.copiaNegliAppunti(scriviAppunti);

    expect(scriviAppunti).not.toHaveBeenCalled();
    expect(esito).toEqual({ esito: 'fallimento', motivo: 'RISULTATO_NON_DISPONIBILE' });
  });

  it('applica la guardia di formato ^[A-Z0-9]{16}$ prima di copiare', async () => {
    const store = creaStatoRisultatoCodiceFiscale();
    store.impostaSuccesso('ABC');
    const scriviAppunti = vi.fn().mockResolvedValue(undefined);

    const esito = await store.copiaNegliAppunti(scriviAppunti);

    expect(scriviAppunti).not.toHaveBeenCalled();
    expect(esito).toEqual({ esito: 'fallimento', motivo: 'RISULTATO_NON_DISPONIBILE' });
    expect(store.risultato.value.codiceFiscale).toBe('ABC');
  });

  it('espone nel componente Copia e lo collega al wiring della pagina', () => {
    const resultDisplay = readSource('src/components/ResultDisplay.vue');
    const app = readSource('src/App.vue');

    expect(resultDisplay).toContain("Copiato!");
    expect(resultDisplay).toContain("@click=\"$emit('copia')\"");
    expect(app).toContain('@copia="onCopia"');
    expect(app).toContain('copiaNegliAppunti');
  });
});
