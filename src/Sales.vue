<script>
import DealBase from './DealBase.vue'

export default {
  mixins: [DealBase],
  data () { return {title: '販売'} },
  methods: {
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
      if (this.sum_count === 0) {
        alert('販売する商品がありません')
        return false
      }
      let check = this.check()
      if (check) {
        alert(check + 'の在庫が足りません')
        return false
      }
      return true
    }
  },
  computed: {
    sum_price: function () {
      let sum = 0
      for (let id in this.deal) {
        sum += this.items[id].selling * this.deal[id].count
      }
      return sum
    }
  }
}
</script>
