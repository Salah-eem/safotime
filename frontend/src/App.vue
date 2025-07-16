<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-success">
      <div class="container">
        <router-link class="navbar-brand" to="/">
          <i class="fas fa-store me-2"></i>
          SAFOTIME
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">
                <i class="fas fa-home me-1"></i>
                Accueil
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/products">
                <i class="fas fa-apple-alt me-1"></i>
                Produits
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/add-product">
                <i class="fas fa-plus me-1"></i>
                Ajouter
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container my-4">
      <router-view />
    </main>

    <footer class="bg-dark text-light py-4 mt-5">
      <div class="container text-center">
        <p>&copy; 2025 SAFOTIME - Gestion des produits alimentaires</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.5rem;
}

.nav-link {
  font-weight: 500;
}

.router-link-active {
  color: #ffffff !important;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
}
</style>
