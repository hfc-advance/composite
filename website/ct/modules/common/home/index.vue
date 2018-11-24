<template>
  <div class="home-root">
  </div>
</template>

<script>
export default {
  name: 'CommonHome',
  created () {
    this.$get('main/basicInfo', {
      CorpPayType: 'public',
      DeviceId: 'H51542942257951',
      GE: '1542942257953',
      Height: 2208,
      Model: 9,
      Site: '0',
      Width: 1242,
      language: 'CHS',
      pu: '0.9536196232524814',
      token: 'f04fa3dd70bf45539c24372ed46f0f3e'
    })
      .then(res => {
        console.log(res)
      })
  }
}
</script>

<style lang="stylus" scoped>
.home-root
  background-image url('~components/assets/HomeBg.jpg')
  background-repeat no-repeat
  background-size cover
</style>
