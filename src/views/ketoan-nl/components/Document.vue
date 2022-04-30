<template>
  <!-- <router-link class="document flex" :to="{ name: 'DocumentView', params: { ctid: document.ctid } }"> -->
  <div class="document flex" @click="setCurrentDoc(document.ctid)">
    <div class="left flex">
      <span class="tracking-number flex-column">{{ document.soct }}</span>
      <span class="due-date flex-column">{{ document.ngay }}</span>
      <span class="diengiai flex-column">{{ document.diengiai }}</span>
      <span class="person flex-column">{{ document.tkno }}</span>
      <span class="person flex-column">{{ document.tkco }}</span>
    </div>
    <div class="right flex">
      <span class="price">{{ numberFormat(document.sotien) }}</span>
      <div
        class="status-button flex"
        :class="{
          paid: setColorNumber('paid'),
          draft: setColorNumber('draft'),
          pending: setColorNumber('pending'),
        }"
      >
        <span v-if="setColorNumber('paid')">Paid</span>
        <span v-if="setColorNumber('draft')">Draft</span>
        <span v-if="setColorNumber('pending')">Pend</span>
      </div>
      <div class="icon">
        <img src="../assets/icon-arrow-right.svg" alt="" />
      </div>
    </div>
  </div>
  <!-- </router-link> -->
</template>

<script>
const { numberFormat, setColorNumber } = require('../utility')
import { mapMutations } from 'vuex'

export default {
  name: 'document',
  props: ['document'],
  methods: {
    ...mapMutations('myDocument', [
      'SET_CURRENT_DOCUMENT',
      'TOGGLE_DOCUMENT_VIEW',
    ]),
    async setCurrentDoc(ctid) {
      // if(!this.$route.path.includes('/documents')) this.$router.replace('/documents');
      // reset url Luôn giữ đúng vì trước đó có thể dùng gotop || bottom
      await this.SET_CURRENT_DOCUMENT(ctid)
      this.TOGGLE_DOCUMENT_VIEW()
    },
    numberFormat(x) {
      return numberFormat(x)
    },
    setColorNumber(opt) {
      // Dòng này quá nguy hiểm
      var sotien = this.document.sotien ? this.document.sotien : 0
      return setColorNumber(opt, sotien)
    },
  },
}
</script>

<style lang="scss" scoped>
.document {
  transition-delay: 1s;
  transition-property: background-color;
  transition: all 1s ease-out;

  text-decoration: none;
  cursor: pointer;
  gap: 16px;
  margin-bottom: 16px;
  color: #fff;
  border-radius: 20px;
  padding: 28px 32px;
  background-color: #1e2139;
  align-items: center;

  span {
    font-size: 13px;
  }

  .left {
    align-items: center;
    flex-basis: 70%;
    gap: 15px;

    span {
      flex: 1;
    }

    .tracking-number {
      text-transform: uppercase;
      // width: 270px;  // Ngu ngốc
    }
  }

  .right {
    gap: 15px;
    flex-basis: 30%;
    align-items: center;

    .price {
      flex: 1;
      font-size: 15px;
      font-weight: 600px;
    }
  }
  .diengiai {
    // background: red;
    flex: 0 0 300px !important;
  }
}
</style>
