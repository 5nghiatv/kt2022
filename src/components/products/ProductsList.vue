<template>
  <div class="products">
    <div class="row">
      <div class="col-md-4" v-for="(item, index) in products_list" :key="index">
        <card-template :item="item" />
      </div>
    </div>
    <edit-product ref="editProduct" />
  </div>
</template>

<script>
import CardTemplate from '../shared/CardTemplate'
import EditProduct from './actions/EditProduct'
import { mapMutations } from 'vuex'
import axios from 'axios'

export default {
  name: 'productslist',
  props: ['products_list'],
  components: { CardTemplate, EditProduct },
  data() {
    return {
      selectedProduct: Object,
    }
  },
  methods: {
    //manadatory function called from cardTemplate while onClick 'edit'
    editProduct(product) {
      // this.will pass the product to the editProduct to bind with Product Object
      this.$refs.editProduct.setProduct(product)
    },
    deleteProduct(product, id) {
      let conf = confirm(
        'Confirm want to delete product name:  ' + product.productName + ' ?',
      )
      if (conf === true) {
        this.loading = true
        axios
          .delete(`${process.env.VUE_APP_BASE_URL}/products/${id}`)
          .then((response) => {
            this.loading = false
            this.delProduct = response.data
            this.delProductCart(product)
            this.delProductList(product)
          })
          .catch((error) => {
            console.log(error)
            this.$toastr.error(
              'Internal Error 500',
              'The server encountered an unexpected condition.',
            )
          })
      }
    },
    ...mapMutations(['SET_CART_PRODUCTS']),
    delProductCart(product) {
      const products = JSON.parse(localStorage.getItem('iki-cart'))
      let splice = false
      //console.log(111,products,product)
      for (let i = 0; i < products.length; i++) {
        if (products[i]._id === product._id) {
          products.splice(i, 1)
          splice = true
        }
      }
      if (splice) {
        this.SET_CART_PRODUCTS(products)
        localStorage.setItem('iki-cart', JSON.stringify(products))
      }
    },
    delProductList(product) {
      //console.log(product);
      let products = this.products_list
      for (let i = 0; i < products.length; i++) {
        if (products[i]._id === product._id) {
          products.splice(i, 1)
        }
      }
    },
  },
  mounted() {},
}
</script>

<style>
.footerIcons {
  font-size: 95%;
}

/* .card {    // Không nên đặt
  height: 490px;
} */

.card-text {
  height: 70px;
  overflow: hidden;
}
</style>
