<template>
  <div class='mdl-layout mdl-js-layout mdl-layout--fixed-header'>
    <header class='mdl-layout__header'>
      <div class='mdl-layout__header-row'>
        <span class='mdl-layout-title'>管理</span>
      </div>
      <div class='mdl-layout__tab-bar mdl-js-ripple-effect' :style='{height: "auto", "overflow-x": "auto"}'>
        <router-link class='mdl-layout__tab' :class='{"is-active": $router.currentRoute.name === "items"}' to='/settings/items'>商品</router-link>
        <router-link class='mdl-layout__tab' :class='{"is-active": $router.currentRoute.name === "buyers"}' to='/settings/buyers'>販売先</router-link>
        <router-link class='mdl-layout__tab' :class='{"is-active": $router.currentRoute.name === "sellers"}' to='/settings/sellers'>仕入先</router-link>
        <router-link class='mdl-layout__tab' :class='{"is-active": $router.currentRoute.name === "categories"}' to='/settings/categories'>カテゴリー</router-link>
        <router-link class='mdl-layout__tab' :class='{"is-active": $router.currentRoute.name === "config"}' to='/settings/config'>設定</router-link>
      </div>
    </header>
    <main class='mdl-layout__content'>
    <router-view></router-view>
    </main>
  </div>
</template>

<style scoped lang='scss'>
.mdl-layout__content {
  height: 100%;
}
</style>
