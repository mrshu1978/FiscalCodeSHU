# Architecture Decisions

## TDP frontend.stack

Decisione Mark: vue-typescript.

Id: tdp:tdp-001
Scope: frontend
Severity: should
Source: system
Rationale: Decisione risolta da Mark per lo scope frontend e importata in Dev Repo senza reinterpretare testo libero.

## TDP frontend.calcolo_cf.strategia

Decisione Mark: third-party-cf-library.

Id: tdp:tdp-002
Scope: frontend
Severity: should
Source: system
Rationale: Decisione risolta da Mark per lo scope frontend e importata in Dev Repo senza reinterpretare testo libero.

## TDP frontend.animazione.strategia

Decisione Mark: vue-transition-css.

Id: tdp:tdp-003
Scope: frontend
Severity: should
Source: system
Rationale: Decisione risolta da Mark per lo scope frontend e importata in Dev Repo senza reinterpretare testo libero.

## TDP frontend.clipboard.strategia

Decisione Mark: clipboard-api-navigator.

Id: tdp:tdp-004
Scope: frontend
Severity: should
Source: system
Rationale: Decisione risolta da Mark per lo scope frontend e importata in Dev Repo senza reinterpretare testo libero.

## Confine esplicito per calcolo/validazione testabile

Isolare la logica di calcolo del codice fiscale e la validazione dei campi in moduli puri (es. src/state) senza dipendenze da DOM, navigator.clipboard o componenti Vue. La libreria di terze parti di Mark resta dietro un confine esplicito (adapter/wrapper) che espone firme stabili. Le quattro operazioni di CONTRACT-001 mantengono le firme invariate: i componenti delegano calcolo e validazione ai moduli puri, e le operazioni di copia/reset restano nell'interazione che possiede il DOM.

Id: user:architecture:confine-esplicito-per-calcolo-validazione-testabile
Scope: frontend
Target: node=frontend-app; type=app
Severity: must
Source: alex
Rationale: Approvazione esplicita di Marco: logica testabile e firme di Mark invariate.

