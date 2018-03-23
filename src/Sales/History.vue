<template>
  <div class='mdl-layout mdl-js-layout mdl-layout--fixed-header'>
    <header class='mdl-layout__header'>
      <div class='mdl-layout__header-row'>
        <span class='mdl-layout-title'>販売履歴</span>
      </div>
    </header>
    <main>
    <div>
      <span id='cond_label'>表示条件</span>
      <div class='mdl-textfield mdl-js-textfield mdl-textfield--floating-label'>
        <input v-model='count' class='mdl-textfield__input' type='number' id='count'>
        <label class='mdl-textfield__label' for='sample3'>表示件数</label>
      </div>
      <div v-if='config.buyer && config.buyer.use' class='mdl-textfield mdl-js-textfield mdl-textfield--floating-label'>
        <select id='buyer' v-model=buyer class='mdl-textfield__input'>
          <option value=''></option>
          <option v-for='(v, k) in buyers' :value='k'>{{k}}</option>
        </select>
        <label class='mdl-textfield__label' for='buyer'>販売先</label>
      </div>
      <SubmitButton @click.native='filter' ></SubmitButton>
    </div>
    <div v-for='v in sales' class='mdl-card mdl-card-wide mdl-shadow--2dp'>
      <div class='mdl-card__title'>
        <router-link :to='{name: "detail", params: { id }}'>
          <Icon class='mdl-list__item-icon'>shopping_basket</Icon>
          {{date_format(v.date)}}
          </router-link>
      </div>
      <div class='mdl-card__supporting-text'>
          <div>{{ list_item(v.items) }}</div>
          <div v-if=v.buyer >販売先: {{ v.buyer.id }}</div>
      </div>
    </div>
    </main>
  </div>
</template>

<script>
import path from 'path'

import SubmitButton from '../SubmitButton.vue'

const store = firebase.firestore()
let collection

export default {
  data: function () { return { user: this.$store.state.user, config: this.$store.state.config, sales: [], buyers: this.$store.state.buyers, count: 10, buyer: '' } },
  components: { SubmitButton },
  created: function () {
    collection = store.collection(path.join('Zaiko', this.user.uid, 'sales'))
    let c = collection.limit(this.count)
    this.get(c)
  },
  mounted: function () {
    componentHandler.upgradeDom()
  },
  methods: {
    get: function (c) {
      c.orderBy('date', 'desc').get().then((s) => {
        this.sales.splice(0, this.sales.length)
        s.forEach((d) => {
          let data = d.data()
          data.id = d.id
          this.sales.push(data)
        })
      })
    },
    date_format: function (date) {
      let r = ''
      r += date.getFullYear() + '年'
      r += this.padding(date.getMonth()) + '月'
      r += this.padding(date.getDate()) + '日 '
      r += this.padding(date.getHours()) + '時'
      r += this.padding(date.getMinutes()) + '分'
      return r
    },
    padding: function (str) {
      return ('0'.repeat(2) + str).slice(-2)
    },
    list_item: function (items) {
      let r = ''
      for (let k in items) {
        r += items[k].id + ' ×' + items[k].count + ', '
      }
      return r
    },
    filter: function () {
      this.count = Number(this.count)
      let c = collection
      if (this.buyer.length > 0) {
        c = c.where('buyer.id', '==', this.buyer)
      }
      if (this.count.length !== 0 && this.count > 0) {
        c = c.limit(this.count)
      }
      this.get(c)
    }
  }
}
</script>

<style scoped lang='scss'>
.mdl-card {
  width: calc(100% - 1rem);
  min-height: initial;
  margin: 0.5rem;
}
.mdl-textfield {
  display: inline-flex;
}
#cond_label {
  padding: 1rem;
}
</style>
