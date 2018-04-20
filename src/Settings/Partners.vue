
<template>
  <div id='wrapper'>
    <table class='mdl-data-table mdl-js-data-table mdl-shadow--2dp'>
      <thead>
        <tr>
          <th class='mdl-data-table__cell--non-numeric'>名前</th>
          <th class='mdl-data-table__cell--non-numeric'>住所</th>
          <th class='mdl-data-table__cell--non-numeric'>電話番号</th>
          <th class='mdl-data-table__cell--non-numeric'>担当者</th>
          <th class='mdl-data-table__cell--non-numeric'><CsvButton @read='read'></CsvButton></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for='i in items' @click='set_name(i.id)'>
          <td class='mdl-data-table__cell--non-numeric'>{{i.id}}</td>
          <td class='mdl-data-table__cell--non-numeric'>{{i.address}}</td>
          <td class='mdl-data-table__cell--non-numeric'>{{i.tel}}</td>
          <td class='mdl-data-table__cell--non-numeric'>{{i.incharge}}</td>
          <td class='mdl-data-table__cell--non-numeric'>
            <DeleteButton @delete='delete_item(i.id)' :id='i.id'></DeleteButton>
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
            <SubmitButton @click.native='submit'></SubmitButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import path from 'path'

import SubmitButton from '../SubmitButton.vue'
import DeleteButton from '../DeleteButton.vue'
import CsvButton from './CsvButton.vue'

export default {
  components: { SubmitButton, DeleteButton, CsvButton },
  data: function () { return { user: this.$store.state.user, items: this.$store.state[this.$route.name], name: '' } },
  watch: {
    '$route': function (to, from) {
      this.items = this.$store.state[to.name]
    }
  },
  mounted: function () {
    componentHandler.upgradeDom()
  },
  methods: {
    submit: function (e) {
      let self = this
      e.target.disabled = true
      setTimeout(function () {
        // data set
        if (self.name === '') {
          e.target.disabled = false
          document.getElementById('name').focus()
          return
        }
        let address = document.getElementById('address')
        let tel = document.getElementById('tel')
        let incharge = document.getElementById('incharge')
        let data = {}
        data.id = self.name
        data.address = address.value
        data.tel = tel.value
        data.incharge = incharge.value
        data.time = new Date()
        const store = firebase.firestore()
        let collect = store.collection(path.join('Zaiko', self.user.uid, self.$route.name))
        let ref = collect.doc(self.name)
        ref.set(data, {merge: true}).then(function () {
          self.clear_form()
          e.target.disabled = false
        }).catch(function (err) {
          console.error(err)
        })
      }, 200, e)
    },
    delete_item: function (name) {
      let collect = firebase.firestore().collection(path.join('Zaiko', this.user.uid, this.$route.name))
      collect.doc(name).delete()
    },
    clear_form: function () {
      this.name = '';
      ['id', 'address', 'tel', 'incharge'].forEach(function (s) {
        document.getElementById(s).parentNode.MaterialTextfield.change('')
      })
    },
    set_name: function (nameValue) {
      this.name = nameValue
      let name = document.getElementById('id')
      name.parentNode.MaterialTextfield.change(this.name)
      this.load_value()
      name.focus()
    },
    load_value: function () {
      let o = this.items[this.name]
      if (o) {
        ['address', 'tel', 'incharge'].forEach(function (s) {
          document.getElementById(s).parentNode.MaterialTextfield.change(o[s])
        })
      }
    },
    read: function (data) {
      let collect = firebase.firestore().collection(path.join('Zaiko', this.user.uid, this.$route.name))
      data.forEach(function (row) {
        let id, address, tel, incharge
        row.forEach(function (column, index) {
          switch (index) {
            case 0:
              id = column
              break
            case 1:
              address = column || ''
              break
            case 2:
              tel = column || ''
              break
            case 3:
              incharge = column || ''
              break
          }
        })
        collect.doc(id).set({id: id, address: address, tel: tel, incharge: incharge}, {merge: true})
      })
    }
  }
}
</script>

<style scoped lang='scss'>
@import '../index.scss';
#wrapper {
  overflow-x: auto;
  height: 100%;
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
