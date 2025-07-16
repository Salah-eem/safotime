const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Configuration CORS pour production
const corsOptions = {
  origin: [process.env.CORS_ORIGIN, 'https://safotime.vercel.app', 
    'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques (images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connection à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connecté à MongoDB');
  console.log('📊 Base de données:', mongoose.connection.db.databaseName);
})
.catch(err => {
  console.error('❌ Erreur de connexion MongoDB:', err.message);
  console.log('💡 Vérifiez votre URI MongoDB dans le fichier .env');
  console.log('💡 Pour MongoDB Atlas, utilisez: configure-atlas.bat');
});

// Gestion des événements de connexion MongoDB
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connecté à MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Erreur MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose déconnecté de MongoDB');
});

// Routes
app.use('/api/products', require('./routes/products'));

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API fonctionne correctement!',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Route de santé pour Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Route pour servir les infos de l'API
app.get('/api', (req, res) => {
  res.json({
    name: 'SAFOTIME API',
    version: '1.0.0',
    description: 'API pour la gestion des produits alimentaires',
    endpoints: {
      products: '/api/products',
      test: '/api/test',
      health: '/health'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
