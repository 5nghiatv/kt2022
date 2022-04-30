<template>
  <div class="cardTemplate">
    <div class="card mb-4 shadow-sm">
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
      <div class="card-body" style="max-height: 300px; font-size: 0.875rem">
        <h6 class="card-text">{{ item.productName }}.</h6>
        <p class="card-text">{{ item.productDescription }}.</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <button
              type="button"
              class="btn btn-sm btn-outline-secondary"
              v-on:click="navigateProductDetail(item)"
            >
              View
            </button>

            <button
              type="button"
              class="btn btn-sm btn-outline-info"
              v-on:click="updateEditProduct(item, item._id)"
              v-if="
                loggedUser &&
                (loggedUser.isAdmin || loggedUser.admin) &&
                typeof this.$parent.editProduct === 'function'
              "
            >
              Edit
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-danger"
              v-on:click="deleteProduct(item, item._id)"
              v-if="
                loggedUser &&
                (loggedUser.isAdmin || loggedUser.admin) &&
                typeof this.$parent.products_list === 'object'
              "
            >
              Del
            </button>
          </div>
          <small class="text-muted footerIcons">
            <a href="javascript:;;" class="p-2">
              <i class="fa fa-heart"></i>
            </a>
            <a href="javascript:;;" class="p-2" v-on:click="addToCart(item)">
              <i class="fa fa-shopping-cart"></i>
            </a>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState, mapMutations } from 'vuex'
import _ from 'lodash'
export default {
  name: 'cardTemplate',
  props: ['item'],
  data() {
    return {
      showModal: false,
    }
  },
  components: {},
  computed: mapState(['loggedUser']),
  methods: {
    navigateProductDetail(product) {
      if (this.$route.name == 'productDetails')
        return this.$toastr.info(
          'Is current route',
          'Current route is : ' + this.$route.name,
        )
      this.$router.push({ name: 'productDetails', params: { id: product._id } })
    },

    ...mapMutations(['ADD_CART_LOCAL', 'REP_CART_LOCAL', 'SET_CART_PRODUCTS']),

    addToCart(product) {
      const data = _.find(this.$store.getters.cartProducts, product)
      if (data) {
        this.$toastr.info(
          'Product Already Added',
          'Already Added,only increased by 1',
        )
        data.amount++ // đã có thì tăng lượng 1
        this.REP_CART_LOCAL(data)
      } else {
        this.$toastr.success('Product Added Successfully', 'Added Successfully')
        product.amount = 1
        //console.log(222,product);
        this.ADD_CART_LOCAL(product)
      }
    },

    // this will trigger the parentComponent function
    updateEditProduct(product, id) {
      console.log(id, typeof this.$parent.editProduct) // Không dùng không được
      if (typeof this.$parent.editProduct === 'undefined')
        return this.$toastr.info('XuânMai-VueShop', 'Current not Edit Product ')
      this.$parent.editProduct(product) // in ProductsList oncly
    },

    deleteProduct(product, id) {
      this.$parent.deleteProduct(product, id) // in ProductsList oncly
    },
    saveShippingDetail() {
      const shippingDetail = JSON.parse(localStorage.getItem('shippingDetail'))
      axios
        .post(`${process.env.VUE_APP_BASE_URL}/shipping/`, shippingDetail)
        .then((response) => {
          console.log(response.data)
          let products = []
          this.SET_CART_PRODUCTS(products)
          localStorage.setItem('iki-cart', JSON.stringify(products))
          console.log('Purchase payment and order shipping store Successful...')
          //this.$refs.cartCalculator.calulateTotalPrice();
        })
        .catch(() => {
          this.$toastr.error(
            'Internal Error 500',
            'The server encountered an unexpected condition.',
          )
        })
    },
  },
  mounted() {},
  created() {
    if (window.location.href.includes('success')) {
      // Sau khi thanh toán xong, server gọi router #/success.Nếu đúng thì saveShippingDetail() & Xóa rổng Cart
      window.location.href = window.location.href.replace('success', 'home')
      this.saveShippingDetail()
    }
  },
}
</script>

<style>
.card-text {
  height: 65px !important;
  overflow: hidden;
  font-size: 15px;
}
.btn:not(:disabled):not(.disabled) {
  cursor: pointer;
  width: auto;
}
</style>
