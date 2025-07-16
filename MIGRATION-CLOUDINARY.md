# Migration vers Cloudinary - Guide

## Problème résolu
- ✅ Les images ne disparaissent plus lors des redéploiements sur Render
- ✅ Stockage permanent et fiable des images
- ✅ Optimisation automatique des images (qualité, format, taille)
- ✅ CDN global pour des temps de chargement rapides

## Configuration nécessaire

### 1. Créer un compte Cloudinary (gratuit)
1. Aller sur [cloudinary.com](https://cloudinary.com)
2. Créer un compte gratuit (25 GB inclus)
3. Noter vos informations de configuration dans le Dashboard :
   - `Cloud Name`
   - `API Key`
   - `API Secret`

### 2. Variables d'environnement

#### Pour Render (Backend)
Ajouter ces variables d'environnement dans votre service Render :

```
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret
```

#### Pour le développement local
Créer un fichier `.env` dans `/backend` :

```
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret
USE_CLOUDINARY=true
```

### 3. Installation des dépendances
```bash
cd backend
npm install cloudinary multer-storage-cloudinary
```

### 4. Migration des images existantes
Si vous avez déjà des produits avec des images locales :

```bash
cd backend
node migrate-images.js
```

## Comment ça marche

### En production (Render)
- Les nouvelles images sont automatiquement uploadées vers Cloudinary
- Les URLs des images pointent directement vers Cloudinary
- Plus de perte d'images lors des redéploiements

### En développement
- Par défaut : stockage local (comme avant)
- Si `USE_CLOUDINARY=true` : utilise Cloudinary même en local

### Sécurité
- ✅ Les clés API sont stockées en variables d'environnement
- ✅ Validation des types de fichiers maintenue
- ✅ Limitation de taille maintenue (5MB)
- ✅ Optimisation automatique des images

## Avantages supplémentaires

1. **Performance** : CDN global Cloudinary
2. **Optimisation** : Compression et conversion automatiques
3. **Responsive** : Possibilité de générer différentes tailles
4. **Sauvegarde** : Images stockées de façon permanente
5. **Coût** : Gratuit jusqu'à 25 GB

## Dépannage

### Images qui ne s'affichent pas
1. Vérifier les variables d'environnement sur Render
2. Vérifier les logs de déploiement
3. Tester l'upload d'une nouvelle image

### Migration des anciennes images
```bash
# Vérifier quelles images ne sont pas encore migrées
node -e "
const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const localImages = await Product.find({
    image: { \$exists: true, \$ne: '' },
    \$expr: { \$not: { \$regexMatch: { input: '\$image', regex: /^https?:\/\// } } }
  });
  console.log('Images locales restantes:', localImages.length);
  process.exit();
});
"
```
