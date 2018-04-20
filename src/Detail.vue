<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">詳細</span>
      </div>
    </header>
    <main>
    <div id='detail'>
      <h3>{{format_date(date)}}</h3>
      <div v-if=buyer>販売先: {{buyer.id}}</div>
      <div v-if=seller>仕入先: {{seller.id}}</div>
      <div class='mdl-list'>
        <div v-for='(v, k) in items' class="mdl-list__item mdl-list__item--two-line mdl-shadow--2dp">
          <span class='mdl-list__item-primary-content'>
            <div class='mdl-list__item-avatar' :style='{background: "url(" + v.image + ") center / cover"}'></div>
            <span class='mdl-list__item-title'>{{k}}</span>
            <span class='mdl-list__item-sub-title'>{{format_price(price(k))}}円</span>
          </span>
          <span class='mdl-list__item-secondary-action'>{{v.count}}個</span>
        </div>
      </div>
      <h5>合計: {{format_price(sum_price)}}円</h5>
    </div>
    <span @click='back()' class='mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect'><i class='material-icons'>arrow_back</i></span>
    </main>
  </div>
</template>

<script>
import path from 'path'

export default {
  props: ['id'],
  data: function () { return { date: null, items: [], buyer: null, seller: null } },
  created: function () {
    let doc = firebase.firestore().collection(path.join('Zaiko', this.$store.state.user.uid, location.pathname.split('/')[1])).doc(this.id)
    doc.get().then(function (d) {
      for (let k in d.data()) {
        Vue.set(this, k, d.data()[k])
      }
    })
  },
  methods: {
    back: function () {
      this.$router.go(-1)
    },
    price: function (k) {
      if (location.pathname.split('/')[1] === 'sales') {
        return this.items[k].selling
      } else {
        return this.items[k].purchase
      }
    }
  },
  computed: {
    sum_price: function () {
      let sum = 0
      for (let id in this.items) {
        sum += (location.pathname.split('/')[1] === 'sales' ? this.items[id].selling : this.items[id].purchase) * this.items[id].count
      }
      return sum
    }
  }
}
</script>

<style scoped lang='scss'>
#detail {
  margin: 2rem;
  .mdl-list__item-avatar {
    border-radius: 0;
  }
}
</style>
