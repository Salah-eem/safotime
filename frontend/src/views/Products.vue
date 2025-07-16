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
            <div class="form-check me-3">
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
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                id="dragMode"
                v-model="dragMode"
                @change="toggleDragMode"
              >
              <label class="form-check-label" for="dragMode">
                <i class="fas fa-arrows-alt me-1"></i>
                Réorganiser
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
    <div v-else-if="gridView" class="row" :id="dragMode ? 'sortable-grid' : ''">
      <div 
        class="col-md-4 col-lg-3 mb-4 sortable-item" 
        v-for="product in filteredProducts" 
        :key="product._id"
        :data-id="product._id"
        :class="{ 'dragging-enabled': dragMode }"
      >
        <div class="card h-100" :class="{ 'drag-handle': dragMode }">
          <div v-if="dragMode" class="drag-indicator">
            <i class="fas fa-grip-vertical"></i>
          </div>
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
              <div class="btn-group" role="group" v-if="!dragMode">
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
            <th v-if="dragMode">Ordre</th>
            <th>Image</th>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Prix</th>
            <th>Unité</th>
            <th>Statut</th>
            <th v-if="!dragMode">Actions</th>
          </tr>
        </thead>
        <tbody :id="dragMode ? 'sortable-table' : ''">
          <tr 
            v-for="product in filteredProducts" 
            :key="product._id"
            :data-id="product._id"
            :class="{ 'dragging-enabled': dragMode, 'drag-handle': dragMode }"
            class="sortable-row"
          >
            <td v-if="dragMode" class="text-center">
              <i class="fas fa-grip-vertical text-muted drag-indicator"></i>
            </td>
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
            <td v-if="!dragMode">
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
import Sortable from 'sortablejs'

export default {
  name: 'Products',
  data() {
    return {
      products: [],
      filteredProducts: [],
      loading: true,
      gridView: true,
      dragMode: false,
      filters: {
        search: '',
        category: 'tous'
      },
      productToDelete: null,
      deleteModal: null,
      sortableInstance: null
    }
  },
  async mounted() {
    await this.loadProducts()
    this.deleteModal = new Modal(document.getElementById('deleteModal'))
  },
  beforeUnmount() {
    if (this.sortableInstance) {
      this.sortableInstance.destroy()
    }
  },
  methods: {
    async loadProducts() {
      try {
        this.loading = true
        this.products = await productService.getAllProducts()
        // Trier par ordre personnalisé s'il existe, sinon par ordre d'ajout
        this.products.sort((a, b) => {
          if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
            return a.displayOrder - b.displayOrder
          }
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        })
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
    },
    toggleDragMode() {
      this.$nextTick(() => {
        if (this.dragMode) {
          this.initializeSortable()
        } else {
          this.destroySortable()
        }
      })
    },
    initializeSortable() {
      this.destroySortable() // Détruire l'instance précédente s'il y en a une
      
      const containerSelector = this.gridView ? '#sortable-grid' : '#sortable-table'
      const container = document.querySelector(containerSelector)
      
      if (!container) return
      
      this.sortableInstance = Sortable.create(container, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        handle: this.gridView ? '.drag-handle' : '.sortable-row',
        onEnd: this.onSortEnd
      })
    },
    destroySortable() {
      if (this.sortableInstance) {
        this.sortableInstance.destroy()
        this.sortableInstance = null
      }
    },
    onSortEnd(evt) {
      const productId = evt.item.getAttribute('data-id')
      const newIndex = evt.newIndex
      const oldIndex = evt.oldIndex
      
      if (newIndex === oldIndex) return
      
      // Mettre à jour l'ordre local
      const movedProduct = this.filteredProducts.splice(oldIndex, 1)[0]
      this.filteredProducts.splice(newIndex, 0, movedProduct)
      
      // Mettre à jour l'ordre dans la liste principale
      const productIndex = this.products.findIndex(p => p._id === productId)
      if (productIndex !== -1) {
        const movedMainProduct = this.products.splice(productIndex, 1)[0]
        // Trouver la nouvelle position dans la liste principale
        const newMainIndex = this.getNewMainIndex(productId, newIndex)
        this.products.splice(newMainIndex, 0, movedMainProduct)
      }
      
      // Sauvegarder l'ordre
      this.saveProductOrder()
    },
    getNewMainIndex(movedProductId, newFilteredIndex) {
      // Si c'est au début
      if (newFilteredIndex === 0) return 0
      
      // Trouver le produit précédent dans la liste filtrée
      const prevProduct = this.filteredProducts[newFilteredIndex - 1]
      const prevMainIndex = this.products.findIndex(p => p._id === prevProduct._id)
      
      return prevMainIndex + 1
    },
    async saveProductOrder() {
      try {
        // Créer un tableau avec les IDs dans le nouvel ordre
        const orderedIds = this.products.map(product => product._id)
        
        // Simuler la sauvegarde de l'ordre (à adapter selon votre API)
        await productService.updateProductsOrder(orderedIds)
        
        console.log('Ordre des produits sauvegardé')
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'ordre:', error)
        // En cas d'erreur, recharger les produits pour revenir à l'état précédent
        this.loadProducts()
      }
    }
  },
  watch: {
    gridView() {
      if (this.dragMode) {
        this.$nextTick(() => {
          this.initializeSortable()
        })
      }
    },
    'filters.search'() {
      if (this.dragMode) {
        this.dragMode = false
        this.destroySortable()
      }
    },
    'filters.category'() {
      if (this.dragMode) {
        this.dragMode = false
        this.destroySortable()
      }
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

/* Styles pour le drag and drop */
.dragging-enabled {
  transition: all 0.3s ease;
}

.dragging-enabled:hover {
  cursor: grab;
}

.drag-handle {
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 10;
}

.sortable-row .drag-indicator {
  position: static;
  background: none;
  color: #6c757d;
  padding: 0;
}

/* Classes de Sortable.js */
.sortable-ghost {
  opacity: 0.5;
  background: #f8f9fa;
}

.sortable-chosen {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  z-index: 1000;
}

.sortable-drag {
  transform: rotate(5deg);
  opacity: 0.9;
}

/* Animation pour les cartes en mode drag */
.dragging-enabled .card {
  border: 2px dashed #dee2e6;
  background: #f8f9fa;
}

.dragging-enabled .card:hover {
  border-color: #198754;
  background: #d1e7dd;
}

/* Style pour les lignes de tableau en mode drag */
.sortable-row.dragging-enabled {
  background: #f8f9fa;
}

.sortable-row.dragging-enabled:hover {
  background: #e9ecef;
}

/* Indicateur visuel que le mode réorganisation est actif */
.dragging-enabled::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #198754, #20c997);
  z-index: 1;
}

/* Amélioration de l'apparence des boutons de contrôle */
.form-check-label {
  cursor: pointer;
  user-select: none;
}

.form-check-input:checked + .form-check-label {
  color: #198754;
  font-weight: 500;
}
</style>
