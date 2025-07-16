<template>
  <div class="home">
    <!-- Hero Section -->
    <div class="jumbotron bg-success text-white p-5 rounded mb-5">
      <div class="container text-center">
        <h1 class="display-4">
          <i class="fas fa-store me-3"></i>
          Bienvenue dans SAFOTIME
        </h1>
        <p class="lead">Gérez facilement les prix et les informations de vos produits alimentaires</p>
        <router-link to="/products" class="btn btn-light btn-lg">
          <i class="fas fa-eye me-2"></i>
          Voir les produits
        </router-link>
        <router-link to="/add-product" class="btn btn-outline-light btn-lg ms-3">
          <i class="fas fa-plus me-2"></i>
          Ajouter un produit
        </router-link>
      </div>
    </div>

    <!-- Statistiques -->
    <div class="row mb-5">
      <div class="col-md-3">
        <div class="card bg-primary text-white">
          <div class="card-body text-center">
            <i class="fas fa-apple-alt fa-2x mb-2"></i>
            <h4>{{ stats.totalProducts }}</h4>
            <p>Total Produits</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-success text-white">
          <div class="card-body text-center">
            <i class="fas fa-carrot fa-2x mb-2"></i>
            <h4>{{ stats.vegetables }}</h4>
            <p>Légumes</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-warning text-white">
          <div class="card-body text-center">
            <i class="fas fa-apple-alt fa-2x mb-2"></i>
            <h4>{{ stats.fruits }}</h4>
            <p>Fruits</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-info text-white">
          <div class="card-body text-center">
            <i class="fas fa-pepper-hot fa-2x mb-2"></i>
            <h4>{{ stats.others }}</h4>
            <p>Autres</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions rapides -->
    <div class="row">
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-body text-center">
            <i class="fas fa-list fa-3x text-primary mb-3"></i>
            <h5 class="card-title">Gérer les Produits</h5>
            <p class="card-text">Consultez, modifiez ou supprimez vos produits existants</p>
            <router-link to="/products" class="btn btn-primary">
              <i class="fas fa-arrow-right me-1"></i>
              Accéder
            </router-link>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-body text-center">
            <i class="fas fa-plus-circle fa-3x text-success mb-3"></i>
            <h5 class="card-title">Nouveau Produit</h5>
            <p class="card-text">Ajoutez un nouveau produit avec photo et prix</p>
            <router-link to="/add-product" class="btn btn-success">
              <i class="fas fa-plus me-1"></i>
              Ajouter
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Produits récents -->
    <div class="mt-5" v-if="recentProducts.length > 0">
      <h3 class="mb-4">
        <i class="fas fa-clock me-2"></i>
        Produits Récents
      </h3>
      <div class="row">
        <div class="col-md-4" v-for="product in recentProducts" :key="product._id">
          <div class="card mb-3">
            <img 
              :src="getImageUrl(product.image)" 
              class="card-img-top" 
              style="height: 200px; object-fit: cover;"
              :alt="product.name"
            >
            <div class="card-body">
              <h6 class="card-title">{{ product.name }}</h6>
              <p class="card-text">
                <span class="badge bg-secondary">{{ product.category }}</span>
                <strong class="text-success ms-2">{{ product.price }} EU/{{ product.unit }}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { productService } from '../services/api'

export default {
  name: 'Home',
  data() {
    return {
      stats: {
        totalProducts: 0,
        vegetables: 0,
        fruits: 0,
        others: 0
      },
      recentProducts: []
    }
  },
  async mounted() {
    await this.loadStats()
    await this.loadRecentProducts()
  },
  methods: {
    async loadStats() {
      try {
        const products = await productService.getAllProducts()
        this.stats.totalProducts = products.length
        this.stats.vegetables = products.filter(p => p.category === 'légumes').length
        this.stats.fruits = products.filter(p => p.category === 'fruits').length
        this.stats.others = products.filter(p => !['légumes', 'fruits'].includes(p.category)).length
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error)
      }
    },
    async loadRecentProducts() {
      try {
        const products = await productService.getAllProducts()
        this.recentProducts = products.slice(0, 3)
      } catch (error) {
        console.error('Erreur lors du chargement des produits récents:', error)
      }
    },
    getImageUrl(filename) {
      return productService.getImageUrl(filename)
    }
  }
}
</script>

<style scoped>
.jumbotron {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}
</style>
