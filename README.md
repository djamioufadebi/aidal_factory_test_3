# Exercice 3 — Extraction de données (services non contrôlés depuis > N mois)

## Lancer l'exemple du sujet
```bash
npm run exo3:example
```
Résultat attendu (ordre non important) :
```
["marketing","communication","design","technique","robotique","mécanique","automatisme","etiquetage","nettoyage"]
```

## Usage générique
```bash
# N mois (par défaut 3) et date de référence "now" (optionnelle, ISO)
npm run exo3 -- [N] [YYYY-MM-DD]
# ex: npm run exo3 -- 6 2022-01-15
```
