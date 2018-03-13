
<template>
  <div id='wrapper'>
    <table class='mdl-data-table mdl-js-data-table mdl-data-table--selectable  mdl-shadow--2dp'>
      <thead>
        <tr>
          <th class='mdl-data-table__cell--non-numeric'>名前</th>
          <th class='mdl-data-table__cell--non-numeric'>住所</th>
          <th class='mdl-data-table__cell--non-numeric'>電話番号</th>
          <th class='mdl-data-table__cell--non-numeric'>担当者</th>
          <th class='mdl-data-table__cell--non-numeric'></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for='i in items' @click='set_name(i.name)'>
          <td class='mdl-data-table__cell--non-numeric'>{{i.id}}</td>
          <td class='mdl-data-table__cell--non-numeric'>{{i.address}}</td>
          <td class='mdl-data-table__cell--non-numeric'>{{i.phone}}</td>
          <td class='mdl-data-table__cell--non-numeric'>{{i.incharge}}</td>
          <td class='mdl-data-table__cell--non-numeric'>
            <button class='mdl-button mdl-js-button mdl-button--raised mdl-button--accent' @click.stop='delete_item(i.id)'>削除</button>
          </td>
        </tr>
        <tr>
          <td class='mdl-data-table__cell--non-numeric'>
            <div class='mdl-textfield mdl-js-textfield'>
              <input id='id' v-model='name' class='mdl-textfield__input' type='text' required @change='load_value()'>
              <label class='mdl-textfield__label' for='id'>名前</label>
              <label class='mdl-textfield__error' for='id'>必須です</label>
            </div>
          </td>
          <td class='mdl-data-table__cell--non-numeric'>
            <div class='mdl-textfield mdl-js-textfield'>
              <input id='address' class='mdl-textfield__input' type='text'>
              <label class='mdl-textfield__label' for='address'>住所</label>
            </div>
          </td>
          <td class='mdl-data-table__cell--non-numeric'>
            <div class='mdl-textfield mdl-js-textfield'>
              <input id='tel' class='mdl-textfield__input' type='tel'>
              <label class='mdl-textfield__label' for='tel'>電話番号</label>
            </div>
          </td>
          <td class='mdl-data-table__cell--non-numeric'>
            <div class='mdl-textfield mdl-js-textfield'>
              <input id='incharge' class='mdl-textfield__input' type='text'>
              <label class='mdl-textfield__label' for='incharge'>担当者</label>
            </div>
          </td>
          <td class='mdl-data-table__cell--non-numeric'>
            <button class='mdl-button mdl-js-button mdl-button--raised mdl-button--colored' @click='submit'>登録</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import path from 'path'
let snapshot
export default {
  data: function () { return { items: [], name: '' } },
  created: function () {
    this.update(this.$route)
  },
  watch: {
    '$route': function (from, to) {
      snapshot()
      this.update(to)
    }
  },
  mounted: function () {
    componentHandler.upgradeDom()
  },
  methods: {
    update: function () {
      let user = firebase.auth().currentUser
      let ref = firebase.firestore().collection(path.join('Zaiko', user.uid, this.$route.name))
      snapshot = ref.onSnapshot((s) => {
        this.items.splice(0, this.items.length)
        s.forEach((d) => {
          this.items.push(d.data())
        })
      })
    },
    submit: function (e) {
      e.target.disabled = true
      setTimeout(() => {
        let user = firebase.auth().currentUser
        // data set
        if (this.name === '') {
          e.target.disabled = false
          document.getElementById('name').focus()
          return
        }
        let address = document.getElementById('address')
        let tel = document.getElementById('tel')
        let incharge = document.getElementById('incharge')
        let data = {}
        data.id = this.name
        data.address = address.value
        data.tel = tel.value
        data.incharge = incharge.value
        data.time = new Date()
        const store = firebase.firestore()
        let collect = store.collection(path.join('Zaiko', user.uid, this.$route.name))
        let ref = collect.doc(this.name)
        ref.set(data, {merge: true}).then(() => {
          this.clear_form()
          e.target.disabled = false
        }).catch((err) => {
          console.log(err)
        })
      }, 200, e)
    },
    delete_item: function (name) {
      let user = firebase.auth().currentUser
      let collect = firebase.firestore().collection(path.join('Zaiko', user.uid, this.$route.name))
      collect.doc(name).delete()
    },
    clear_form: function () {
      this.name = ''
      document.getElementById('id').parentNode.MaterialTextfield.change('')
      document.getElementById('address').parentNode.MaterialTextfield.change('')
      document.getElementById('tel').parentNode.MaterialTextfield.change('')
      document.getElementById('incharge').parentNode.MaterialTextfield.change('')
    },
    set_name: function (nameValue) {
      this.name = nameValue
      let name = document.getElementById('id')
      name.parentNode.MaterialTextfield.change(this.name)
      this.load_value()
      name.focus()
    },
    load_value: function () {
      let i
      for (i = 0; i < this.items.length; i++) {
        if (this.items[i].name === this.name) {
          break
        }
      }
      let o = this.items[i]
      if (o) {
        document.getElementById('address').parentNode.MaterialTextfield.change(o.price)
        document.getElementById('tel').parentNode.MaterialTextfield.change(o.count)
        document.getElementById('incharge').parentNode.MaterialTextfield.change(o.seller)
      } else {
        document.getElementById('address').parentNode.MaterialTextfield.change('')
        document.getElementById('tel').parentNode.MaterialTextfield.change('')
        document.getElementById('incharge').parentNode.MaterialTextfield.change('')
      }
    }
  }
}
</script>

<style scoped lang='scss'>
#wrapper {
  overflow-x: auto;
}
table {
  width: 100%;
  .item_image {
    max-height: 100%;
  }
  .mdl-textfield {
    width: auto;
    min-width: 50px;
  }
}
</style>
