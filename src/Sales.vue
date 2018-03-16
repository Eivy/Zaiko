<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">販売</span>
        <div class='mdl-layout-spacer'></div>
        <nav class='mdl-navigation'>
          <router-link class='mdl-navigation__link' :to='{name: "salesHistory"}'>履歴</router-link>
        </nav>
      </div>
    </header>
    <main>
    <div v-for='i in items' class='mdl-card mdl-shadow--2dp mdl-badge mdl-badge--overlap' :style='{background: "url(" + i.image + ") center / cover"}' :data-badge='sell[i.id] ? sell[i.id].count : null'>
      <div class="mdl-card__title mdl-card--expand">
      </div>
      <div class="mdl-card__supporting-text">
        <div>{{i.id}}</div>
        <div>¥{{i.selling}} 残:{{sell[i.id] ? i.count - sell[i.id].count : i.count}}</div>
        <button :disabled='!sell[i.id]' class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab remove" @click='decrease(i.id)'>
          <i class="material-icons">remove</i>
        </button>
        <button :disabled='i.count === 0 || (sell[i.id] ? sell[i.id].count >= i.count : false)' class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab add" @click='increase(i.id)'>
          <i class="material-icons">add</i>
        </button>
      </div>
    </div>
    </main>
    <footer class="mdl-mini-footer">
      <div class="mdl-mini-footer__left-section">
        <div class='mdl-textfield mdl-js-textfield'>
          <select id='buyer' class='mdl-textfield__input' name=''>
            <option value=''></option>
            <option v-for='(v, k) in buyers' :value='k'>{{k}}</option>
          </select>
          <label class='mdl-textfield__label' for='buyer'>販売先</label>
        </div>
      </div>
      <div class="mdl-mini-footer__right-section">
        <div class="mdl-logo">合計: <span>{{sum_count}}</span>個 <span>{{sum_price}}円</span></div>
        <SubmitButton @click.native='submit'></SubmitButton>
      </div>
    </footer>
  </div>
</template>

<script>
import path from 'path'

import SubmitButton from './SubmitButton.vue'

const store = firebase.firestore()

let snapshot
export default {
  components: { SubmitButton },
  data: function () { return { items: {}, sell: {}, buyers: {} } },
  created: function () {
    let user = firebase.auth().currentUser
    let c = store.collection(path.join('Zaiko', user.uid, 'items'))
    snapshot = c.onSnapshot((s) => {
      for (let id in this.items) {
        delete this.items[id]
      }
      s.forEach((d) => {
        Vue.set(this.items, d.id, d.data())
      })
    })
    c = store.collection(path.join('Zaiko', user.uid, 'buyers'))
    snapshot = c.onSnapshot((s) => {
      for (let id in this.buyers) {
        delete this.buyers[id]
      }
      s.forEach((d) => {
        Vue.set(this.buyers, d.id, d.data())
      })
      console.log(this.buyers)
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
      if (!this.sell[id]) {
        let data = Object.assign({}, this.items[id])
        data.count = 0
        Vue.set(this.sell, id, data)
      }
      this.sell[id].count += 1
    },
    decrease: function (id) {
      if (this.sell[id]) {
        if (this.sell[id].count > 0) {
          this.sell[id].count -= 1
        }
        if (this.sell[id].count < 1) {
          Vue.delete(this.sell, id)
        }
      }
    },
    check: function () {
      for (let k in this.sell) {
        if (this.items[k].count < this.sell[k].count) {
          return k
        }
      }
    },
    submit: function () {
      if (this.sum_count === 0) {
        alert('販売する商品がありません')
        return
      }
      let check = this.check()
      if (check) {
        alert(check + 'の在庫が足りません')
        return
      }
      let user = firebase.auth().currentUser
      let sales = store.collection(path.join('Zaiko', user.uid, 'sales'))
      let items = store.collection(path.join('Zaiko', user.uid, 'items'))
      for (let id in this.sell) {
        items.doc(id).get().then((d) => {
          let data = d.data()
          data.count -= this.sell[id].count
          items.doc(id).set(data)
          Vue.delete(this.sell, id)
        })
      }
      let buyer = this.buyers[document.getElementById('buyer').value]
      let data = {items: this.sell, date: new Date()}
      if (buyer) {
        data.buyer = buyer
      }
      sales.doc().set(data)
    }
  },
  computed: {
    sum_count: function () {
      let sum = 0
      for (let id in this.sell) {
        sum += this.sell[id].count
      }
      return sum
    },
    sum_price: function () {
      let sum = 0
      for (let id in this.sell) {
        sum += this.items[id].selling * this.sell[id].count
      }
      return sum
    }
  }
}
</script>

<style scoped lang='scss'>
$backColor: rgba(240, 240, 240, 0.8);
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
  .mdl-card__supporting-text {
    width: 100%;
    padding: 5px 5px 0 5px;
    background: $backColor;
    box-sizing: border-box;
    opacity: 1;
    .mdl-button {
      background-color: #eee;
      height: 30px;
      width: 30px;
      min-width: 30px;
      min-height: 30px;
      position: absolute;
      bottom: 2px;
      &[disabled] {
        background-color: #ccc;
      }
      &.add {
        right: 34px;
      }
      &.remove {
        right: 2px;
      }
    }
  }
}
.mdl-mini-footer {
  .mdl-textfield {
    padding: 0;
  }
  .mdl-textfield__label {
    top: 5px;
    &:after {
      bottom: 0;
    }
  }
  #buyer {
    background-color: white;
  }
}
</style>
