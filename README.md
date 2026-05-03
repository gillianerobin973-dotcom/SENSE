# NovaCaisse — ERP/POS Shop In Café

## Lancer en local (3 commandes)

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer le serveur de développement
npm run dev

# 3. Ouvrir dans le navigateur
# → http://localhost:5173
```

## Prérequis
- Node.js 18+ installé sur votre machine
- Télécharger Node.js : https://nodejs.org

## Stack technique
- React 18
- Vite 5
- CSS-in-JS (styles intégrés dans App.jsx)

## Structure
```
novacaisse-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx    ← point d'entrée
    └── App.jsx     ← toute l'application
```

## Modules disponibles
- **Dashboard** — KPIs, jauge de profitabilité
- **Caisse** — POS tactile, 10 modes de paiement
- **Stocks** — Réapprovisionnement avec pavé numérique
- **Mes Données** — Produits, Rubriques, Modes, TVA
- **Finances** — Historique des ventes
