const mongoose = require('mongoose');
const Product = require('./models/Product');
const { cloudinary } = require('./config/cloudinary');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function migrateImages() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB réussie');

    // Récupérer tous les produits avec des images locales
    const products = await Product.find({
      image: { $exists: true, $ne: '' },
      $expr: { $not: { $regexMatch: { input: '$image', regex: /^https?:\/\// } } }
    });

    console.log(`🔄 ${products.length} produits à migrer`);

    for (const product of products) {
      try {
        const imagePath = path.join(__dirname, 'uploads', product.image);
        
        // Vérifier si le fichier existe localement
        if (fs.existsSync(imagePath)) {
          console.log(`📤 Upload de ${product.image} vers Cloudinary...`);
          
          // Upload vers Cloudinary
          const result = await cloudinary.uploader.upload(imagePath, {
            folder: 'safotime-products',
            public_id: `product-${product._id}`,
            transformation: [
              { width: 800, height: 600, crop: 'limit' },
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          });

          // Mettre à jour le produit avec la nouvelle URL
          await Product.findByIdAndUpdate(product._id, {
            image: result.secure_url
          });

          console.log(`✅ ${product.name} - Image migrée vers Cloudinary`);
        } else {
          console.log(`⚠️  ${product.name} - Fichier local introuvable: ${product.image}`);
        }
      } catch (error) {
        console.error(`❌ Erreur pour ${product.name}:`, error.message);
      }
    }

    console.log('🎉 Migration terminée !');
  } catch (error) {
    console.error('❌ Erreur de migration:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Lancer la migration si le script est exécuté directement
if (require.main === module) {
  migrateImages();
}

module.exports = migrateImages;
