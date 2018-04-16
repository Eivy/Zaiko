<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <span @click='back()' class='mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect'><i class='material-icons'>arrow_back</i></span>
        <span class="mdl-layout-title">詳細</span>
      </div>
    </header>
    <main>
    <div id='detail'>
      <div>{{date}}</div>
      <div v-if=buyer>販売先: {{buyer.id}}</div>
      <div v-if=seller>仕入先: {{seller.id}}</div>
      <div class='mdl-list'>
        <div v-for='(v, k) in items' class="mdl-list__item mdl-list__item--two-line mdl-shadow--2dp">
          <span class='mdl-list__item-primary-content'>
            <div class='mdl-list__item-avatar' :style='{background: "url(" + v.image + ") center / cover"}'></div>
            <span class='mdl-list__item-title'>{{k}}</span>
            <span class='mdl-list__item-sub-title'>{{price(k)}}円</span>
          </span>
          <span class='mdl-list__item-secondary-action'>{{v.count}}個</span>
        </div>
      </div>
      <h5>合計: {{sum_price}}円</h5>
    </div>
    </main>
  </div>
</template>

<script>
import path from 'path'

export default {
  props: ['id'],
  data () { return { date: null, items: [], buyer: null, seller: null } },
  created () {
    let doc = firebase.firestore().collection(path.join('Zaiko', this.$store.state.user.uid, location.pathname.split('/')[1])).doc(this.id)
    doc.get().then(d => {
      for (let k in d.data()) {
        Vue.set(this, k, d.data()[k])
      }
    })
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    price (k) {
      if (location.pathname.split('/')[1] === 'sales') {
        return this.items[k].selling
      } else {
        return this.items[k].purchase
      }
    }
  },
  computed: {
    sum_price () {
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
.mdl-layout__header-row {
  padding-left: 0;
}
.mdl-button--fab {
  color: white;
  margin: 0 2rem 0 0;
}
#detail {
  margin: 2rem;
}
</style>
