# Quality Budgets

## max_file_lines

Threshold: 150 lines
Enforcement: advisory

Id: core:quality:max-file-lines
Scope: always
Severity: should
Source: playbook
Rationale: Soglia baseline Axiom: file sopra 150 righe vanno splittati per SRP.

## no_eval

Threshold: 0 occurrences
Enforcement: advisory

Id: core:quality:no-eval
Scope: always
Severity: must
Source: playbook
Rationale: Security baseline: niente eval() o equivalenti in nessun layer.

