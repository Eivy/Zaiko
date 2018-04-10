<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">在庫</span>
        <div class='mdl-layout-spacer'></div>
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right">
          <label class="mdl-button mdl-js-button mdl-button--icon" for="fixed-header-drawer-exp"><Icon>search</Icon></label>
          <div class="mdl-textfield__expandable-holder">
            <input class="mdl-textfield__input" v-model='filter' type="text" name="sample" id="fixed-header-drawer-exp">
            <ul class='mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect' for='fixed-header-drawer-exp'>
              <li class='mdl-menu__item'>カテゴリー</li>
              <li v-for='c in categories' class='mdl-menu__item'>
                <label @click.stop class='mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect' :for=c >
                  <input :id=c type='checkbox' v-model='filter_category' :value='c' class='mdl-checkbox__input'>
                  <span class='mdl-checkbox__label'>{{c}}</span>
                </label>
              </li>
            </ul>
          </div>
        </div>
        <nav class='mdl-navigation'>
          <router-link class='mdl-navigation__link' :to='{name: "inventoryHistory"}'>履歴</router-link>
        </nav>
      </div>
    </header>
    <main>
    <div v-for='i in filterd_items' @click='increase_more(i.id)' class='mdl-card mdl-shadow--2dp mdl-badge mdl-badge--overlap' :style='{background: "url(" + i.image + ") center / cover"}' :data-badge='buy[i.id] ? buy[i.id].count : null'>
      <div class="mdl-card__title mdl-card--expand"></div>
      <div @click.stop='decrease_more(i.id)' class="mdl-card__supporting-text">
        <div>{{i.id}}</div>
        <div>¥{{i.purchase}} 残:{{i.count}}</div>
        <button :disabled='!buy[i.id]' class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--fab mdl-button--mini-fab remove" @click.stop='decrease(i.id)'><Icon>remove</Icon></button>
        <button class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--fab mdl-button--mini-fab add" @click.stop='increase(i.id)'><Icon>add</Icon></button>
      </div>
    </div>
    </main>
    <footer class="mdl-mini-footer">
      <div class="mdl-mini-footer__left-section">
        <div class='mdl-textfield mdl-js-textfield'>
          <select id='seller' class='mdl-textfield__input' v-model=seller >
            <option value=''></option>
            <option v-for='(v, k) in sellers' :value='v'>{{k}}</option>
          </select>
          <label class='mdl-textfield__label' for='seller'>仕入先</label>
        </div>
      </div>
      <div class="mdl-mini-footer__right-section">
        <span>合計: <span>{{sum_count}}</span>個 <span>{{sum_price}}円</span></span>
        <SubmitButton @click.native='submit'></SubmitButton>
      </div>
    </footer>
  </div>
</template>

<script>
import path from 'path'

import SubmitButton from './SubmitButton.vue'

const store = firebase.firestore()

let snapshot = []
export default {
  components: { SubmitButton },
  data: function () { return Object.assign({ seller: '', buy: {}, filter: '', filter_category: [] }, this.$store.state) },
  mounted: function () {
    componentHandler.upgradeDom()
  },
  destroy: function () {
    snapshot()
  },
  methods: {
    increase_more: function (id) {
      if (this.config.count && this.config.count.use) {
        if (!this.buy[id]) {
          let data = Object.assign({}, this.items[id])
          data.count = 0
          Vue.set(this.buy, id, data)
        }
        this.buy[id].count += this.config.count.count
        if (this.buy[id].count === 0) {
          Vue.delete(this.buy, id)
        }
      }
    },
    decrease_more: function (id) {
      if (this.config.count && this.config.count.use && this.buy[id]) {
        if (this.buy[id].count <= this.config.count.count) {
          Vue.delete(this.buy, id)
        } else {
          this.buy[id].count -= this.config.count.count
        }
      }
    },
    increase: function (id) {
      if (!this.buy[id]) {
        let data = Object.assign({}, this.items[id])
        data.count = 0
        Vue.set(this.buy, id, data)
      }
      this.buy[id].count += 1
    },
    decrease: function (id) {
      if (this.buy[id]) {
        if (this.buy[id].count > 0) {
          this.buy[id].count -= 1
        }
        if (this.buy[id].count < 1) {
          Vue.delete(this.buy, id)
        }
      }
    },
    submit: function () {
      if (this.sum_count === 0) {
        alert('仕入れる商品がありません')
        return
      }
      let uid = this.$store.state.user.uid
      let inventory = store.collection(path.join('Zaiko', uid, 'inventory'))
      let items = store.collection(path.join('Zaiko', uid, 'items'))
      for (let id in this.buy) {
        items.doc(id).get().then((d) => {
          let data = d.data()
          data.count += this.buy[id].count
          items.doc(id).set(data)
          Vue.delete(this.buy, id)
        })
      }
      let data = {items: this.buy, date: new Date()}
      if (this.seller !== '') {
        data.seller = this.seller
      }
      inventory.add(data).then(d => {
        this.$router.push({name: 'inventoryDetail', params: {id: d.id}})
      })
    }
  },
  computed: {
    sum_count: function () {
      let sum = 0
      for (let id in this.buy) {
        sum += this.buy[id].count
      }
      return sum
    },
    sum_price: function () {
      let sum = 0
      for (let id in this.buy) {
        sum += this.items[id].purchase * this.buy[id].count
      }
      return sum
    },
    filterd_items: function () {
      if (this.filter === '' && this.filter_category.length === 0) {
        return this.items
      }
      let r = {}
      if (this.filter_category.length > 0) {
        for (let k in this.items) {
          if (this.items[k].categories) {
            let isInclude = true
            for (let c in this.filter_category) {
              isInclude = isInclude && (this.items[k].categories.indexOf(this.filter_category[c]) >= 0)
            }
            if (isInclude) {
              r[k] = this.items[k]
            }
          }
        }
      } else {
        Object.assign(r, this.items)
      }
      let re = new RegExp('.*(' + this.filter.replace(/([[\]\\{}.?*+^$])/, '\\$1').split(new RegExp('[ 　]+')).join('|') + ').*')
      for (let k in r) {
        if (!k.match(re)) {
          delete r[k]
        }
      }
      return r
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
.mdl-checkbox__label {
  position: absolute;
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
  #seller {
    background-color: white;
  }
}
</style>
