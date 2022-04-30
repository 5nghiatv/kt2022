<template>
  <div class="modal flex">
    <div class="modal-content">
      <div class="thongbao">Thông báo</div>
      <p>{{ modalTextNew }}</p>
      <div class="actions flex">
        <button @click="yesModal" class="purple">Thực hiện</button>
        <button @click="noModel" class="red">Kết thúc</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'modal',
  computed: {
    ...mapState('myDocument', ['modalTextNew']),
  },

  methods: {
    yesModal() {
      this.$emit('resSubmit', 'Yes')
    },

    noModel() {
      this.$emit('resSubmit', 'No')
    },
  },
}
</script>

<style lang="scss" scoped>
button,
.button {
  padding: 16px 24px !important; // Quá nguy hiểm
}
.thongbao {
  font-size: 2rem;
  color: darkgoldenrod;
  padding: 0px 0px 40px;
}
.modal {
  z-index: 100;
  position: fixed;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;

  .modal-content {
    border-radius: 20px;
    padding: 48px 32px;
    max-width: 450px;
    background-color: #252945;
    color: #fff;

    p {
      text-align: center;
    }

    .actions {
      margin-top: 24px;
      button {
        flex: 1;
      }
    }
  }
}
</style>
