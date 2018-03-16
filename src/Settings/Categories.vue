<template>
  <div id='wrapper'>
    <table class='mdl-data-table mdl-js-data-table mdl-shadow--2dp'>
      <thead>
        <tr>
          <th class='mdl-data-table__cell--non-numeric'>カテゴリー</th>
          <th class='mdl-data-table__cell--non-numeric'></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for='c in categories'>
          <td class='mdl-data-table__cell--non-numeric'>{{c}}</td>
          <td class='mdl-data-table__cell--non-numeric'>
            <DeleteButton @click='delete_item(c)' :id='c'></DeleteButton>
          </td>
        </tr>
        <tr>
          <td class='mdl-data-table__cell--non-numeric'>
            <div class='mdl-textfield mdl-js-textfield'>
              <input id='category' v-model='name' class='mdl-textfield__input' type='text' required >
              <label class='mdl-textfield__label' for='category'>名前</label>
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

export default {
  components: { SubmitButton, DeleteButton },
  data: function () { return { categories: [], name: '' } },
  created: function () {
    let user = firebase.auth().currentUser
    let ref = firebase.firestore().collection(path.join('Zaiko', user.uid, 'categories'))
    ref.onSnapshot((s) => {
      this.categories.splice(0, this.categories.length)
      s.forEach((d) => {
        this.categories.push(d.id)
      })
    })
  },
  mounted: function () {
    componentHandler.upgradeDom()
  },
  methods: {
    submit: function (e) {
      e.target.disabled = true
      setTimeout(() => {
        let user = firebase.auth().currentUser
        // data set
        if (name.value === '') {
          e.target.disabled = false
          document.getElementById('name').focus()
          return
        }
        const store = firebase.firestore()
        let collect = store.collection(path.join('Zaiko', user.uid, 'categories'))
        let ref = collect.doc(this.name)
        ref.set({}).then(() => {
          this.clear_form()
          e.target.disabled = false
        }).catch((err) => {
          console.log(err)
        })
      }, 200, e)
    },
    delete_item: function (item) {
      let user = firebase.auth().currentUser
      let collect = firebase.firestore().collection(path.join('Zaiko', user.uid, 'categories'))
      firebase.storage().ref().child(path.join(user.uid, item)).delete()
      collect.doc(item).delete()
      this.clear_form()
    },
    clear_form: function () {
      this.name = ''
      document.getElementById('category').parentNode.MaterialTextfield.change('')
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
  #button {
    display: inline-block;
  }
}
</style>
