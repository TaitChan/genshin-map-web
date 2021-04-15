<template>
  <div id="app">
    <div class="nav">
      <router-link to="/">瓦片形式地图</router-link> |
      <router-link to="/imageMap">图片形式地图</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {

  }
}
</script>

<style lang="scss" scoped>
.nav{
  position: absolute;
  right: 0;
  top: 0;
  z-index: 999;
  width: 200px;
  color: white;
  text-align: right;
  padding: 10px 20px 0 0;
}
.nav a.router-link-exact-active {
  color: #E5763C;
}
</style>
