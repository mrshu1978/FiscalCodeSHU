# environments

Area di configurazione ambientale separata dal codice applicativo, da consegnare a Env, con soli placeholder per i segreti.

Placement rules:
- Configurazioni per ambiente documentate.
- Nessun segreto in chiaro: usare solo placeholder come ${VAR}.
- Nessun valore reale di segreto hardcoded.
