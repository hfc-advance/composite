<template>
  <div class="login-root">
    <transition name="logo-slide">
      <section class="m-t88 transition-tr-opa" v-if="isStartAnimation">
        <div class="center-flex">
          <img class="logo-img" src="~components/assets/LogoWhite.png" alt="" srcset="">
        </div>
        <div class="login-container">
            <div class="login-bc">
            </div>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import { requestIdleCallback } from 'components/tools/utils.js'
export default {
  name: 'CommonLogin',
  data () {
    return {
      //! 是否开始动画
      isStartAnimation: false
    }
  },
  mounted () {
    //? 浏览器空闲的时候执行动画
    this.$nextTick()
      .then(() => {
        requestIdleCallback(() => {
          this.isStartAnimation = true
        })
      })
  }
}
</script>

<style lang="stylus" scoped>
.transition-tr-opa
  transition transform .4s cubic-bezier(.15, 0, .28, 1), opacity .4s cubic-bezier(.15, 0, .28, 1)
  will-change transform, opacity
.login-root
  background-image url('~components/assets/LoginBg.jpg')
  background-repeat no-repeat
  background-size cover
.logo-img
  width 164 * 2px
.m-t88
  margin-top 88px
.logo-slide-enter
  transform translate3d(0, 400px, 0)
  opacity 0
.login-container
  padding 0 40px
  margin-top 100px
.login-bc
  background-color white
  height 300px
  border-radius 8px
</style>
