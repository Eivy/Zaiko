<script>
import DealBase from './DealBase.vue'

export default {
  mixins: [DealBase],
  data () { return {title: '在庫'} },
  methods: {
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
    }
  },
  computed: {
    sum_price () {
      let sum = 0
      for (let id in this.deal) {
        sum += this.items[id].purchase * this.deal[id].count
      }
      return sum
    }
  }
}
</script>
