# Repository Structure

Topology: flat
Tech Stack:
- frontend: vue-vite-ts (builder: node, build: npm run build)

## src/features

feature slices and pages

Placement rules:
- Use cases, commands, queries, validators and task orchestration.
- Keep transport, persistence and visual rendering outside this folder.

Mapped task references:
- TASK-001: Predisporre la base applicativa Vue/TypeScript
- TASK-002: Implementare la validazione dei campi del form
- TASK-003: Implementare il calcolo del codice fiscale
- TASK-004: Gestire l'invalidazione del risultato su modifica campo
- TASK-005: Implementare la copia del codice fiscale negli appunti
- TASK-006: Completare layout responsive e stati visivi della pagina

## tests

Area test separata dal codice applicativo, da consegnare a QA, per test di comportamento e regressione sulle operazioni del contratto.

Placement rules:
- Test deterministici e indipendenti, con setup/teardown del proprio stato.
- Nessuna duplicazione della logica applicativa; i test esercitano comportamenti osservabili.
- Regressione coperta per le quattro operazioni di CONTRACT-001.

## environments

Area di configurazione ambientale separata dal codice applicativo, da consegnare a Env, con soli placeholder per i segreti.

Placement rules:
- Configurazioni per ambiente documentate.
- Nessun segreto in chiaro: usare solo placeholder come ${VAR}.
- Nessun valore reale di segreto hardcoded.

