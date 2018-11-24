<template>
  <div>
    <div class="loading-root center-flex">
      <div class="loading-container center-flex">
        <div class="rotate-item"></div>
        <img class="w-80" src="~components/assets/loading/loadingSm.png" alt="" srcset="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApiLoading',
  data () {
    return {
      //! 是否展示loading
      isShoaLoading: false
    }
  },
  methods: {
    //? 展示loading
    show () {
      this.isShoaLoading = true
    },
    //? 隐藏loading
    hide () {
      this.isShoaLoading = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.loading-root
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  transform translate3d(0, 0, 0)
  z-index 999
.loading-container
  width 120px
  height 120px
  background-color black
  border-radius 8px
  position relative
.w-80
  width 70px
.rotate-item
  position absolute
  top 5px
  left 5px
  bottom 5px
  right 5px
  border 4px solid rgba(255, 255, 255, .5)
  border-right-color transparent
  border-left-width 7px
  border-radius 999px
  animation rotate .8s linear infinite
@keyframes rotate {
  from {
    transform rotate(0deg)
  }
  to {
    transform rotate(360deg)
  }
}
</style>
