const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

const router = express.Router();

// Utiliser Cloudinary en production, stockage local en développement
let upload;

if (process.env.NODE_ENV === 'production' || process.env.USE_CLOUDINARY === 'true') {
  // Configuration Cloudinary pour la production
  const { storage } = require('../config/cloudinary');
  
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées!'), false);
    }
  };

  upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB
    }
  });
} else {
  // Configuration locale pour le développement
  const localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées!'), false);
    }
  };

  upload = multer({ 
    storage: localStorage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB
    }
  });
}

// GET /api/products - Récupérer tous les produits
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};
    
    if (category && category !== 'tous') {
      filter.category = category;
    }
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    const products = await Product.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/stats/categories - Statistiques par catégorie
router.get('/stats/categories', async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          averagePrice: { $avg: '$price' }
        }
      }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/products/order - Mettre à jour l'ordre des produits
router.put('/order', async (req, res) => {
  try {
    const { orderedIds } = req.body;
    
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: 'orderedIds doit être un tableau' });
    }

    // Mettre à jour l'ordre de chaque produit
    const updatePromises = orderedIds.map((productId, index) => {
      return Product.findByIdAndUpdate(
        productId,
        { displayOrder: index },
        { new: true }
      );
    });

    await Promise.all(updatePromises);
    
    res.json({ message: 'Ordre des produits mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/:id - Récupérer un produit par ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products - Créer un nouveau produit
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const productData = {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      unit: req.body.unit,
      description: req.body.description,
      inStock: req.body.inStock !== undefined ? req.body.inStock : true
    };

    if (req.file) {
      // En production avec Cloudinary, utiliser l'URL complète
      // En développement, utiliser juste le filename
      productData.image = process.env.NODE_ENV === 'production' || process.env.USE_CLOUDINARY === 'true' 
        ? req.file.path 
        : req.file.filename;
    }

    const product = new Product(productData);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/products/:id - Mettre à jour un produit
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      unit: req.body.unit,
      description: req.body.description,
      inStock: req.body.inStock
    };

    if (req.file) {
      // En production avec Cloudinary, utiliser l'URL complète
      // En développement, utiliser juste le filename
      updateData.image = process.env.NODE_ENV === 'production' || process.env.USE_CLOUDINARY === 'true' 
        ? req.file.path 
        : req.file.filename;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/products/:id - Supprimer un produit
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
