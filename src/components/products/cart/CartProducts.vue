<template>
  <div class="cart-products">
    <div class="row mt-5">
      <div class="col">
        <div class="row">
          <template v-if="cartProducts.length > 0">
            <div
              class="col-md-4"
              v-for="(item, index) in cartProducts"
              :key="index"
            >
              <div class="card mb-4 shadow-sm" style="height: 410px">
                <img
                  class="card-img-top mt-2"
                  v-bind:src="item.productImage"
                  alt="Card image cap"
                  style="
                    max-height: 700px;
                    max-width: 220px;
                    min-height: 220px;
                    min-width: 220px;
                    margin: auto;
                  "
                />
                <div class="card-body">
                  <h6 class="card-text">{{ item.productName }}.</h6>
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div class="btn-group">
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-secondary"
                        v-on:click="navigateProductDetail(item)"
                      >
                        View
                      </button>
                    </div>
                    <small class="text-muted footerIcons">
                      <a
                        href="javascript:;;"
                        class="p-2"
                        v-on:click="removeProductCart(item)"
                      >
                        <i class="fa fa-trash"></i>
                      </a>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="error-template container">
              <h1>Oops!</h1>
              <h2>No Products Found</h2>
              <div class="error-details">Your cart is empty</div>
              <div class="error-actions">
                <a class="btn text-white">
                  <span class="glyphicon glyphicon-envelope"></span>
                  <router-link to="/e-commerce/products"
                    >Take me to Products Page</router-link
                  >
                </a>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="col-4">
        <cart-calculator ref="cartCalculator"></cart-calculator>
        <ul class="list-group mb-3">
          <router-link
            to="/e-commerce/products"
            class="btn btn-primary mt-2 text-white"
            >Tiếp tục mua hàng</router-link
          >
          <router-link
            v-if="totalValueCart != 0"
            to="/e-commerce/checkout"
            class="btn btn-warning mt-2 text-white"
            >Thanh toán</router-link
          >
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import CartCalculator from './CartCalculator'
export default {
  name: 'CartProducts',
  components: { CartCalculator },
  data() {
    return {
      totalValueCart: 0,
    }
  },
  computed: mapState(['cartProducts']),
  methods: {
    navigateProductDetail(product) {
      this.$router.push({
        name: 'productDetails',
        params: { id: product._id },
      })
    },

    /* Resetting the store and localstorage after removing product from cart */
    ...mapMutations(['SET_CART_PRODUCTS']),

    removeProductCart(product) {
      //return console.log(product);
      const products = JSON.parse(localStorage.getItem('iki-cart'))
      for (let i = 0; i < products.length; i++) {
        if (products[i]._id === product._id) {
          products.splice(i, 1)
        }
      }
      this.SET_CART_PRODUCTS(products)
      localStorage.setItem('iki-cart', JSON.stringify(products))
      this.$refs.cartCalculator.calulateTotalPrice()
    },
  },
  mounted() {
    this.totalValueCart = this.$refs.cartCalculator.totalValue
    //localStorage.setItem("iki-cart", '');
    //console.log(1100,this.cartProducts)
  },
}
</script>

<style>
* a {
  color: #42b983;
}
.error-template {
  padding: 40px 15px;
  text-align: center;
}

.error-actions {
  margin-top: 15px;
  margin-bottom: 15px;
}

.error-actions .btn {
  margin-right: 10px;
}

.btn:not(:disabled):not(.disabled) {
  cursor: pointer;
  width: auto;
}
</style>
