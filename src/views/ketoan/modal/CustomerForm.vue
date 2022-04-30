<template>
    <div class="customerForm">
        <form id="customerCU" @submit="action_customer" v-if="!loading">
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
                    <label for="maso">Mã số Thuế</label>
                    <input minlength="10"  type="text" class="form-control" id="maso" v-model="customer.maso" placeholder="Tax-Code">
                  </div>
                </div>

                <div class="col">
                  <div class="form-group">
                    <label for="ghichu">Mặt hàng chính</label>
                    <input type="text" class="form-control" id="ghichu" v-model="customer.ghichu" placeholder="Comment">
                  </div>
                </div>
              </div>
  
              <div class="form-group">
                <label for="company">Tên Công ty</label>
                <input type="text" class="form-control" id="company" v-model="customer.company" name="company" aria-describedby="emailHelp" placeholder="Company">
              </div>
              <div class="form-group">
                <label for="address"> Địa chỉ</label>
                <input type="text" class="form-control" id="address" v-model="customer.address" placeholder="Address">
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
  name: "customerForm",
  //props: ["customer"],
  data() {
    return {
      errors: [],
      categories: [],
      sellers: [],
      loading: false,
    };
  },
  methods: {
    action_customer(event) {
      event.preventDefault();
      if(this.customer.company=='' || this.customer.address == '' || this.customer.maso == '') {
          this.errors = [];
          this.errors.push('Tên Công ty, địa chỉ và mã số thuế không được trống ...');
          return;
      }
      this.$emit("submit-form", this.customer);
    },
  },
  created() {
    //this.loading = true;
    this.customer = {
        company: '',
        address: '',
        maso: '',
        ghichu: ''
    };

    // axios
    //   .get(`${process.env.VUE_APP_BASE_URL}/customers`)
    //   .then((response) => {
    //     // getting all customers and getting the uniq value for
    //     // customerCategory and returning the customerCategory property only
    //     this.categories = _.uniqBy(
    //       _.map(response.data, function (object) {
    //         return _.pick(object, ["customerCategory"]);
    //       }),
    //       "customerCategory"
    //     );
    //     this.categories.push({ customerCategory: "Create New" });

    //     // getting all customers and getting the uniq value for
    //     // customerSeller and returning the customerSeller property only
    //     this.sellers = _.uniqBy(
    //       _.map(response.data, function (object) {
    //         return _.pick(object, ["customerSeller"]);
    //       }),
    //       "customerSeller"
    //     );

    //     this.sellers.push({ customerSeller: "Create New" });

    //     this.loading = false;
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     // errorToaster("Error while fetching customers", "");
    //   });
  },
};
</script>
<style lang="css">
.customerForm > div {
  text-align: start;
}
.customerForm #customerCU div {
  text-align: start;
}

.customerForm #customerCU button {
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