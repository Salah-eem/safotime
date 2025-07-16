<template>
  <div class="products">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>
        <i class="fas fa-apple-alt me-2"></i>
        Gestion des Produits
      </h2>
      <router-link to="/add-product" class="btn btn-success">
        <i class="fas fa-plus me-1"></i>
        Nouveau Produit
      </router-link>
    </div>

    <!-- Filtres -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row">
          <div class="col-md-4">
            <label class="form-label">Rechercher</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="filters.search"
              placeholder="Nom du produit..."
              @input="filterProducts"
            >
          </div>
          <div class="col-md-4">
            <label class="form-label">Catégorie</label>
            <select 
              class="form-select" 
              v-model="filters.category"
              @change="filterProducts"
            >
              <option value="tous">Toutes les catégories</option>
              <option value="légumes">Légumes</option>
              <option value="fruits">Fruits</option>
              <option value="épices">Épices</option>
              <option value="autres">Autres</option>
            </select>
          </div>
          <div class="col-md-4 d-flex align-items-end">
            <button 
              class="btn btn-outline-secondary me-2"
              @click="resetFilters"
            >
              <i class="fas fa-undo me-1"></i>
              Reset
            </button>
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                id="viewMode"
                v-model="gridView"
              >
              <label class="form-check-label" for="viewMode">
                Vue grille
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <!-- Vue grille -->
    <div v-else-if="gridView" class="row">
      <div class="col-md-4 col-lg-3 mb-4" v-for="product in filteredProducts" :key="product._id">
        <div class="card h-100">
          <img 
            :src="getImageUrl(product.image)" 
            class="card-img-top" 
            style="height: 200px; object-fit: cover;"
            :alt="product.name"
          >
          <div class="card-body d-flex flex-column">
            <h6 class="card-title">{{ product.name }}</h6>
            <p class="card-text small text-muted flex-grow-1">{{ product.description }}</p>
            <div class="mb-2">
              <span class="badge bg-secondary">{{ product.category }}</span>
              <span 
                class="badge ms-1"
                :class="product.inStock ? 'bg-success' : 'bg-danger'"
              >
                {{ product.inStock ? 'En stock' : 'Rupture' }}
              </span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <strong class="text-success">{{ product.price }} EU/{{ product.unit }}</strong>
              <div class="btn-group" role="group">
                <router-link 
                  :to="`/edit-product/${product._id}`" 
                  class="btn btn-sm btn-outline-primary"
                >
                  <i class="fas fa-edit"></i>
                </router-link>
                <button 
                  class="btn btn-sm btn-outline-danger"
                  @click="confirmDelete(product)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vue liste -->
    <div v-else class="table-responsive">
      <table class="table table-striped">
        <thead class="table-dark">
          <tr>
            <th>Image</th>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Prix</th>
            <th>Unité</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product._id">
            <td>
              <img 
                :src="getImageUrl(product.image)" 
                class="rounded"
                style="width: 50px; height: 50px; object-fit: cover;"
                :alt="product.name"
              >
            </td>
            <td>
              <strong>{{ product.name }}</strong>
              <br>
              <small class="text-muted">{{ product.description }}</small>
            </td>
            <td>
              <span class="badge bg-secondary">{{ product.category }}</span>
            </td>
            <td class="text-success fw-bold">{{ product.price }} EU</td>
            <td>{{ product.unit }}</td>
            <td>
              <span 
                class="badge"
                :class="product.inStock ? 'bg-success' : 'bg-danger'"
              >
                {{ product.inStock ? 'En stock' : 'Rupture' }}
              </span>
            </td>
            <td>
              <div class="btn-group" role="group">
                <router-link 
                  :to="`/edit-product/${product._id}`" 
                  class="btn btn-sm btn-outline-primary"
                >
                  <i class="fas fa-edit me-1"></i>
                  Modifier
                </router-link>
                <button 
                  class="btn btn-sm btn-outline-danger"
                  @click="confirmDelete(product)"
                >
                  <i class="fas fa-trash me-1"></i>
                  Supprimer
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Aucun produit -->
    <div v-if="!loading && filteredProducts.length === 0" class="text-center py-5">
      <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
      <h5 class="text-muted">Aucun produit trouvé</h5>
      <p class="text-muted">
        {{ filters.search || filters.category !== 'tous' ? 'Essayez de modifier vos filtres' : 'Commencez par ajouter votre premier produit' }}
      </p>
      <router-link to="/add-product" class="btn btn-success" v-if="!filters.search && filters.category === 'tous'">
        <i class="fas fa-plus me-1"></i>
        Ajouter le premier produit
      </router-link>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmer la suppression</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>Êtes-vous sûr de vouloir supprimer le produit <strong>{{ productToDelete?.name }}</strong> ?</p>
            <p class="text-danger">Cette action est irréversible.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-danger" @click="deleteProduct">
              <i class="fas fa-trash me-1"></i>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { productService } from '../services/api'
import { Modal } from 'bootstrap'

export default {
  name: 'Products',
  data() {
    return {
      products: [],
      filteredProducts: [],
      loading: true,
      gridView: true,
      filters: {
        search: '',
        category: 'tous'
      },
      productToDelete: null,
      deleteModal: null
    }
  },
  async mounted() {
    await this.loadProducts()
    this.deleteModal = new Modal(document.getElementById('deleteModal'))
  },
  methods: {
    async loadProducts() {
      try {
        this.loading = true
        this.products = await productService.getAllProducts()
        this.filteredProducts = [...this.products]
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error)
        alert('Erreur lors du chargement des produits')
      } finally {
        this.loading = false
      }
    },
    filterProducts() {
      let filtered = [...this.products]

      if (this.filters.search) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(this.filters.search.toLowerCase())
        )
      }

      if (this.filters.category !== 'tous') {
        filtered = filtered.filter(product => product.category === this.filters.category)
      }

      this.filteredProducts = filtered
    },
    resetFilters() {
      this.filters.search = ''
      this.filters.category = 'tous'
      this.filteredProducts = [...this.products]
    },
    confirmDelete(product) {
      this.productToDelete = product
      this.deleteModal.show()
    },
    async deleteProduct() {
      try {
        await productService.deleteProduct(this.productToDelete._id)
        await this.loadProducts()
        this.deleteModal.hide()
        this.productToDelete = null
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        alert('Erreur lors de la suppression du produit')
      }
    },
    getImageUrl(filename) {
      return productService.getImageUrl(filename)
    }
  }
}
</script>

<style scoped>
.card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.table th {
  font-weight: 600;
}
</style>
