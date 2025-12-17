# FootExplorer API

**Cours 420-514-MV - Projet Final de Session**

FootExplorer est un service de collecte et d'analyse de données de football. L'API permet d'explorer les statistiques des joueurs, équipes et ligues des 5 grands championnats européens.

---

## Table des matières

1. [Architecture et Conception](#1-architecture-et-conception)
2. [Détails des Données](#2-détails-des-données)
3. [Guide d'Installation](#3-guide-dinstallation)
4. [Utilisation de l'API](#4-utilisation-de-lapi)
5. [Tests](#5-tests)

---

## 1. Architecture et Conception

### Stack Technique

| Technologie | Rôle |
|-------------|------|
| **Node.js** | Runtime JavaScript côté serveur |
| **Express** | Framework web pour les routes et middlewares |
| **MongoDB** | Base de données NoSQL pour stocker les données |
| **Mongoose** | ODM pour modéliser les données MongoDB |
| **TypeScript** | Typage statique pour plus de robustesse |
| **Python** | Scripts de collecte de données depuis l'API externe |

### Structure du Projet

```
FootExplorerBackend/
├── src/
│   ├── controllers/    # Logique de contrôle des requêtes
│   ├── services/       # Logique métier
│   ├── models/         # Schémas Mongoose
│   ├── routes/         # Définition des endpoints
│   ├── middlewares/    # Auth, logging, validation
│   ├── tests/          # Tests unitaires et d'intégration
│   ├── app.ts          # Configuration Express
│   └── server.ts       # Point d'entrée
├── collectePython/     # Scripts de collecte de données
├── config/             # Configuration (ports, DB, JWT)
└── postman-collection.json
```

### Design Patterns Utilisés

#### 1. MVC (Model-View-Controller)
Le projet sépare clairement les responsabilités :
- **Models** (`src/models/`) : Définissent la structure des données (User, Team, Player, League)
- **Controllers** (`src/controllers/`) : Gèrent les requêtes HTTP et les réponses
- **Services** (`src/services/`) : Contiennent la logique métier

#### 2. Middleware Pattern
Express utilise une chaîne de middlewares pour traiter les requêtes :
- `requireAuth` : Vérifie le token JWT
- `logRequest` : Log les requêtes entrantes
- `rateLimit` : Limite le nombre de requêtes par IP

#### 3. Repository Pattern
Les services agissent comme une couche d'abstraction entre les controllers et la base de données. Par exemple, `users.service.ts` gère toutes les opérations liées aux utilisateurs sans que le controller ait à connaître les détails de MongoDB.

#### 4. Singleton Pattern
La connexion MongoDB est initialisée une seule fois au démarrage du serveur et partagée dans toute l'application via Mongoose.

---

## 2. Détails des Données

### Source des Données

Les données proviennent de **API-Football** (https://www.api-football.com/), une API REST qui fournit des statistiques de football en temps réel.

### Ligues Couvertes

| ID | Ligue | Pays |
|----|-------|------|
| 39 | Premier League | Angleterre |
| 61 | Ligue 1 | France |
| 78 | Bundesliga | Allemagne |
| 135 | Serie A | Italie |
| 140 | La Liga | Espagne |

### Structure des Données

Le projet utilise 7 collections MongoDB :

| Collection | Description | Champs principaux |
|------------|-------------|-------------------|
| `users` | Utilisateurs de l'API | email, username, password, favoris |
| `players` | Informations des joueurs | apiId, name, age, nationality, photo |
| `playerstats` | Stats des joueurs par saison | goals, assists, rating, minutes |
| `teams` | Informations des équipes | apiId, name, country, logo |
| `teamstats` | Stats des équipes par saison | wins, goalsFor, formation |
| `leagues` | Informations des ligues | apiId, name, country, season |
| `classements` | Classements des ligues | rank, points, wins, draws, losses |

### Mode de Collecte

La collecte se fait via des scripts Python dans le dossier `collectePython/`. Ce n'est **pas du temps réel** : les données sont collectées périodiquement et stockées en base. La saison actuelle est 2025.

Pour lancer la collecte :
```bash
cd collectePython
python main.py
```

---

## 3. Guide d'Installation

### Prérequis

- Node.js v18+
- MongoDB (local ou Atlas)
- Python 3.x (pour la collecte)

### Étape 1 : Cloner le projet

```bash
git clone https://github.com/yassineeljal/FootExplorerBackend.git
cd FootExplorerBackend
```

### Étape 2 : Installer les dépendances

```bash
npm install
```

### Étape 3 : Configurer l'environnement

Le fichier de configuration se trouve dans `config/default.json`. Modifiez-le selon vos besoins :

```json
{
  "db": { 
    "uri": "mongodb://localhost:27017/football_db" 
  },
  "security": {
    "jwt": { 
      "secret": "votre_secret_jwt", 
      "expiresIn": "1d" 
    }
  }
}
```

Pour la collecte Python, modifiez `collectePython/config.py` :
```python
API_KEY = "votre_cle_api_football"
MONGO_URI = "mongodb://localhost:27017/"
```

### Étape 4 : Lancer le serveur

**Mode développement :**
```bash
npm run dev
```

**Mode production :**
```bash
npm run build
npm start
```

Le serveur sera accessible sur `http://localhost:3000`.

### Étape 5 : Documentation Swagger

Une fois le serveur lancé, accédez à la documentation interactive :

```
http://localhost:3000/api-docs
```

---

## 4. Utilisation de l'API

### Base URL

```
http://localhost:3000/api/v1
```

### Authentification

La plupart des routes nécessitent un token JWT. Incluez-le dans le header :

```
Authorization: Bearer <votre_token>
```

### Exemples de Requêtes

#### Créer un compte

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "monuser",
  "password": "motdepasse123",
  "name": "Mon Nom"
}
```

**Réponse :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "email": "user@example.com",
    "username": "monuser"
  }
}
```

#### Se connecter

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

#### Récupérer les top joueurs d'une ligue

```bash
GET /api/v1/players/top?leagueId=61&season=2025
Authorization: Bearer <token>
```

#### Rechercher un joueur

```bash
GET /api/v1/players/search?q=mbappe
Authorization: Bearer <token>
```

#### Récupérer le classement d'une ligue

```bash
GET /api/v1/leagues/61/standings?season=2025
```

#### Ajouter une équipe en favori

```bash
POST /api/v1/users/favorites
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "team",
  "apiId": 85,
  "action": "add"
}
```

### Collection Postman

Une collection Postman est disponible à la racine du projet : `postman-collection.json`

Pour l'utiliser :
1. Ouvrez Postman
2. Cliquez sur Import
3. Sélectionnez le fichier
4. Toutes les routes sont prêtes à tester

---

## 5. Tests

### Suite de Tests

Le projet inclut 56 tests automatisés :

| Type | Nombre | Description |
|------|--------|-------------|
| Tests unitaires | 39 | Testent les services individuellement |
| Tests d'intégration | 17 | Testent les routes de bout en bout |

### Lancer les tests

```bash
npm test
```

### Lancer les tests avec couverture

```bash
npm test -- --coverage
```

La couverture actuelle est de **99%** sur les services.

### Tests de charge

Pour vérifier la stabilité sous charge :

```bash
npm run test:load
```

Ce test simule plusieurs utilisateurs simultanés et vérifie que l'API répond correctement.

### Structure des tests

```
src/tests/
├── setup.ts                    # Configuration MongoDB en mémoire
├── auth.service.test.ts        # Tests du service auth
├── users.service.test.ts       # Tests du service users
├── teams.service.test.ts       # Tests du service teams
├── players.service.test.ts     # Tests du service players
├── leagues.service.test.ts     # Tests du service leagues
└── integration/
    ├── auth.integration.test.ts    # Tests routes auth
    └── users.integration.test.ts   # Tests routes users
```

---

## Auteurs

- Hamza Meroui
- Arda Ozan Yildiz
- Yassine El Jal
- Takfarinas Djerroud

Projet réalisé dans le cadre du cours 420-514-MV.
