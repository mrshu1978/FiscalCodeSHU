import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';

import ResultDisplay from '../src/components/ResultDisplay.vue';
import { creaStatoRisultatoCodiceFiscale } from '../src/state/store';

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SEGNAPOSTO_RISULTATO = '\u2014 \u2014 \u2014';

function readSource(relativePath: string): string {
  return readFileSync(resolve(ROOT_DIR, relativePath), 'utf8');
}

describe('TASK-004 - invalidazione del risultato su modifica campo', () => {
  it('invalida un risultato presente aggiornando l esito contrattuale', () => {
    const store = creaStatoRisultatoCodiceFiscale();
    store.impostaSuccesso('RSSMRC85D15L736V');

    const esito = store.invalidaRisultato();

    expect(esito).toEqual({
      risultatoInvalidato: true,
      copiaDisponibile: false,
      statoForm: 'in_attesa_di_calcolo',
    });
    expect(store.risultato.value).toEqual({ codiceFiscale: null, copiaDisponibile: false });
  });

  it('tratta come no-op la modifica senza risultato precedente', () => {
    const store = creaStatoRisultatoCodiceFiscale();
    const prima = { ...store.risultato.value };

    const esito = store.invalidaRisultato();

    expect(esito.codiceErrore).toBe('NESSUN_RISULTATO_DA_INVALIDARE');
    expect(esito.risultatoInvalidato).toBe(false);
    expect(store.risultato.value).toEqual(prima);
  });

  it('rimuove l esito negativo precedente alla modifica di un campo', () => {
    const store = creaStatoRisultatoCodiceFiscale();
    store.registraEsitoNegativo();

    const esito = store.invalidaRisultato();

    expect(esito.risultatoInvalidato).toBe(true);
    expect(store.risultato.value).toEqual({ codiceFiscale: null, copiaDisponibile: false });
  });

  it('mostra il segnaposto e nasconde Copia dopo l invalidazione', async () => {
    const store = creaStatoRisultatoCodiceFiscale();
    store.impostaSuccesso('RSSMRC85D15L736V');
    store.invalidaRisultato();

    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(ResultDisplay, {
            codiceFiscale: store.risultato.value.codiceFiscale,
            copiaDisponibile: store.risultato.value.copiaDisponibile,
          }),
      }),
    );

    expect(html).toContain(SEGNAPOSTO_RISULTATO);
    expect(html).not.toContain('Copia');
  });

  it('collega la modifica di un campo all invalidazione del risultato', () => {
    const app = readSource('src/App.vue');

    expect(app).toContain('@campo-modificato="onCampoModificato"');
    expect(app).toContain('invalidaRisultato');
  });
});
