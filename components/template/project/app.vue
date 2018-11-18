<template>
  <div id="app">
    <transition :name="pageChangeAnimation">
      <keep-alive>
        <router-view class="router-view-root"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  computed: {
    //! 路由切换动画名称
    ...mapState(['pageChangeAnimation'])
  },
  created () {
    this.$store.commit('setPageChangeAnimation', 'slide-left')
  }
}
</script>
