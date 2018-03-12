<template>
  <div>
    <div class='mdl-layout mdl-js-layout'>
      <div id='submit' class='mdl-card mdl-shadow--2dp'>
        <div class='mdl-card__supporting-text'>
          <form id='form'>
            <div class='mdl-textfield mdl-js-textfield'>
              <input id='category' v-model='name' class='mdl-textfield__input' type='text' required >
              <label class='mdl-textfield__label' for='category'>名前</label>
              <label class='mdl-textfield__error' for='category'>必須です</label>
            </div>
          </form>
        </div>
        <div class='mdl-card__actions'>
          <button class='mdl-button mdl-js-button mdl-button--raised mdl-button--colored' @click='submit'>登録</button>
          <button v-if='has_item(name)' class='mdl-button mdl-js-button mdl-button--raised mdl-button--accent' @click='delete_item'>削除</button>
        </div>
      </div>
    </div>
    <div>
      <table class='mdl-data-table mdl-js-data-table mdl-data-table--selectable  mdl-shadow--2dp'>
        <thead>
          <tr>
            <th class='mdl-data-table__cell--non-numeric'>カテゴリー</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='c in categories' @click='set(c)'>
            <td class='mdl-data-table__cell--non-numeric'>{{c}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import path from 'path'
export default {
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
    delete_item: function () {
      let user = firebase.auth().currentUser
      let collect = firebase.firestore().collection(path.join('Zaiko', user.uid, 'categories'))
      firebase.storage().ref().child(path.join(user.uid, this.name)).delete()
      collect.doc(this.name).delete()
      this.clear_form()
    },
    clear_form: function () {
      this.name = ''
      document.getElementById('category').parentNode.MaterialTextfield.change('')
    },
    has_item: function (item) {
      for (let i of this.categories) {
        if (i === item) {
          return true
        }
      }
      return false
    },
    set: function (category) {
      this.name = category
      document.getElementById('category').parentNode.MaterialTextfield.change(this.name)
    }
  }
}
</script>

<style scoped lang='scss'>
.mdl-layout {
  align-items: center;
  #submit {
    margin: 10px;
    width: 350px;
  }
}
table {
  width: 100%;
}
</style>
