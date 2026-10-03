# tests

Area test separata dal codice applicativo, da consegnare a QA, per test di comportamento e regressione sulle operazioni del contratto.

Placement rules:
- Test deterministici e indipendenti, con setup/teardown del proprio stato.
- Nessuna duplicazione della logica applicativa; i test esercitano comportamenti osservabili.
- Regressione coperta per le quattro operazioni di CONTRACT-001.
