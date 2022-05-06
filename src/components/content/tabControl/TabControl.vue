<template>
  <div class="tab-control">
    <div v-for="item, index in titles" 
      class="tab-control-item"
      :class="{active: index === currentIndex}"
      @click="changeIndex(index)">
       <span class="active">{{ item }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TabControl",
    props: {
      titles: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        currentIndex: 0,
      }
    },
    methods: {
      changeIndex(index) {
        this.currentIndex = index;
        this.$emit('tabClick', index)
      }
    }
  }
</script>

<style>
  .tab-control {
    display: flex;
    text-align: center;
    font-size: 15px;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    z-index: 99;
  }
  .tab-control div {
    flex: 1;
  }
  .tab-control div span{
    padding: 5px;
  }
  .active span {
    color: var(--color-high-text);
    border-bottom: 3px solid pink;
  }
</style>