<template>
    <div class="accountForm">
        <form id="accountCU" @submit="action_account" v-if="!loading">
                <p v-if="errors.length">
                  <b>Vui lòng sửa lỗi trước khi tiếp tục...</b>
                  <ul>
                    <li style="color: burlywood;font-style: italic;" v-for="error in errors" :key="error">{{ error }}</li>
                  </ul>
        <!-- eslint-disable-next-line -->          
                </p>

              <div class="form-group">
                <label for="sotk">Số tài khoản</label>
                <input type="text" class="form-control" id="sotk" v-model="account.sotk" name="sotk" aria-describedby="emailHelp" placeholder="">
              </div>
              <div class="form-group">
                <label for="tentk"> Tên tài khoản</label>
                <input type="text" class="form-control" id="tentk" v-model="account.tentk" placeholder="">
              </div>

              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <label for="nodn">Nợ đầu năm</label>
                    <input type="number" class="form-control" id="nodn" v-model="account.nodn" placeholder="">
                  </div>
                </div>

                <div class="col">
                  <div class="form-group">
                    <label for="codn">Có đầu năm</label>
                    <input type="number" class="form-control" id="codn" v-model="account.codn" placeholder="">
                  </div>
                </div>
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
  name: "accountForm",
  //props: ["account"],
  data() {
    return {
      errors: [],
      categories: [],
      sellers: [],
      loading: false,
    };
  },
  methods: {
    action_account(event) {
      event.preventDefault();
      this.account.nodn = this.account.nodn *1;
      this.account.codn = this.account.codn *1;
      if(this.account.sotk==='' || this.account.tentk === '') {
          this.errors = [];
          this.errors.push('Tên và số tài khoản không được trống ...');
          return;
      }
      this.$emit("submit-form", this.account);
    },
  },
  created() {
    //this.loading = true;
    this.account = {
        sotk: '',
        tentk: '',
        nodn: 0,
        codn: 0,
    };
    
    // axios
    //   .get(`${process.env.VUE_APP_BASE_URL}/accounts`)
    //   .then((response) => {
    //     // getting all accounts and getting the uniq value for
    //     // accountCategory and returning the accountCategory property only
    //     this.categories = _.uniqBy(
    //       _.map(response.data, function (object) {
    //         return _.pick(object, ["accountCategory"]);
    //       }),
    //       "accountCategory"
    //     );
    //     this.categories.push({ accountCategory: "Create New" });

    //     // getting all accounts and getting the uniq value for
    //     // accountSeller and returning the accountSeller property only
    //     this.sellers = _.uniqBy(
    //       _.map(response.data, function (object) {
    //         return _.pick(object, ["accountSeller"]);
    //       }),
    //       "accountSeller"
    //     );

    //     this.sellers.push({ accountSeller: "Create New" });

    //     this.loading = false;
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     // errorToaster("Error while fetching accounts", "");
    //   });
  },
};
</script>
<style lang="css">
.accountForm > div {
  text-align: start;
}
.accountForm #accountCU div {
  text-align: start;
}

.accountForm #accountCU button {
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
.modal-content {
    width: 120%;
}    
</style>