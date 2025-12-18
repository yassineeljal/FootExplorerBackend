# FootExplorer API

**Cours 420-514-MV - Projet Final de Session**

FootExplorer, c'est notre projet de collecte et d'analyse de données de football. En gros, on récupère les stats des joueurs, équipes et ligues des 5 grands championnats européens, et on les expose via une API REST.

---

## Table des matières

1. [Architecture et Conception](#1-architecture-et-conception)
2. [Nos Données](#2-nos-données)
3. [Guide d'Installation](#3-guide-dinstallation)
4. [Utilisation de l'API](#4-utilisation-de-lapi)
5. [Tests](#5-tests)

---

## 1. Architecture et Conception

### Pourquoi ces technos ?

On a choisi **Node.js avec Express** parce que c'est ce qu'on connaissait le mieux et ça nous permettait d'aller vite. Pour la base de données, on est partis sur **MongoDB** pour sa flexibilité avec les données JSON.

On a utilisé **TypeScript** plutôt que JavaScript pour avoir un typage strict et éviter les erreurs.

Pour la collecte des données depuis l'API externe, on a utilisé **Python**. C'était plus simple pour faire des scripts de collecte qu'on lance manuellement, sans avoir à les intégrer dans le serveur principal.

### Comment on a organisé le code

On a suivi le pattern **MVC** (Model-View-Controller), mais adapté pour une API :

- Les **Models** (dans `src/models/`) définissent la structure de nos données : User, Team, Player, League, etc.
- Les **Controllers** (dans `src/controllers/`) reçoivent les requêtes HTTP et renvoient les réponses.
- Les **Services** (dans `src/services/`) contiennent la vraie logique. Si le controller c'est le serveur au restaurant, le service c'est le cuisinier.

Cette séparation nous a aidés quand on travaillait à plusieurs : un pouvait modifier un service pendant qu'un autre travaillait sur le controller, sans se marcher dessus.

On a aussi utilisé des **middlewares** pour gérer les trucs communs à plusieurs routes :
- `requireAuth` vérifie que l'utilisateur a un token JWT valide
- `rateLimit` bloque les gens qui font trop de requêtes (protection contre les abus)
- `logRequest` garde une trace de toutes les requêtes dans un fichier log

### Structure du projet

```
FootExplorerBackend/
├── src/
│   ├── controllers/    # Gère les requêtes
│   ├── services/       # Logique métier
│   ├── models/         # Schémas MongoDB
│   ├── routes/         # Définition des endpoints
│   ├── middlewares/    # Auth, logging, etc.
│   ├── tests/          # Tests unitaires et d'intégration
│   ├── app.ts          # Config Express
│   └── server.ts       # Point d'entrée
├── collectePython/     # Scripts de collecte
├── config/             # Configuration
└── postman-collection.json
```

---

## 2. Nos Données

### D'où ça vient ?

On utilise **API-Football** (https://www.api-football.com/) comme source. C'est une API payante qu'on a dû acheter pour avoir accès aux données complètes des 5 grands championnats.

La collecte de données se fait **séparément** avec des scripts Python. On lance les scripts manuellement pour mettre à jour notre base de données.

### Les ligues qu'on couvre

On s'est concentrés sur les 5 grands championnats européens :
- Premier League (Angleterre)
- Ligue 1 (France)
- Bundesliga (Allemagne)
- Serie A (Italie)
- La Liga (Espagne)

### Ce qu'on stocke

Notre base MongoDB contient plusieurs collections :

**Users** : Les utilisateurs de notre API, avec leur email, mot de passe hashé, et leurs favoris (équipes, joueurs, ligues qu'ils suivent).

**Players et PlayerStats** : Les infos des joueurs (nom, âge, nationalité, photo) et leurs stats par saison (buts, passes, note moyenne).

**Teams et TeamStats** : Les infos des équipes et leurs stats par saison.

**Leagues et Classements** : Les ligues et leurs classements actuels.

### La collecte Python

Pour lancer la collecte des données :

```bash
cd collectePython
python main.py
```

Ce script va chercher les données sur API-Football et les insère dans MongoDB. On le fait tourner de temps en temps pour garder nos données à jour (saison 2025).

---

## 3. Guide d'Installation

### Ce qu'il vous faut

- Node.js v18 ou plus
- MongoDB (en local ou sur Atlas)
- Python 3.x (si vous voulez lancer la collecte)

### Étape 1 : Cloner le projet

```bash
git clone https://github.com/yassineeljal/FootExplorerBackend.git
cd FootExplorerBackend
```

### Étape 2 : Installer les dépendances

```bash
npm install
```

### Étape 3 : Configurer

Le fichier de config est dans `config/default.json`. Les trucs importants à vérifier :

```json
{
  "db": { 
    "uri": "mongodb://localhost:27017/football_db" 
  },
  "security": {
    "jwt": { 
      "secret": "changez_ce_secret_en_production", 
      "expiresIn": "1d" 
    }
  }
}
```

Si vous voulez faire de la collecte, allez aussi modifier `collectePython/config.py` avec votre clé API.

### Étape 4 : Lancer le serveur

**En développement :**
```bash
npm run dev
```

**En production :**
```bash
npm run build
npm start
```

Le serveur tourne sur `http://localhost:3000`.

### Étape 5 : Voir la doc Swagger

Une fois le serveur lancé, vous pouvez voir et tester toutes les routes sur :

```
http://localhost:3000/api-docs
```

---

## 4. Utilisation de l'API

### URL de base

```
http://localhost:3000/api/v1
```

### Authentification

La plupart des routes demandent un token JWT. Après vous être connecté, ajoutez-le dans vos requêtes :

```
Authorization: Bearer votre_token_ici
```

### Exemples de requêtes

**Créer un compte :**

```bash
POST /api/v1/auth/register

{
  "email": "user@example.com",
  "username": "monuser",
  "password": "motdepasse123",
  "name": "Mon Nom"
}
```

Réponse : vous recevez un token JWT à utiliser pour les autres requêtes.

**Se connecter :**

```bash
POST /api/v1/auth/login

{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

**Voir les meilleurs buteurs d'une ligue :**

```bash
GET /api/v1/players/top?leagueId=61&season=2025
Authorization: Bearer <token>
```

**Chercher un joueur par nom :**

```bash
GET /api/v1/players/search?q=mbappe
Authorization: Bearer <token>
```

**Voir le classement d'une ligue :**

```bash
GET /api/v1/leagues/61/standings?season=2025
```

**Ajouter une équipe en favori :**

```bash
POST /api/v1/users/favorites
Authorization: Bearer <token>

{
  "type": "team",
  "apiId": 85,
  "action": "add"
}
```

### Collection Postman

On a préparé une collection Postman avec toutes les routes déjà configurées. Le fichier `postman-collection.json` est à la racine du projet.

Pour l'utiliser :
1. Ouvrez Postman
2. Import → sélectionnez le fichier
3. C'est prêt, toutes les routes sont là

---

## 5. Tests

### Ce qu'on a testé

On a écrit 56 tests au total :
- **39 tests unitaires** qui testent chaque service individuellement (auth, users, teams, players, leagues)
- **17 tests d'intégration** qui testent les routes de bout en bout (on simule de vraies requêtes HTTP)

### Lancer les tests

```bash
npm test
```

### Voir la couverture

```bash
npm test -- --coverage
```

On a atteint **100% de couverture** sur tous nos fichiers de services. C'était important pour nous de tester les cas d'erreur aussi (genre quand un utilisateur essaie de se connecter avec un mauvais mot de passe).

### Tests de charge

On a aussi fait des tests de charge pour vérifier que notre API tient la route quand il y a plusieurs requêtes en même temps :

```bash
npm run test:load
```

Ça simule une montée en charge progressive (5, puis 10, puis 20 requêtes par seconde) et vérifie que le serveur répond correctement.

### Organisation des tests

```
src/tests/
├── setup.ts                    # Configure une DB en mémoire pour les tests
├── auth.service.test.ts
├── users.service.test.ts
├── teams.service.test.ts
├── players.service.test.ts
├── leagues.service.test.ts
└── integration/
    ├── auth.integration.test.ts
    └── users.integration.test.ts
```

---

## Auteurs

- Hamza Meroui
- Arda Ozan Yildiz
- Yassine El Jal
- Takfarinas Djerroud

Projet réalisé dans le cadre du cours 420-514-MV.
