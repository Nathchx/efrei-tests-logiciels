# Projet Officine

Implémentation d'une classe `Officine` pour gérer les ingrédients et la préparation de potions.

## Installation

```bash
npm install
```

## Exécution des tests

```bash
# Lancer tous les tests
npm test

# Lancer les tests avec couverture de code
npm run test:coverage
```

## Fonctionnalités

La classe `Officine` propose trois méthodes principales :

- `rentrer(quantité_ingrédient)` : Ajoute des ingrédients au stock
- `quantite(nom_ingrédient)` : Retourne la quantité en stock
- `preparer(quantité_potion)` : Prépare des potions selon les recettes
