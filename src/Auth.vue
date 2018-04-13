<template>
  <div id='main' class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
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
export default {
  mounted: function () {
    const ui = new firebaseui.auth.AuthUI(firebase.auth())
    ui.start('#firebase-auth-container', {
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      tosUrl: ''
    })
  }
}
</script>

<style scoped lang='scss'>
.mdl-layout__content {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
