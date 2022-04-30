<template>
  <div class="createProduct">
    <modal
      :header="'Create Product'"
      :isShow="showModal"
      v-if="showModal"
      @close="showModal = false"
    >
      <product-form :product="product" v-on:submit-form="productAction" />
    </modal>
  </div>
</template>
<script>
import Modal from '../../shared/Modal.vue'
import ProductForm from './ProductForm'
import axios from 'axios'

export default {
  name: 'createProduct',
  components: { Modal, ProductForm },
  data() {
    return {
      product: new Object(),
      showModal: false,
    }
  },
  methods: {
    showModalForm: function () {
      this.showModal = true
    },

    productAction: function (product) {
      console.log('Creating new Product', product)

      // Create new product to server
      this.loading = true
      this.showModal = false
      axios
        .post(`${process.env.VUE_APP_BASE_URL}/products/`, {
          productName: product.productName,
          productDescription: product.productDescription,
          productCategory:
            product.productCategory === 'Create New'
              ? product.productCategoryDummy
              : product.productCategory,
          productSeller:
            product.productSeller === 'Create New'
              ? product.productSellerDummy
              : product.productSeller,
          productPrice: product.productPrice,
          productImage: product.productImage,
          productRating: product.productRating,
          isBestProduct: product.isBestProduct,
          isTopProduct: product.isTopProduct,
        })
        .then((response) => {
          this.loading = false
          this.CreateProduct = response.data
          // alert(`Created product : ${product.productName}` )
        })
        .catch(() => {
          this.$toastr.error(
            'Internal Error 500',
            'The server encountered an unexpected condition.',
          )
        })
    },
  },
}
</script>
<style lang="css"></style>
