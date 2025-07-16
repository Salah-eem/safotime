const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Données d'exemple
const sampleProducts = [
  {
    name: 'Tomates',
    category: 'légumes',
    price: 150,
    unit: 'kg',
    description: 'Tomates fraîches de qualité',
    inStock: true
  },
  {
    name: 'Pommes',
    category: 'fruits',
    price: 300,
    unit: 'kg',
    description: 'Pommes rouges sucrées',
    inStock: true
  },
  {
    name: 'Courgettes',
    category: 'légumes',
    price: 120,
    unit: 'kg',
    description: 'Courgettes tendres',
    inStock: true
  },
  {
    name: 'Bananes',
    category: 'fruits',
    price: 200,
    unit: 'kg',
    description: 'Bananes mûres',
    inStock: true
  },
  {
    name: 'Cumin',
    category: 'épices',
    price: 800,
    unit: 'g',
    description: 'Cumin moulu de qualité',
    inStock: true
  },
  {
    name: 'Poivrons',
    category: 'légumes',
    price: 180,
    unit: 'kg',
    description: 'Poivrons colorés',
    inStock: true
  },
  {
    name: 'Oranges',
    category: 'fruits',
    price: 250,
    unit: 'kg',
    description: 'Oranges juteuses',
    inStock: true
  },
  {
    name: 'Paprika',
    category: 'épices',
    price: 600,
    unit: 'g',
    description: 'Paprika doux',
    inStock: true
  }
];

async function seedDatabase() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connecté à MongoDB');
    
    // Supprimer les données existantes
    await Product.deleteMany({});
    console.log('Données existantes supprimées');
    
    // Insérer les données d'exemple
    await Product.insertMany(sampleProducts);
    console.log('Données d\'exemple insérées avec succès!');
    
    console.log(`${sampleProducts.length} produits ajoutés à la base de données`);
    
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connexion fermée');
  }
}

seedDatabase();
