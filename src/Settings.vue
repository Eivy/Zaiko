<template>
  <div class='mdl-layout mdl-js-layout mdl-layout--fixed-header'>
    <header class='mdl-layout__header'>
      <div class='mdl-layout__header-row'>
        <span class='mdl-layout-title'>管理</span>
      </div>
      <div class='mdl-layout__tab-bar mdl-js-ripple-effect' :style='{height: "auto"}'>
        <router-link class='mdl-layout__tab' :class='{"is-active": $router.currentRoute.name === "items"}' to='/settings/items'>商品</router-link>
        <router-link class='mdl-layout__tab' :class='{"is-active": $router.currentRoute.name === "farmers"}' to='/settings/farmers'>販売先</router-link>
        <router-link class='mdl-layout__tab' :class='{"is-active": $router.currentRoute.name === "sellers"}' to='/settings/sellers'>仕入先</router-link>
      </div>
    </header>
    <div class='mdl-layout__drawer'>
      <span class='mdl-layout-title'>Title</span>
    </div>
    <main class='mdl-layout__content'>
    <router-view></router-view>
    </main>
  </div>
</template>
<script>
export default {
  created: function () {
    console.log(this.$router.currentRoute.name)
  }
}
</script>
