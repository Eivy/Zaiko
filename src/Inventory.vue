<script>
import path from 'path'
import objectAssign from 'object-assign'
import DealBase from './DealBase.vue'
const store = firebase.firestore()

export default {
  mixins: [DealBase],
  data: function () { return {title: '在庫'} },
  methods: {
    is_able_increment: function (id) {
      return false
    },
    count: function (id) {
      return this.items[id].count
    },
    increase_more: function (id) {
      if (this.config.count && this.config.count.use) {
        if (!this.deal[id]) {
          let data = objectAssign({}, this.items[id])
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
        let data = objectAssign({}, this.items[id])
        data.count = 0
        Vue.set(this.deal, id, data)
      }
      this.deal[id].count += 1
    },
    is_valid_submit: function () {
      return true
    },
    price: function (id) {
      return this.items[id].purchase
    },
    submit: function () {
      this.confirm = false
      let uid = this.$store.state.user.uid
      let sales = store.collection(path.join('Zaiko', uid, this.$route.name))
      let items = store.collection(path.join('Zaiko', uid, 'items'))
      for (let id in this.deal) {
        items.doc(id).get().then(function (d) {
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
      sales.add(data).then(function (d) {
        this.$router.push({path: this.$route.path + '/detail/' + d.id})
      })
    }
  },
  computed: {
    sum_price: function () {
      let sum = 0
      for (let id in this.deal) {
        sum += this.items[id].purchase * this.deal[id].count
      }
      return this.format_price(sum)
    },
    use_dealer: function () {
      return true
    },
    dealers: function () {
      return this.sellers
    },
    filterd_items: function () {
      if (this.dealer === '' && this.filter === '' && this.filter_category.length === 0) {
        return this.items
      }
      let r = objectAssign({}, this.items)
      if (this.dealer.id.length > 0) {
        for (let k in r) {
          if (r[k].seller !== '' && r[k].seller !== this.dealer.id) {
            delete r[k]
          }
        }
      }
      if (this.filter_category.length > 0) {
        for (let k in r) {
          if (r[k].categories) {
            let isInclude = true
            for (let c in this.filter_category) {
              isInclude = isInclude && (r[k].categories.indexOf(this.filter_category[c]) >= 0)
            }
            if (!isInclude) {
              delete r[k]
            }
          }
        }
      }
      let re = new RegExp('.*(' + this.filter.replace(/([[\]\\{}.?*+^$])/, '\\$1').split(new RegExp('[ 　]+')).join('|') + ').*')
      for (let k in r) {
        if (!k.match(re)) {
          delete r[k]
        }
      }
      return r
    }
  }
}
</script>
