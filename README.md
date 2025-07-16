# SAFOTIME - Système de Gestion des Produits Alimentaires

## Description
SAFOTIME est une application web complète pour gérer les produits d'un magasin d'alimentation générale. Elle permet de :
- Lister tous les produits avec leurs prix et photos
- Ajouter de nouveaux produits
- Modifier les informations des produits existants
- Supprimer des produits
- Filtrer et rechercher des produits
- Gérer les catégories (légumes, fruits, épices, autres)

## Technologies Utilisées
- **Backend** : Node.js, Express.js, MongoDB, Mongoose
- **Frontend** : Vue.js 3, Bootstrap 5, Axios
- **Upload d'images** : Multer
- **Base de données** : MongoDB

## Structure du Projet
```
SAFOTIME/
├── backend/
│   ├── models/          # Modèles MongoDB
│   ├── routes/          # Routes API
│   ├── uploads/         # Dossier des images uploadées
│   ├── server.js        # Serveur principal
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── views/       # Pages Vue.js
│   │   ├── services/    # Services API
│   │   ├── router/      # Configuration des routes
│   │   └── App.vue
│   └── package.json
└── README.md
```

## Installation et Configuration

### Prérequis
- Node.js (v14 ou supérieur)
- MongoDB (local ou Atlas)
- npm ou yarn

### 1. Installation des dépendances

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 2. Configuration de la base de données

#### Option A : MongoDB Atlas (Recommandé)
1. Créez un compte sur [MongoDB Atlas](https://cloud.mongodb.com/)
2. Créez un cluster gratuit
3. Créez un utilisateur de base de données
4. Ajoutez votre adresse IP aux accès réseau (ou 0.0.0.0/0 pour tous)
5. Obtenez votre chaîne de connexion :
   - Cliquez sur "Connect" dans votre cluster
   - Choisissez "Connect your application"
   - Sélectionnez "Node.js"
   - Copiez la chaîne de connexion

#### Configuration rapide avec Atlas :
```bash
# Exécutez le script de configuration
configure-atlas.bat
```

#### Configuration manuelle :
Modifiez le fichier `backend/.env` :
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster-url/safotime?retryWrites=true&w=majority
JWT_SECRET=votre_secret_jwt_key_ici
NODE_ENV=development
```

#### Option B : MongoDB Local
Si vous préférez utiliser MongoDB en local :
```
MONGODB_URI=mongodb://localhost:27017/safotime
```

### 3. Démarrage de l'application

#### Démarrer le backend (Port 5000)
```bash
cd backend
npm run dev
```

#### Démarrer le frontend (Port 3000)
```bash
cd frontend
npm run serve
```

### 4. Accès à l'application
- Frontend : http://localhost:3000
- API Backend : http://localhost:5000/api
- Test API : http://localhost:5000/api/test

## Fonctionnalités

### Page d'Accueil
- Statistiques générales
- Produits récents
- Navigation rapide

### Gestion des Produits
- **Liste des produits** : Vue grille et liste
- **Filtres** : Par catégorie et recherche par nom
- **Ajout** : Formulaire complet avec upload d'image
- **Modification** : Édition de tous les champs
- **Suppression** : Avec confirmation

### API Endpoints
- `GET /api/products` - Récupérer tous les produits
- `GET /api/products/:id` - Récupérer un produit par ID
- `POST /api/products` - Créer un nouveau produit
- `PUT /api/products/:id` - Mettre à jour un produit
- `DELETE /api/products/:id` - Supprimer un produit

## Scripts Utiles

### Backend
- `npm start` - Démarrer en production
- `npm run dev` - Démarrer en développement avec nodemon

### Frontend
- `npm run serve` - Démarrer le serveur de développement
- `npm run build` - Build pour la production
- `npm run lint` - Linter le code

## Utilisation

1. **Ajouter un produit** :
   - Cliquez sur "Ajouter un produit"
   - Remplissez le formulaire
   - Ajoutez une image (optionnel)
   - Enregistrez

2. **Modifier un produit** :
   - Dans la liste des produits, cliquez sur "Modifier"
   - Modifiez les informations souhaitées
   - Enregistrez les modifications

3. **Filtrer les produits** :
   - Utilisez la barre de recherche pour chercher par nom
   - Sélectionnez une catégorie dans le filtre
   - Changez entre vue grille et liste

## Contribution
Pour contribuer au projet :
1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Commitez vos changements
4. Push vers la branche
5. Ouvrez une Pull Request

## Support
En cas de problème, vérifiez :
1. Que MongoDB est démarré
2. Que les ports 3000 et 5000 sont libres
3. Que toutes les dépendances sont installées
4. Les logs dans la console pour les erreurs

## Licence
MIT License
