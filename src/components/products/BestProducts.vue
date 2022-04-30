<template>
  <div class="best-products">
    <div class="row">
      <card-loader :loopCount="4" v-if="loading" />
      <div class="col-md-3" v-for="(item, index) in bestProducts" :key="index">
        <card-template :item="item" />
      </div>
    </div>
    <edit-product ref="editProduct" />
  </div>
</template>

<script>
import axios from 'axios'
import CardLoader from '../shared/CardLoader'
import CardTemplate from '../shared/CardTemplate'
import EditProduct from './actions/EditProduct'

export default {
  name: 'BestProducts',
  components: { CardLoader, CardTemplate, EditProduct },
  data() {
    return {
      bestProducts: [],
      loading: false,
    }
  },
  methods: {
    //manadatory function called from cardTemplate
    editProduct(product) {
      this.$refs.editProduct.setProduct(product)
    },
    getBestProducts() {
      this.loading = true
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/best/products`)
        .then((response) => {
          this.loading = false
          this.bestProducts = response.data
          //console.log(111,this.bestProducts);
        })
        .catch((error) => {
          console.log(error)
          this.$toastr.error(
            'Internal Error 500',
            'The server encountered an unexpected condition.',
          )
        })
    },
    getTest() {
      this.loading = true
      axios
        .get(`${process.env.VUE_APP_BASE_URL}/users`)
        .then((response) => {
          this.loading = false
          console.log('Đang chạy getTest() in BestProduct.vue', response.data)
        })
        .catch((error) => {
          console.log(error)
          this.$toastr.error(
            'Internal Error 500',
            'The server encountered an unexpected condition.',
          )
        })
    },
  },
  created() {
    this.getBestProducts()
    //this.getTest();
    //this.$toastr.success('XuânMai-VueShop','Welcome Trần Văn Nghĩa');
  },
}
</script>

<style>
.best-products {
  margin-bottom: 10px;
}
</style>
