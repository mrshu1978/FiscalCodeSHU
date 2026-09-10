import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';

import App from '../src/App.vue';
import { COMUNI_DISPONIBILI } from '../src/features/fiscalCode.types';

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SEGNAPOSTO_RISULTATO = '\u2014 \u2014 \u2014';

function readProjectFile(relativePath: string): string {
  return readFileSync(resolve(ROOT_DIR, relativePath), 'utf8');
}

function renderApp(): Promise<string> {
  return renderToString(createSSRApp(App));
}

describe('TASK-001 - scaffold Vue + TypeScript', () => {
  it('dipende da Vue, Vite e TypeScript senza dipendenze React', () => {
    const manifest = JSON.parse(readProjectFile('package.json')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const allDependencies = {
      ...manifest.dependencies,
      ...manifest.devDependencies,
    };

    expect(manifest.dependencies?.vue).toBeTruthy();
    expect(manifest.devDependencies?.vite).toBeTruthy();
    expect(manifest.devDependencies?.typescript).toBeTruthy();
    expect(Object.keys(allDependencies).some((name) => /^react/i.test(name))).toBe(false);
  });

  it('renderizza i campi anagrafici e il pulsante Calcola Codice Fiscale', async () => {
    const html = await renderApp();

    expect(html).toContain('Cognome');
    expect(html).toContain('Nome');
    expect(html).toContain('Data di nascita');
    expect(html).toContain('Sesso');
    expect(html).toContain('Comune di nascita');
    expect(html).toContain('Calcola Codice Fiscale');
  });

  it('mostra il segnaposto del risultato e nessun pulsante Copia nello stato iniziale', async () => {
    const html = await renderApp();

    expect(html).toContain(SEGNAPOSTO_RISULTATO);
    expect(html).not.toContain('Copia');
  });

  it('espone nel dropdown solo i comuni Venezia (VE) e Padova (PD)', async () => {
    const html = await renderApp();

    expect(COMUNI_DISPONIBILI).toHaveLength(2);
    expect(COMUNI_DISPONIBILI.map((comune) => `${comune.nome} (${comune.sigla})`)).toEqual([
      'Venezia (VE)',
      'Padova (PD)',
    ]);
    expect(html).toContain('Venezia (VE)');
    expect(html).toContain('Padova (PD)');
  });

  it('predispone un modulo tipizzato per dati del form e risultato senza chiamate di rete', () => {
    const source = readProjectFile('src/features/fiscalCode.types.ts');

    expect(source).toContain('export interface FormDatiAnagrafici');
    expect(source).toContain('export interface RisultatoCodiceFiscale');
    expect(source).not.toMatch(/\bfetch\s*\(|axios|XMLHttpRequest|https?:\/\//);
  });
});
