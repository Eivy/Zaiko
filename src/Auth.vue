<template>
  <div id='main' class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/2.5.1/firebaseui.css" />
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">ログイン</span>
      </div>
    </header>
    <main class="mdl-layout__content">
    <div id='firebase-auth-container'></div>
    </main>
  </div>
</template>

<script>
import firebaseui from 'firebaseui'
const ui = new firebaseui.auth.AuthUI(firebase.auth())
export default {
  mounted: function () {
    ui.start('#firebase-auth-container', {
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      tosUrl: ''
    })
  }
}
</script>

<style scoped lang='scss'>
#firebase-auth-container {
  height: 100vh;
}
</style>
