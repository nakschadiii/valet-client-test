# valet. : Projet Node.js - API de Gestion de Parking et Réservations

Ce projet implémente une API en Node.js pour gérer les réservations de parking, les places de parking disponibles, et les voitures enregistrées. L'API est construite avec Express et inclut des tests unitaires utilisant Jest et Supertest.

## Fonctionnalités

- Inscription et connexion d'utilisateur
- Gestion des réservations de parking
- Gestion des places de parking (obtenir des places libres, par type, etc.)
- Enregistrement et gestion des voitures

## Environnement de Développement

- Node.js
- Express.js
- Supabase (pour la gestion de la base de données)
- Jest (pour les tests unitaires)
- Supertest (pour tester les requêtes HTTP)

## Installation

### 1. Clonez ce dépôt

```bash
git clone https://votre-repository.git
cd votre-dossier
```

### 2. Installez les dépendances

```bash
npm install
```

### 3. Configuration des variables d'environnement

Créez un fichier .env à la racine du projet avec les variables suivantes :

```env
PORT=3000
SUPABASE_URL=<votre-url-supabase>
SUPABASE_KEY=<votre-clé-supabase>
```

### 4. Démarrer le serveur

```bash
npm start
```

Le serveur sera accessible à l'adresse : http://localhost:3000

### 5. Exécuter les tests

Pour exécuter les tests unitaires, vous pouvez utiliser Jest avec la commande suivante :

```bash
npm test
```