<template>
  <div>
    <div>{{date}}</div>
    <div v-for='(v, k) in items'>
      {{v.id}} × {{v.count}} {{v.selling * v.count}}
    </div>
    <div v-if=buyer>{{buyer.id}}</div>
  </div>
</template>

<script>
import path from 'path'

export default {
  props: ['id'],
  data () { return { date: null, items: [], buyer: null } },
  created () {
    let doc = firebase.firestore().collection(path.join('Zaiko', this.$store.state.user.uid, 'sales')).doc(this.id)
    doc.get().then(d => {
      for (let k in d.data()) {
        Vue.set(this, k, d.data()[k])
      }
    })
  }
}
</script>
