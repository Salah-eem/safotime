<template>
  <div class="add-product">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header bg-success text-white">
            <h4 class="mb-0">
              <i class="fas fa-plus me-2"></i>
              Ajouter un Nouveau Produit
            </h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="submitForm">
              <div class="row">
                <!-- Image Upload -->
                <div class="col-md-4 mb-3">
                  <label class="form-label">Photo du produit</label>
                  <div class="text-center">
                    <div class="image-upload-container">
                      <img 
                        v-if="imagePreview" 
                        :src="imagePreview" 
                        class="img-thumbnail mb-2"
                        style="max-width: 200px; max-height: 200px; object-fit: cover;"
                        alt="Aperçu"
                      >
                      <div v-else class="image-placeholder mb-2">
                        <i class="fas fa-image fa-3x text-muted"></i>
                        <p class="text-muted">Aucune image</p>
                      </div>
                      <input 
                        type="file" 
                        class="form-control" 
                        @change="handleImageUpload"
                        accept="image/*"
                        ref="imageInput"
                      >
                    </div>
                  </div>
                </div>

                <!-- Form Fields -->
                <div class="col-md-8">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Nom du produit *</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="form.name"
                        required
                        placeholder="Ex: Tomates"
                      >
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Catégorie *</label>
                      <select 
                        class="form-select" 
                        v-model="form.category"
                        required
                      >
                        <option value="">Choisir une catégorie</option>
                        <option value="légumes">Légumes</option>
                        <option value="fruits">Fruits</option>
                        <option value="épices">Épices</option>
                        <option value="autres">Autres</option>
                      </select>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Prix *</label>
                      <div class="input-group">
                        <input 
                          type="number" 
                          class="form-control" 
                          v-model="form.price"
                          required
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        >
                        <span class="input-group-text">EU</span>
                      </div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Unité *</label>
                      <select 
                        class="form-select" 
                        v-model="form.unit"
                        required
                      >
                        <option value="">Choisir une unité</option>
                        <option value="kg">Kilogramme (kg)</option>
                        <option value="g">Gramme (g)</option>
                        <option value="pièce">Pièce</option>
                        <option value="litre">Litre</option>
                        <option value="ml">Millilitre (ml)</option>
                      </select>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Description</label>
                    <textarea 
                      class="form-control" 
                      v-model="form.description"
                      rows="3"
                      placeholder="Description du produit (optionnel)"
                    ></textarea>
                  </div>

                  <div class="mb-3">
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        v-model="form.inStock"
                        id="inStock"
                      >
                      <label class="form-check-label" for="inStock">
                        Produit disponible en stock
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="d-flex justify-content-between pt-3 border-top">
                <router-link to="/products" class="btn btn-secondary">
                  <i class="fas fa-arrow-left me-1"></i>
                  Retour
                </router-link>
                <button 
                  type="submit" 
                  class="btn btn-success"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="fas fa-save me-1"></i>
                  {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Preview Card -->
        <div class="card mt-4" v-if="form.name">
          <div class="card-header">
            <h6 class="mb-0">
              <i class="fas fa-eye me-1"></i>
              Aperçu du produit
            </h6>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-3">
                <img 
                  :src="imagePreview || '/placeholder-image.jpg'" 
                  class="img-fluid rounded"
                  style="max-height: 150px; object-fit: cover;"
                  :alt="form.name"
                >
              </div>
              <div class="col-md-9">
                <h5>{{ form.name }}</h5>
                <p class="text-muted">{{ form.description || 'Aucune description' }}</p>
                <div class="mb-2">
                  <span class="badge bg-secondary">{{ form.category || 'Catégorie non définie' }}</span>
                  <span 
                    class="badge ms-1"
                    :class="form.inStock ? 'bg-success' : 'bg-danger'"
                  >
                    {{ form.inStock ? 'En stock' : 'Rupture' }}
                  </span>
                </div>
                <div class="text-success fw-bold">
                  {{ form.price || '0' }} EU{{ form.unit ? '/' + form.unit : '' }}
                </div>
              </div>
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
  name: 'AddProduct',
  data() {
    return {
      form: {
        name: '',
        category: '',
        price: '',
        unit: '',
        description: '',
        inStock: true,
        image: null
      },
      imagePreview: null,
      loading: false
    }
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.form.image = file
        
        // Créer l'aperçu
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imagePreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    async submitForm() {
      try {
        this.loading = true
        
        // Validation
        if (!this.form.name || !this.form.category || !this.form.price || !this.form.unit) {
          alert('Veuillez remplir tous les champs obligatoires')
          return
        }

        await productService.createProduct(this.form)
        alert('Produit ajouté avec succès!')
        this.$router.push('/products')
      } catch (error) {
        console.error('Erreur lors de la création du produit:', error)
        alert('Erreur lors de la création du produit')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.image-placeholder {
  border: 2px dashed #dee2e6;
  border-radius: 0.375rem;
  padding: 2rem;
  text-align: center;
  background-color: #f8f9fa;
}

.image-upload-container {
  position: relative;
}

.form-label {
  font-weight: 600;
  color: #495057;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.card-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
