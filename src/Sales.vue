<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">販売</span>
      </div>
    </header>
    <main>
    <div v-for='i in items' class='mdl-card mdl-shadow--2dp' :style='{background: "url(" + i.image + ") center / cover"}'>
      <div class="mdl-card__title mdl-card--expand"></div>
      <div class="mdl-card__actions">
        <span>{{i.id}}</span>
      </div>
    </div>
    </main>
  </div>
</template>

<script>
import path from 'path'

let snapshot
export default {
  data: function () { return { items: [] } },
  created: function () {
    let user = firebase.auth().currentUser
    let store = firebase.firestore().collection(path.join('Zaiko', user.uid, 'items'))
    snapshot = store.onSnapshot((s) => {
      this.items.splice(0, this.items.length)
      s.forEach((d) => {
        this.items.push(d.data())
      })
    })
  },
  mounted: function () {
    componentHandler.upgradeDom()
  },
  destroy: function () {
    snapshot()
  }
}
</script>

<style scoped lang='scss'>
.mdl-card {
  width: 200px;
  height: 200px;
  float: left;
  margin: 0.5rem;
  position: relative;
  &:hover {
    box-shadow: 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12), 0 5px 5px -3px rgba(0, 0, 0, .2);
  }
  .mdl-card__actions {
    background: rgba(240, 240, 240, 0.8);
  }
}

</style>
