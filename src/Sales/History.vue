<template>
  <div class='mdl-layout mdl-js-layout mdl-layout--fixed-header'>
    <header class='mdl-layout__header'>
      <div class='mdl-layout__header-row'>
        <span class='mdl-layout-title'>販売履歴</span>
      </div>
    </header>
    <main>
    <div>
      <div class='mdl-textfield mdl-js-textfield mdl-textfield--floating-label'>
        <input v-model='count' @change='filter' class='mdl-textfield__input' type='number' id='count'>
        <label class='mdl-textfield__label' for='sample3'>表示件数</label>
      </div>
      <div v-if='config.buyer && config.buyer.use' class='mdl-textfield mdl-js-textfield mdl-textfield--floating-label'>
        <select id='buyer' v-model=buyer @change='filter' class='mdl-textfield__input'>
          <option value=''></option>
          <option v-for='(v, k) in buyers' :value='k'>{{k}}</option>
        </select>
        <label class='mdl-textfield__label' for='buyer'>販売先</label>
      </div>
    </div>
    <ul class='mdl-list'>
      <li v-for='v in sales' class='mdl-list__item mdl-list__item--three-line'>
        <span class='mdl-list__item-primary-content'>
          <Icon class='mdl-list__item-icon'>shopping_basket</Icon>
          <span>{{date_format(v.date)}}</span>
          <span class='mdl-list__item-text-body'>
            <div>{{ list_item(v.items) }}</div>
            <div v-if=v.buyer >{{ v.buyer.id }}</div>
          </span>
        </span>
        <span class='mdl-list__item-secondary-content'>
          <router-link class='mdl-list__item-secondary-action' target='_blank' :to='{name: "detail", params: { id }}'><Icon>open_in_new</Icon></router-link>
        </span>
      </li>
    </ul>
    </main>
  </div>
</template>

<script>
import path from 'path'

const store = firebase.firestore()
let collection

export default {
  data: function () { return { user: this.$store.state.user, config: this.$store.state.config, sales: [], buyers: this.$store.state.buyers, count: 10, buyer: '' } },
  created: function () {
    collection = store.collection(path.join('Zaiko', this.user.uid, 'sales'))
    let c = collection.orderBy('date', 'desc').limit(this.count)
    this.get(c)
  },
  methods: {
    get: function (c) {
      c.get().then((s) => {
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
.mdl-list {
  max-width: 600px;
  .mdl-list__item-text-body {
    overflow: hidden;
  }
}
.mdl-textfield {
  display: inline-flex;
}
</style>
