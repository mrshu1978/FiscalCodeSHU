# Coding Agent Build Instructions

This repository was scaffolded by Axiom Dev Repo.
Every coding provider must read this file before changing the repository.
It is the operational source of truth for the accepted project rules.
Accepted Architecture, Code Discipline and Quality Budgets are versioned under docs/architecture.

# Axiom Repo Contract

Read this before changing the repository.

- Follow docs/architecture/decisions.md.
- Follow docs/architecture/code-rules.md.
- Respect docs/architecture/repo-structure.md for file placement.
- Respect docs/architecture/quality-budgets.md for validation and review.

# Quick Start

Commands derived from the accepted stacks. Run them from the repository root unless noted otherwise.

Frontend (vue-vite-ts, builder: node):
- `cd frontend && npm install`
- `cd frontend && npm run dev`
- `cd frontend && npm run build`
- Mark-approved build command: `npm run build`

# Execution Rules

1. Read docs/architecture/decisions.md, code-rules.md, repo-structure.md and quality-budgets.md before touching code.
2. Respect placement rules. Never create a second parallel structure such as shadow `src/`, `apps/` or `packages/` unless it already exists.
3. Placement rules WIN over task mapping. If a task reference conflicts with the file's technical domain, follow the placement rule and the technical domain.
4. Update tests and documentation in the same change set as the code they cover. Quality budgets in quality-budgets.md are enforced.
5. If runtime services, env vars or external systems are ambiguous, stop and ask before inventing files such as `.env` or `docker-compose.yml`.

# Runtime Services

Runtime dependencies are not auto-provisioned by this scaffold.
If tasks require databases, identity providers, message brokers or external APIs, check docs/architecture/decisions.md and existing config files first.
Do not create new env files or compose definitions unless a task explicitly asks for them.

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



