<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">販売</span>
      </div>
    </header>
    <main>
    <div v-for='i in items' class='mdl-card mdl-shadow--2dp mdl-badge mdl-badge--overlap' :style='{background: "url(" + i.image + ") center / cover"}' :data-badge='counts[i.id]'>
      <div class="mdl-card__title mdl-card--expand"></div>
      <div class="mdl-card__actions">
        <span>{{i.id}}</span>
        <button :disabled='!counts[i.id]' class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab" @click='decrease(i.id)'>
          <i class="material-icons">remove</i>
        </button>
        <button :disabled='i.count === 0 || counts[i.id] >= i.count' class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab" @click='increase(i.id)'>
          <i class="material-icons">add</i>
        </button>
      </div>
    </div>
    </main>
    <footer class="mdl-mini-footer">
      <div class="mdl-mini-footer__right-section">
        <div class="mdl-logo">合計: <span>{{sum_count}}</span>個 <span>{{sum_price}}円</span></div>
      </div>
    </footer>
  </div>
</template>

<script>
import path from 'path'

let snapshot
export default {
  data: function () { return { items: {}, counts: {} } },
  created: function () {
    let user = firebase.auth().currentUser
    let store = firebase.firestore().collection(path.join('Zaiko', user.uid, 'items'))
    snapshot = store.onSnapshot((s) => {
      for (let id in this.items) {
        delete this.items[id]
      }
      s.forEach((d) => {
        Vue.set(this.items, d.id, d.data())
      })
    })
  },
  mounted: function () {
    componentHandler.upgradeDom()
  },
  destroy: function () {
    snapshot()
  },
  methods: {
    increase: function (id) {
      if (this.counts[id] === undefined) {
        Vue.set(this.counts, id, 0)
      }
      this.counts[id] += 1
    },
    decrease: function (id) {
      if (this.counts[id] && this.counts[id] > 0) {
        this.counts[id] -= 1
      }
      if (this.counts[id] < 1) {
        Vue.delete(this.counts, id)
      }
    }
  },
  computed: {
    sum_count: function () {
      let sum = 0
      for (let id in this.counts) {
        sum += this.counts[id]
      }
      return sum
    },
    sum_price: function () {
      let sum = 0
      for (let id in this.counts) {
        sum += this.items[id].selling * this.counts[id]
      }
      return sum
    }
  }
}
</script>

<style scoped lang='scss'>
main {
  height: 100%;
  overflow-y: auto;
}
.mdl-card {
  max-width: calc(50vmin - 2rem);
  max-height: calc(50vmin - 2rem);
  min-height: 100px;
  min-width: 100px;
  width: 200px;
  height: 200px;
  float: left;
  margin: 1rem;
  position: relative;
  overflow: visible;
  &:hover {
    box-shadow: 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12), 0 5px 5px -3px rgba(0, 0, 0, .2);
  }
  .mdl-card__actions {
    background: rgba(240, 240, 240, 0.8);
    .mdl-button {
      height: 30px;
      width: 30px;
      min-width: 30px;
      min-height: 30px;
      float: right;
    }
  }
}

</style>
