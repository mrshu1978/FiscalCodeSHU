import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';

import ResultDisplay from '../src/components/ResultDisplay.vue';

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SEGNAPOSTO_RISULTATO = '\u2014 \u2014 \u2014';

function readSource(relativePath: string): string {
  return readFileSync(resolve(ROOT_DIR, relativePath), 'utf8');
}

interface ResultDisplayProps {
  codiceFiscale?: string | null;
  copiaDisponibile?: boolean;
  statoCopia?: 'inattivo' | 'copiato' | 'errore';
  messaggioCopia?: string | null;
  messaggioErrore?: string | null;
}

function renderResultDisplay(props: ResultDisplayProps): Promise<string> {
  return renderToString(
    createSSRApp({
      render: () =>
        h(ResultDisplay, {
          codiceFiscale: null,
          copiaDisponibile: false,
          statoCopia: 'inattivo',
          messaggioCopia: null,
          messaggioErrore: null,
          ...props,
        }),
    }),
  );
}

describe('TASK-006 - layout responsive e stati visivi', () => {
  it('dispone il layout su una singola colonna centrata e senza overflow orizzontale', () => {
    const appStyle = readSource('src/App.vue');
    const formStyle = readSource('src/components/calculator-form.css');

    expect(appStyle).toContain('max-width: 560px');
    expect(appStyle).toContain('margin: 0 auto');
    expect(appStyle).toContain('box-sizing: border-box');
    expect(formStyle).toContain('flex-wrap: wrap');
    expect(formStyle).toContain('box-sizing: border-box');
  });

  it('adatta il box risultato su viewport da 320px senza scroll orizzontale', () => {
    const resultStyle = readSource('src/components/result-display.css');

    expect(resultStyle).toContain('clamp(');
    expect(resultStyle).toMatch(/\.result-display__value[\s\S]*?flex-wrap: wrap/);
  });

  it('garantisce touch target adeguati ai controlli', () => {
    const formStyle = readSource('src/components/calculator-form.css');
    const resultStyle = readSource('src/components/result-display.css');

    expect(formStyle).toMatch(/min-height:\s*44px/);
    expect(resultStyle).toMatch(/min-height:\s*44px/);
  });

  it('mostra lo stato iniziale con segnaposto, Calcola abilitato e Copia nascosto', async () => {
    const html = await renderResultDisplay({});

    expect(html).toContain(SEGNAPOSTO_RISULTATO);
    expect(html).not.toContain('Copia');
    const formSource = readSource('src/components/CalculatorForm.vue');
    expect(formSource).toContain('Calcola Codice Fiscale');
    expect(formSource).not.toMatch(/<button[^>]*disabled/);
  });

  it('mostra il pulsante Copia e Copiato! negli stati previsti', async () => {
    const conRisultato = await renderResultDisplay({
      codiceFiscale: 'RSSMRC85D15L736V',
      copiaDisponibile: true,
    });
    const copiato = await renderResultDisplay({
      codiceFiscale: 'RSSMRC85D15L736V',
      copiaDisponibile: true,
      statoCopia: 'copiato',
    });

    expect(conRisultato).toContain('Copia');
    expect(copiato).toContain('Copiato!');
  });

  it('mostra l esito negativo esplicito senza codice fiscale parziale', async () => {
    const html = await renderResultDisplay({
      messaggioErrore: 'Comune di nascita non riconosciuto.',
    });

    expect(html).toContain('Comune di nascita non riconosciuto.');
    expect(html).toContain(SEGNAPOSTO_RISULTATO);
    const app = readSource('src/App.vue');
    expect(app).toContain(':messaggio-errore="erroreCalcolo"');
  });

  it('mantiene animazione lettera per lettera e glow sul successo', () => {
    const resultSource = readSource('src/components/ResultDisplay.vue');
    const resultStyle = readSource('src/components/result-display.css');

    expect(resultStyle).toContain('@keyframes letterReveal');
    expect(resultStyle).toContain('@keyframes glowPulse');
    expect(resultSource).toContain('result-display--attivo');
  });

  it('evidenzia in rosso il pulsante Calcola quando la validazione fallisce', () => {
    const formStyle = readSource('src/components/calculator-form.css');

    expect(formStyle).toContain('calculator-form__submit--errore');
    expect(formStyle).toContain('#ef4444');
  });
});
