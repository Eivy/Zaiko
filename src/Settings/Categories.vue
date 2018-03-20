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
            <DeleteButton @delete='delete_item(c)' :id='c'></DeleteButton>
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
  data: function () { return { user: this.$store.state.user, categories: this.$store.state.categories, name: '' } },
  mounted: function () {
    componentHandler.upgradeDom()
  },
  methods: {
    submit: function (e) {
      e.target.disabled = true
      setTimeout(() => {
        // data set
        if (name.value === '') {
          e.target.disabled = false
          document.getElementById('name').focus()
          return
        }
        const store = firebase.firestore()
        let collect = store.collection(path.join('Zaiko', this.user.uid, 'categories'))
        let ref = collect.doc(this.name)
        ref.set({}).then(() => {
          this.clear_form()
          e.target.disabled = false
        }).catch((err) => {
          console.error(err)
        })
      }, 200, e)
    },
    delete_item: function (item) {
      let collect = firebase.firestore().collection(path.join('Zaiko', this.user.uid, 'categories'))
      firebase.storage().ref().child(path.join(this.user.uid, item)).delete()
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
@import '../index.scss';
#wrapper {
  overflow-x: auto;
  height: 100%;
}
table {
  width: 100%;
  #button {
    display: inline-block;
  }
}
</style>
