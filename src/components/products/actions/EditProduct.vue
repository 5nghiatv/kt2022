<template>
  <div class="edit-product">
    <modal
      :header="'Edit Product'"
      :isShow="showModal"
      v-if="showModal"
      @close="showModal = false"
    >
      <product-form :product="product" v-on:submit-form="productAction" />
    </modal>
  </div>
</template>

<script>
import Modal from '../../shared/Modal'
import ProductForm from './ProductForm'
import axios from 'axios'
import { mapMutations } from 'vuex'

export default {
  name: 'editProduct',
  components: { Modal, ProductForm },
  data() {
    return {
      product: new Object(),
      showModal: false,
    }
  },
  mounted() {
    // console.log('edit tao this',this, typeof this.$refs.cartCalculator)
  },
  methods: {
    setProduct(product) {
      this.showModal = true
      this.product = product
    },

    productAction: function (product) {
      product.productCategory =
        product.productCategory === 'Create New'
          ? product.productCategoryDummy
          : product.productCategory
      product.productSeller =
        product.productSeller === 'Create New'
          ? product.productSellerDummy
          : product.productSeller
      console.log('Updated Product Details', product)

      // Update the product to server
      this.loading = true
      this.showModal = false
      axios
        .put(`${process.env.VUE_APP_BASE_URL}/products/${product._id}`, {
          productName: product.productName,
          productDescription: product.productDescription,
          // productCategory: product.productCategory === 'Create New' ? product.productCategoryDummy: product.productCategory,
          // productSeller: product.productSeller === 'Create New' ? product.productSellerDummy: product.productSeller,
          productCategory: product.productCategory,
          productSeller: product.productSeller,
          productPrice: product.productPrice,
          productImage: product.productImage,
          productRating: product.productRating,
          isBestProduct: product.isBestProduct,
          isTopProduct: product.isTopProduct,
        })
        .then((response) => {
          this.loading = false
          this.editProduct = response.data.data
          //alert(`Updated product : ${product.productName}` )
          this.updateProductCart(product)
          this.$toastr.success('', 'CẬP NHẬT chứng từ thành công.')
        })
        .catch((err) => {
          console.log('Error:', err)
          this.$toastr.error(
            'Internal Error 500',
            'The server encountered an unexpected condition.',
          )
        })
    },
    ...mapMutations(['SET_CART_PRODUCTS']),
    updateProductCart(product) {
      let products = JSON.parse(localStorage.getItem('iki-cart'))
      if (products == null) return // Phải có
      let splice = false
      for (let i = 0; i < products.length; i++) {
        if (products[i]._id === product._id) {
          product.amount = products[i].amount // PHẢI Giữ nguyên số lượng
          products.splice(i, 1)
          splice = true
        }
      }
      if (splice) {
        products.push(product)
        this.SET_CART_PRODUCTS(products)
        localStorage.setItem('iki-cart', JSON.stringify(products))
      }
    },
  },
}
</script>

<style></style>
