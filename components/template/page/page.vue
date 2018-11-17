<template>
  <div class="contain">
    <div>模板</div>
    <div class="btn" @click="jump">跳转</div>
  </div>
</template>

<script>
export default {
  name: 'pageTemplate',
  methods: {
    jump () {
      this.$router.push({ path: '/test' })
    }
  }
}
</script>

<style lang="stylus" scoped>
.contain
  background-color yellow
.btn
  height 200px
  text-align center
  border 2px solid red
  display flex
  align-items center
  justify-content center
</style>
