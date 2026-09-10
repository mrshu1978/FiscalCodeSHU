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

