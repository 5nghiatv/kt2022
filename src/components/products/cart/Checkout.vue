<template>
  <div class="cart-products">
    <div class="row mt-5">
      <div class="col-sm-8">
        <form id="productCU">
          <!-- <p v-if="errors.length">
                  <b>Please correct the following error(s):</b>
                  <ul>
                    <li v-for="error in errors" :key="error">{{ error }}</li>
                  </ul>
          </p>-->
          <div class="form-group">
            <label for="productName">Address 1</label>
            <input
              type="text"
              class="form-control"
              id="address1"
              name="address1"
              aria-describedby="emailHelp"
              placeholder="Enter Address"
              v-model="shippingDetail.address1"
            />
          </div>
          <div class="form-group">
            <label for="productCategory">Address 2</label>
            <input
              type="text"
              class="form-control"
              id="address2"
              placeholder="Enter Address 2"
              name="address2"
              v-model="shippingDetail.address2"
            />
          </div>
          <div class="form-group">
            <label for="productSeller">Country</label>
            <input
              type="text"
              class="form-control"
              id="Country"
              placeholder="Country"
              name="Country"
              v-model="shippingDetail.country"
            />
          </div>
          <div class="row">
            <div class="col">
              <div class="form-group">
                <label for="productRating">Zip code</label>
                <input
                  type="text"
                  class="form-control"
                  id="zipCode"
                  placeholder="Zip code"
                  v-model="shippingDetail.zipCode"
                />
              </div>
            </div>

            <div class="col">
              <div class="form-group">
                <label for="productRating">Thanh toán bằng thẻ VISA</label>
                <div>
                  <input
                    value="shippingDetail.paycash"
                    v-model="shippingDetail.paycash"
                    type="checkbox"
                    id="scales"
                    name="scales"
                    checked
                  />
                  <label for="scales"
                    >&nbsp;Thanh toán bằng tiền mặt khi nhận hàng</label
                  >
                </div>
              </div>
            </div>
          </div>
          <small id="emailHelp" class="form-text text-muted"
            >We'll never share your data with anyone else.</small
          >
          <br />
        </form>
      </div>
      <div class="col-sm-4">
        <cart-calculator ref="cartCalculator"></cart-calculator>
        <ul class="list-group mb-3">
          <router-link
            to="/e-commerce/products"
            class="btn btn-primary mt-2 text-white"
            >Tiếp tục mua hàng</router-link
          >
          <a
            v-if="totalValueCart != 0"
            href="javascript:;;"
            class="btn btn-success mt-2 text-white"
            @click="SaveAndPay"
            >Đặt hàng & Thanh toán</a
          >
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import CartCalculator from './CartCalculator'
import axios from 'axios'

export default {
  name: 'Checkout',
  components: { CartCalculator },
  computed: mapState(['loggedUser']),
  data() {
    return {
      totalValueCart: 0,
      shippingDetail: {
        address1: '208 Nguyễn Hữu Cảnh, P22, Q.Bình Thạnh - TP.HCM',
        address2: '118/63 Bạch Đằng, P24, Q.Bình Thạnh - TP.HCM',
        country: 'Việt Nam',
        zipCode: '700000',
        shippingDate: '',
        products: [],
        userId: '',
        totalPrice: '',
        paycash: false,
      },
    }
  },
  mounted() {
    this.totalValueCart = this.$refs.cartCalculator.totalValue
    // alert(this.totalValueCart)
  },
  methods: {
    ...mapMutations(['SET_CART_PRODUCTS']),

    createShippingDetail() {
      this.shippingDetail.shippingDate = new Date()
      this.shippingDetail.products = this.$refs.cartCalculator.cartProducts
      this.shippingDetail.userId = this.loggedUser._id
      this.shippingDetail.totalPrice = this.$refs.cartCalculator.totalValue
      //console.log(this.loggedUser, this.shippingDetail);

      this.loading = true
      axios
        .post(`${process.env.VUE_APP_BASE_URL}/shipping/`, this.shippingDetail)
        .then((response) => {
          console.log(response.data)
          this.loading = false
          //alert('Thank you for your Purchase...')
          this.$toastr.success(
            'XuânMai-VueShop',
            'Thank you for your Purchase...',
          )
        })
        .catch(() => {
          this.$toastr.error(
            'Internal Error 500',
            'The server encountered an unexpected condition.',
          )
        })

      let products = []
      this.SET_CART_PRODUCTS(products)
      localStorage.setItem('iki-cart', JSON.stringify(products))
      this.$refs.cartCalculator.calulateTotalPrice()
      this.$router.push({ path: '/' })
    },
    SaveAndPay() {
      if (this.shippingDetail.paycash) {
        this.createShippingDetail()
        return
      }
      this.shippingDetail.shippingDate = new Date()
      this.shippingDetail.products = this.$refs.cartCalculator.cartProducts
      this.shippingDetail.userId = this.loggedUser._id
      this.shippingDetail.totalPrice = this.$refs.cartCalculator.totalValue
      localStorage.setItem(
        'shippingDetail',
        JSON.stringify(this.shippingDetail),
      )
      // Save this.shippingDetail

      var stripe = window.Stripe(process.env.VUE_APP_STRIPE_KEY) // Stripe khai báo trong index.html
      axios
        .post(`${process.env.VUE_APP_BASE_URL}/purchase`, {
          items: this.$refs.cartCalculator.cartProducts,
          url: window.location.origin,
        })
        .then(function (response) {
          return response.data //response.json();
        })
        .then(function (session) {
          //console.log('session.id: ',session.id)
          return stripe.redirectToCheckout({ sessionId: session.id })
        })
        .then(function (result) {
          // If redirectToCheckout fails due to a browser or network
          // error, you should display the localized error message to your
          // customer using error.message.
          if (result.error) {
            alert(result.error.message)
          }
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
}
</script>

<style lang="css">
.cart-products > div {
  text-align: start;
}

.cart-products #productCU > div {
  text-align: start;
}

.cart-products #productCU > button {
  text-align: center;
}
</style>
