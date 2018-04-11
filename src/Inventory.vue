<script>
import path from 'path'
import DealBase from './DealBase.vue'
const store = firebase.firestore()

export default {
  mixins: [DealBase],
  data () { return {title: '在庫'} },
  methods: {
    is_able_increment (id) {
      return false
    },
    count (id) {
      return this.items[id].count
    },
    increase_more: function (id) {
      if (this.config.count && this.config.count.use) {
        if (!this.deal[id]) {
          let data = Object.assign({}, this.items[id])
          data.count = 0
          Vue.set(this.deal, id, data)
        }
        this.deal[id].count += this.config.count.count
        if (this.deal[id].count === 0) {
          Vue.delete(this.deal, id)
        }
      }
    },
    increase: function (id) {
      if (!this.deal[id]) {
        let data = Object.assign({}, this.items[id])
        data.count = 0
        Vue.set(this.deal, id, data)
      }
      this.deal[id].count += 1
    },
    is_valid_submit () {
      if (this.sum_count === 0) {
        alert('仕入れる商品がありません')
        return false
      }
      return true
    },
    price (id) {
      return this.items[id].purchase
    },
    submit: function () {
      this.confirm = false
      let uid = this.$store.state.user.uid
      let sales = store.collection(path.join('Zaiko', uid, this.$route.name))
      let items = store.collection(path.join('Zaiko', uid, 'items'))
      for (let id in this.deal) {
        items.doc(id).get().then((d) => {
          let data = d.data()
          data.count += this.deal[id].count
          items.doc(id).set(data)
          Vue.delete(this.deal, id)
        })
      }
      let data = {items: this.deal, date: new Date()}
      if (this.dealer !== '') {
        data.seller = this.dealer
      }
      sales.add(data).then(d => {
        this.$router.push({path: this.$route.path + '/detail/' + d.id})
      })
    }
  },
  computed: {
    sum_price () {
      let sum = 0
      for (let id in this.deal) {
        sum += this.items[id].purchase * this.deal[id].count
      }
      return sum
    },
    use_dealer () {
      return true
    },
    dealers () {
      return this.sellers
    }
  }
}
</script>
