<template>
  <div class="home-component">
    <div class="jumbotron jumbotron-fluid" style="padding: 0rem 0rem">
      <div class="container">
        <img alt="Vue logo" src="../../assets/logo.png" width="100px" />
        <h3 class="display-5" style="font-size: 30px">
          <span style="color: #42b983">Xuân Mai - VueShop</span>
        </h3>
        <!-- <p class="lead">A ShoppingCart (Ecommerce) Application using Vue.js.</p> -->
      </div>
    </div>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item active" aria-current="page">
          Our Best Products
        </li>
        <li class="ml-auto" aria-current="page">
          <router-link to="/e-commerce/products">Show All</router-link>
        </li>
      </ol>
    </nav>
    <BestProducts></BestProducts>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item active" aria-current="page">
          Our Top Products
        </li>
        <li class="ml-auto" aria-current="page">
          <router-link to="/e-commerce/products">Show All</router-link>
        </li>
      </ol>
    </nav>
    <TopProducts></TopProducts>
  </div>
</template>

<script>
// @ is an alias to /src

import BestProducts from '@/components/products/BestProducts.vue'
import TopProducts from '@/components/products/TopProducts.vue'
export default {
  name: 'home',
  components: {
    BestProducts,
    TopProducts,
  },
}
</script>

<style scoped>
* a {
  color: #42b983;
}
a:hover {
  color: #0056b3;
}
.jumbotron {
  text-align: center;
  padding: 1rem 0rem;
}
</style>
