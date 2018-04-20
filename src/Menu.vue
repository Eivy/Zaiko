<template>
  <nav class='mdl-navigation'>
    <router-link class='mdl-navigation__link' @click.native='hide()' to='/sales'><Icon>store</Icon> 販売</router-link>
    <router-link class='mdl-navigation__link' @click.native='hide()' to='/inventory'><Icon>view_module</Icon> 在庫</router-link>
    <hr/>
    <router-link class='mdl-navigation__link' @click.native='hide()' to='/settings/items'><Icon>settings</Icon> 管理</router-link>
    <a @click='logout()' id='logout' class='mdl-navigation__link'><Icon>directions_run</Icon> ログアウト</a>
  </nav>
</template>

<script>
export default {
  methods: {
    logout: function () {
      firebase.auth().signOut()
      location.reload()
    },
    hide: function () {
      document.querySelectorAll('.is-visible').forEach(function (e) { e.classList.remove('is-visible') })
    }
  }
}
</script>

<style scoped lang='scss'>
#logout {
  cursor: pointer;
}
</style>
