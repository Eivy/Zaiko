<script>
import path from 'path'
import DealBase from './DealBase.vue'
const store = firebase.firestore()

export default {
  mixins: [DealBase],
  data () { return {title: '販売'} },
  methods: {
    is_able_increment (id) {
      return this.items[id].count === 0 || (this.deal[this.items[id].id] ? this.deal[this.items[id].id].count >= this.items[id].count : false)
    },
    price (id) {
      return this.items[id].selling
    },
    count (id) {
      return this.deal[id] ? this.items[id].count - this.deal[id].count : this.items[id].count
    },
    increase_more: function (id) {
      if (this.config.count && this.config.count.use) {
        if (!this.deal[id]) {
          let data = Object.assign({}, this.items[id])
          data.count = 0
          Vue.set(this.deal, id, data)
        }
        if (this.items[id].count >= this.deal[id].count + this.config.count.count) {
          this.deal[id].count += this.config.count.count
        } else {
          this.deal[id].count = this.items[id].count
        }
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
    check: function () {
      for (let k in this.deal) {
        if (this.items[k].count < this.deal[k].count) {
          return k
        }
      }
    },
    is_valid_submit () {
      let check = this.check()
      if (check) {
        alert(check + 'の在庫が足りません')
        return false
      }
      return true
    },
    submit: function () {
      this.confirm = false
      let uid = this.$store.state.user.uid
      let sales = store.collection(path.join('Zaiko', uid, this.$route.name))
      let items = store.collection(path.join('Zaiko', uid, 'items'))
      for (let id in this.deal) {
        items.doc(id).get().then((d) => {
          let data = d.data()
          data.count -= this.deal[id].count
          items.doc(id).set(data)
          Vue.delete(this.deal, id)
        })
      }
      let data = {items: this.deal, date: new Date()}
      if (this.dealer !== '') {
        data.buyer = this.dealer
      }
      sales.add(data).then(d => {
        this.$router.push({path: this.$route.path + '/detail/' + d.id})
      })
    }
  },
  computed: {
    sum_price: function () {
      let sum = 0
      for (let id in this.deal) {
        sum += this.items[id].selling * this.deal[id].count
      }
      return this.format_price(sum)
    },
    use_dealer () {
      return this.config.buyer && this.config.buyer.use
    },
    dealers () {
      return this.buyers
    }
  }
}
</script>
