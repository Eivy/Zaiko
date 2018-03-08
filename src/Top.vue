<template>
  <div id='top' class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer">
    <div class="mdl-layout__drawer">
      <span class="mdl-layout-title">Zaiko</span>
      <nav class="mdl-navigation">
        <a class="mdl-navigation__link" href=""><i class='material-icons'>store</i> 販売</a>
        <a class="mdl-navigation__link" href=""><i class='material-icons'>view_module</i> 在庫</a>
        <hr/>
        <a class="mdl-navigation__link" href=""><i class='material-icons'>settings</i> 管理</a>
      </nav>
    </div>
    <main class="mdl-layout__content">
    <div id="main"></div>
    </main>
  </div>
</template>

<style lang='scss'>
body, html {
  width: 100%;
  height: 100%;
  #top {
    min-height: 100%;
  }
}
</style>
