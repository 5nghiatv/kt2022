<template>
  <div class="dropdown">
    <div class="dropdown__select">
      <span class="dropdown__selected"> {{ title }}</span>
      <!-- <i class="fa fa-caret-down dropdown__caret"></i> -->
      <img class="dropdown__caret" src="../assets/icon-arrow-down.svg" alt="" />
    </div>
    <ul class="dropdown__list">
      <li
        class="dropdown__item"
        v-for="(opt, index) in DropOption"
        v-bind:key="index"
        @click="methodClick(opt.method)"
      >
        <span class="dropdown__text">{{ opt.title }}</span>
        <i :class="` ${opt.icon} dropdown__icon`"></i>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'dropdown',
  props: ['title', 'DropOption'],
  data() {
    return {}
  },
  mounted() {},
  methods: {
    methodClick(method) {
      this.$emit('methodClick', method)
    },
  },
}
</script>

<style lang="scss" scoped>
.dropdown {
  --primary: #1e2139;
  --secondary: #ffff;
  --thirdary: #ff8f00;
  //background-color: #1e2139;
  box-sizing: border-box;
  //font-size: 62.5%;
  font-family: 'Poppins', sans-serif;
  // width: 15rem;
  // max-width: 47.5rem;
  // margin: 5rem auto;
  position: relative;
  // color: white;
  // text-transform: uppercase;
  // font-size: 2.2rem;
  // font-weight: bold;
  border-radius: 4px;
}
.dropdown__select {
  border-radius: inherit;
}
.dropdown__list {
  width: 15rem;
  margin-top: 1rem;
  position: absolute;
  top: 100%;
  left: -2.5rem;
  right: 0;
  display: none;
}
.dropdown__list:before {
  content: '';
  height: 1rem;
  position: absolute;
  left: 0;
  right: 0;
  background-color: transparent;
  transform: translateY(-100%);
}
.dropdown:hover .dropdown__list {
  display: block;
}
.dropdown__select,
.dropdown__item {
  width: 100%;
  padding: 0.7rem;
  font-size: 14px;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}
.dropdown__item {
  transition: background-color 0.2s linear;
}
.dropdown__item:first-child {
  border-radius: 4px 4px 0 0;
  position: relative;
}
.dropdown__item:first-child:before {
  content: '';
  position: absolute;
  top: 0;
  left: 3rem;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid var(--primary);
  transform: translateY(-100%);
  transition: border-color 0.2s linear;
}
.dropdown__item:first-child:hover:before {
  border-bottom-color: var(--secondary);
}
.dropdown__item:last-child {
  border-radius: 0 0 4px 4px;
}
.dropdown__item:hover {
  background-color: var(--secondary);
  //background-color: rgba(255, 145, 0, 0.1);
  color: var(--thirdary);
}
.dropdown__caret {
  margin-left: 15px;
}
</style>
