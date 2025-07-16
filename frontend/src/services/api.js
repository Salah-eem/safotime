import axios from 'axios'

// Configuration de l'URL de base selon l'environnement
const API_BASE_URL = process.env.VUE_APP_API_URL 
  ? `${process.env.VUE_APP_API_URL}/api`
  : 'http://localhost:5000/api'

console.log('🌐 API URL:', API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 secondes timeout
})

export const productService = {
  // Récupérer tous les produits
  async getAllProducts(filters = {}) {
    const response = await api.get('/products', { params: filters })
    return response.data
  },

  // Récupérer un produit par ID
  async getProductById(id) {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  // Créer un nouveau produit
  async createProduct(productData) {
    const formData = new FormData()
    
    Object.keys(productData).forEach(key => {
      if (productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key])
      }
    })

    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // Mettre à jour un produit
  async updateProduct(id, productData) {
    const formData = new FormData()
    
    Object.keys(productData).forEach(key => {
      if (productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key])
      }
    })

    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // Supprimer un produit
  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },

  // Obtenir les statistiques par catégorie
  async getCategoryStats() {
    const response = await api.get('/products/stats/categories')
    return response.data
  },

  // Mettre à jour l'ordre des produits
  async updateProductsOrder(orderedIds) {
    const response = await api.put('/products/order', { orderedIds })
    return response.data
  },

  // Construire l'URL de l'image
  getImageUrl(filename) {
    if (!filename) return '/placeholder-image.jpg'
    const baseUrl = process.env.VUE_APP_API_URL || 'http://localhost:5000'
    return `${baseUrl}/uploads/${filename}`
  }
}

export default productService
