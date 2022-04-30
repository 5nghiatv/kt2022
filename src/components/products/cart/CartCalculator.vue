<template>
  <div class="cart-calculator">
    <h4 class="d-flex justify-content-between align-items-center mb-3">
      <span class="text-muted">Your cart</span>
      <span class="badge badge-primary badge-pill">{{
        cartProducts.length
      }}</span>
    </h4>
    <ul class="list-group mb-3">
      <li
        class="list-group-item d-flex justify-content-between lh-condensed"
        v-for="(product, index) in cartProducts"
        :key="index"
      >
        <div>
          <h6 class="my-0">{{ product.productName }}</h6>
        </div>
        <span
          class="text-muted"
          style="width: 120px; float: right; margin-left: 20px"
        >
          x
          <input
            @change="tanggiamluong(product)"
            type="number"
            v-model="product.amount"
            min="1"
            max="1000"
            step="1"
          />
          {{ product.productPrice }}</span
        >
      </li>
      <hr />
      <li class="list-group-item d-flex justify-content-between">
        <span>Tổng cộng :</span>
        <strong
          >đ
          {{ this.number_format(totalValue.toFixed(2), 0, '.', ',') }}</strong
        >
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'cartCalculator',
  data() {
    return {
      totalValue: 0.0,
    }
  },
  computed: mapState(['cartProducts']),
  methods: {
    ...mapMutations(['ADD_CART_LOCAL', 'REP_CART_LOCAL', 'SET_CART_PRODUCTS']),
    tanggiamluong(product) {
      //alert(product.amount)
      product.amount = product.amount <= 0 ? 1 : product.amount
      this.REP_CART_LOCAL(product)
      this.calulateTotalPrice()
    },
    calulateTotalPrice() {
      this.totalValue = 0
      this.cartProducts.forEach((product) => {
        this.totalValue += parseFloat(
          product.productPrice.replace(',', '') * product.amount,
        )
      })
    },
    number_format(number, decimals, dec_point, thousands_sep) {
      // Strip all characters but numerical ones.
      number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
      var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
        dec = typeof dec_point === 'undefined' ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
          var k = Math.pow(10, prec)
          return '' + Math.round(n * k) / k
        }
      // Fix for IE parseFloat(0.55).toFixed(0) = 0;
      s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
      if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
      }
      if ((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
      }
      return s.join(dec)
    },
  },
  created() {
    this.calulateTotalPrice()
  },
}
</script>
<style>
/* button, input {
    overflow: visible;
    width: 40px;
    height: fit-content;
} */
</style>
