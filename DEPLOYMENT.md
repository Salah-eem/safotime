# Guide de Déploiement SAFOTIME

## 🚀 Déploiement Backend sur Render

### 1. Configuration des variables d'environnement

Dans votre service Render, ajouter ces variables :

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/safotime
PORT=5000
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret
```

### 2. Configuration du service Render

- **Build Command** : `npm install`
- **Start Command** : `npm start`
- **Root Directory** : `backend`

### 3. Migration des images existantes

Si vous avez déjà des produits, exécuter une fois après le déploiement :

```bash
npm run migrate-images
```

## 🌐 Déploiement Frontend sur Vercel

### 1. Variables d'environnement Vercel

```
VUE_APP_API_URL=https://votre-backend.onrender.com
```

### 2. Configuration de build

Vercel détecte automatiquement Vue.js, mais vérifiez :

- **Framework Preset** : Vue.js
- **Root Directory** : `frontend`
- **Build Command** : `npm run build`
- **Output Directory** : `dist`

## 🔧 Problèmes courants

### Images qui disparaissent après redéploiement

✅ **Solution implémentée** : Cloudinary remplace le stockage local

### CORS Issues

Vérifier que `FRONTEND_URL` est configuré dans les variables d'environnement backend.

### Base de données inaccessible

1. Vérifier `MONGODB_URI`
2. Autoriser l'IP de Render dans MongoDB Atlas (0.0.0.0/0 pour tous)

## 📝 Checklist de déploiement

### Backend (Render)
- [ ] Variables d'environnement configurées
- [ ] Service connecté au repository GitHub
- [ ] Auto-deploy activé sur la branche main
- [ ] Migration des images exécutée

### Frontend (Vercel)
- [ ] `VUE_APP_API_URL` configuré
- [ ] Auto-deploy configuré
- [ ] Preview deployments activés

## 🛠 Maintenance

### Mettre à jour le backend
1. Push vers GitHub
2. Render redéploie automatiquement
3. Les images restent disponibles via Cloudinary

### Mettre à jour le frontend
1. Push vers GitHub
2. Vercel redéploie automatiquement

### Sauvegarder les images
Les images sont automatiquement sauvegardées sur Cloudinary et ne nécessitent aucune action manuelle.

## 📊 Monitoring

### Logs Backend (Render)
- Dashboard Render > Logs
- Surveillance des erreurs de connexion MongoDB
- Vérification des uploads Cloudinary

### Analytics Frontend (Vercel)
- Dashboard Vercel > Analytics
- Temps de chargement des pages
- Erreurs de build