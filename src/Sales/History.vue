<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">販売履歴</span>
      </div>
    </header>
    <main>
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
let snapshot

export default {
  data: function () { return {sales: []} },
  created: function () {
    let user = firebase.auth().currentUser
    let c = store.collection(path.join('Zaiko', user.uid, 'sales')).orderBy('date', 'desc')
    snapshot = c.onSnapshot((s) => {
      this.sales.splice(0, this.sales.length)
      s.forEach((d) => {
        let data = d.data()
        data.id = d.id
        this.sales.push(data)
      })
      console.log(this.sales)
    })
  },
  destroy: function () {
    snapshot()
  },
  methods: {
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
</style>
