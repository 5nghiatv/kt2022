<template>
    <div class="productForm">
        <form id="productCU" @submit="action_product" v-if="!loading">
                <p v-if="errors.length">
                  <b>Vui lòng sửa lỗi trước khi tiếp tục...</b>
                  <ul>
                    <li style="color: burlywood;font-style: italic;" v-for="error in errors" :key="error">{{ error }}</li>
                  </ul>
          <!-- eslint-disable-next-line -->
                </p>

              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label for="mahang">Mã hàng</label>
                    <input type="text" class="form-control" id="mahang" v-model="product.mahang" placeholder="">
                  </div>
                </div>

                <div class="col">
                  <div class="form-group">
                    <label for="donvi">Đơn vị</label>
                    <input type="text" class="form-control" id="donvi" v-model="product.donvi" placeholder="">
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label for="tenhang"> Tên hàng</label>
                <input type="text" class="form-control" id="tenhang" v-model="product.tenhang" placeholder="">
              </div>

              <br>
                <button type="submit" class="btn btn-info">Lưu thông tin</button>
        </form>

        <div class="lds-dual-ring" v-if="loading"></div>
    </div>
</template>
<script>
//import axios from "axios";
//import _ from "lodash";
export default {
  name: "productForm",
  //props: ["product"],
  data() {
    return {
      errors: [],
      categories: [],
      sellers: [],
      loading: false,
    };
  },
  methods: {
    action_product(event) {
      event.preventDefault();
      if(this.product.mahang==='' || this.product.tenhang === '' || this.product.donvi === '') {
          this.errors = [];
          this.errors.push('Thông tin mặt hàng không được trống ...');
          return;
      }
      this.$emit("submit-form", this.product);
    },
  },
  created() {
    //this.loading = true;
    this.product = {
        mahang: '',
        tenhang: '',
        donvi: '',
    };
    
  },
};
</script>
<style lang="css">
.productForm > div {
  text-align: start;
}
.productForm #productCU div {
  text-align: start;
}

.productForm #productCU button {
  text-align: center;
}

.lds-dual-ring {
  display: inline-block;
  width: 64px;
  height: 64px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 46px;
  height: 46px;
  margin: 1px;
  border-radius: 50%;
  border: 5px solid #fff;
  border-color: #41b883 transparent #41b883 transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>