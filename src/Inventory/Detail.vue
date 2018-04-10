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
      <div v-for='(v, k) in items'>
        {{v.id}} × {{v.count}} {{v.selling * v.count}}
      </div>
      <div v-if=buyer>{{seller.id}}</div>
    </div>
    </main>
  </div>
</template>

<script>
import path from 'path'

export default {
  props: ['id'],
  data () { return { date: null, items: [], buyer: null } },
  created () {
    let doc = firebase.firestore().collection(path.join('Zaiko', this.$store.state.user.uid, 'inventory')).doc(this.id)
    doc.get().then(d => {
      for (let k in d.data()) {
        Vue.set(this, k, d.data()[k])
      }
    })
  },
  methods: {
    back () {
      this.$router.go(-1)
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
