<template>
  <nav class='mdl-navigation'>
    <router-link class='mdl-navigation__link' to='/sales'><Icon>store</Icon> 販売</router-link>
    <router-link class='mdl-navigation__link' to='/inventory'><Icon>view_module</Icon> 在庫</router-link>
    <hr/>
    <router-link class='mdl-navigation__link' to='/settings/items'><Icon>settings</Icon> 管理</router-link>
    <a @click='logout()' id='logout' class='mdl-navigation__link'><Icon>directions_run</Icon> ログアウト</a>
  </nav>
</template>

<script>
export default {
  methods: {
    logout () {
      firebase.auth().signOut()
      location.reload()
    }
  }
}
</script>

<style scoped lang='scss'>
#logout {
  cursor: pointer;
}
</style>
