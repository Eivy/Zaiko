<template>
  <div id='wrapper'>
    <table class='mdl-data-table mdl-js-data-table mdl-shadow--2dp'>
      <thead>
        <tr>
          <th class='mdl-data-table__cell--non-numeric'></th>
          <th class='mdl-data-table__cell--non-numeric'>名前</th>
          <th>販売価格</th>
          <th>仕入価格</th>
          <th>在庫数</th>
          <th class='mdl-data-table__cell--non-numeric'>仕入先</th>
          <th class='mdl-data-table__cell--non-numeric'>カテゴリ</th>
          <th class='mdl-data-table__cell--non-numeric'><CsvButton @read='read'></CsvButton></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for='i in items' @click='set_name(i.id)'>
          <td class='mdl-data-table__cell--non-numeric'><img class='item_image' :src='i.image'></img></td>
          <td class='mdl-data-table__cell--non-numeric'>{{i.id}}</td>
          <td>{{i.selling}}</td>
          <td>{{i.purchase}}</td>
          <td>{{i.count}}</td>
          <td class='mdl-data-table__cell--non-numeric'>{{i.seller}}</td>
          <td class='mdl-data-table__cell--non-numeric'>{{i.categories ? i.categories.join(',') : ''}}</td>
          <td class='mdl-data-table__cell--non-numeric'>
            <DeleteButton @delete='delete_item(i.id)' :id='i.id'></DeleteButton>
          </td>
        </tr>
        <tr>
          <td class='mdl-data-table__cell--non-numeric'>
            <label id='preview' class='mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab' for='image'>
              <Icon>add_a_photo</Icon>
              <input id='image' class='mdl-textfield__input' type='file' accept='image/*' @change='preview_image'>
            </label>
          </td>
          <td class='mdl-data-table__cell--non-numeric'>
            <div class='mdl-textfield mdl-js-textfield'>
              <input id='id' v-model='id' class='mdl-textfield__input' type='text' required @change='load_value()'>
              <label class='mdl-textfield__label' for='id'>名前</label>
              <label class='mdl-textfield__error' for='id'>必須です</label>
            </div>
          </td>
          <td>
            <div id='field_selling' class='mdl-textfield mdl-js-textfield'>
              <input id='selling' class='mdl-textfield__input' type='number'>
              <label class='mdl-textfield__label' for='selling'>販売価格</label>
            </div>
          </td>
          <td>
            <div id='field_purchase' class='mdl-textfield mdl-js-textfield'>
              <input id='purchase' class='mdl-textfield__input' type='number'>
              <label class='mdl-textfield__label' for='purchase'>仕入価格</label>
            </div>
          </td>
          <td>
            <div id='field_count' class='mdl-textfield mdl-js-textfield'>
              <input id='count' class='mdl-textfield__input' type='number'>
              <label class='mdl-textfield__label' for='count'>個数</label>
            </div>
          </td>
          <td class='mdl-data-table__cell--non-numeric'>
            <div class='mdl-textfield mdl-js-textfield'>
              <select id='seller' class='mdl-textfield__input'>
                <option value=''></option>
                <option v-for='(v, k) in sellers' :value='k'>{{k}}</option>
              </select>
              <label class='mdl-textfield__label' for='seller'>仕入先</label>
            </div>
          </td>
          <td class='mdl-data-table__cell--non-numeric'>
            <div class='mdl-textfield mdl-js-textfield mdl-select'>
              <input class='mdl-textfield__input' type='text' id='categories' v-model='input.categories' readonly></input>
              <label class='mdl-textfield__label' for='categories'>カテゴリー</label>
              <ul class='mdl-menu mdl-menu--top-right mdl-js-menu mdl-js-ripple-effect' for='categories'>
                <li v-for='c in categories' class='mdl-menu__item'>
                  <label class='mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect' :for=c >
                    <input :id=c type='checkbox' v-model='input.categories' :value='c' class='mdl-checkbox__input'>
                    <span class='mdl-checkbox__label'>{{c}}</span>
                  </label>
                </li>
              </ul>
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
  components: {SubmitButton, DeleteButton, CsvButton},
  data: function () { return Object.assign({ id: '', input: { categories: [] } }, this.$store.state) },
  mounted: function () {
    componentHandler.upgradeDom()
  },
  methods: {
    preview_image: function (e) {
      let f = e.target.files[0]
      let r = new FileReader()
      r.onload = (e) => {
        document.getElementById('preview').style.backgroundImage = 'url(' + r.result + ')'
      }
      r.readAsDataURL(f)
    },
    submit: function (e) {
      e.target.disabled = true
      setTimeout(() => {
        // data set
        if (this.id === '') {
          e.target.disabled = false
          document.getElementById('id').focus()
          return
        }
        let selling = document.getElementById('selling').value
        let purchase = document.getElementById('purchase').value
        let count = document.getElementById('count').value
        let seller = document.getElementById('seller').value
        let data = {
          id: this.id,
          selling: Number(selling),
          purchase: Number(purchase),
          count: Number(count),
          seller,
          categories: this.input.categories,
          time: new Date()
        }
        const store = firebase.firestore()
        let collect = store.collection(path.join('Zaiko', this.user.uid, 'items'))
        let ref = collect.doc(this.id)
        ref.set(data, {merge: true}).then(() => {
          this.clear_form()
        }).catch((err) => {
          console.log(err)
        })
        // file upload
        let file = document.getElementById('image').files[0]
        if (file) {
          let r = firebase.storage().ref()
          let fileRef = r.child(path.join(this.user.uid, this.id))
          fileRef.put(file).then(snapshot => {
            ref.set({image: snapshot.metadata.downloadURLs[0]}, {merge: true})
            document.getElementById('preview').style.backgroundImage = ''
            e.target.disabled = false
          }).catch(err => {
            console.log(err)
          })
        } else {
          e.target.disabled = false
        }
      }, 200, e)
    },
    delete_item: function (id) {
      let collect = firebase.firestore().collection(path.join('Zaiko', this.user.uid, 'items'))
      firebase.storage().ref().child(path.join(this.user.uid, id)).delete().catch((err) => {
        if (err.t !== 'storage/object-not-found') {
          console.log(err)
        }
      })
      collect.doc(id).delete()
    },
    clear_form: function () {
      this.id = ''
      this.input.categories = [];
      ['id', 'selling', 'purchase', 'count', 'seller'].forEach((s) => {
        document.getElementById(s).parentNode.MaterialTextfield.change('')
      })
      document.getElementById('image').value = null
      document.getElementById('preview').style.backgroundImage = ''
    },
    set_name: function (nameValue) {
      this.id = nameValue
      let id = document.getElementById('id')
      id.parentNode.MaterialTextfield.change(this.id)
      this.load_value()
      id.focus()
    },
    load_value: function () {
      let o = this.items[this.id]
      if (o) {
        ['selling', 'purchase', 'count', 'seller'].forEach((s) => {
          document.getElementById(s).parentNode.MaterialTextfield.change(o[s])
        })
        this.input.categories = o.categories
        document.getElementById('preview').style.backgroundImage = 'url(' + o.image + ')'
      }
    },
    read: function (data) {
      let collect = firebase.firestore().collection(path.join('Zaiko', this.user.uid, 'items'))
      data.forEach((row, index) => {
        let id, selling, purchase, count, seller
        row.forEach((column, index) => {
          switch (index) {
            case 0:
              if (column === '') {
                return
              }
              id = column
              break
            case 1:
              selling = Number(column)
              break
            case 2:
              purchase = Number(column)
              break
            case 3:
              count = Number(column)
              break
            case 4:
              seller = column
              break
          }
        })
        let newData = {id, selling, purchase, count, seller, time: new Date()}
        collect.doc(id).set(newData, {merge: true}).then(() => {
          console.log('success')
        }).catch((e) => {
          console.log(e)
        })
        console.log('hoge')
      })
    }
  }
}
</script>

<style scoped lang='scss'>
@import '../index.scss';
#wrapper {
  height: 100%;
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
  #field_selling, #field_purchase {
    width: 70px;
    input {
      text-align: right;
    }
  }
  #field_count {
    width: 50px;
    #count {
      text-align: right;
    }
  }
  #preview {
    background-size: contain;
    top: 0;
    bottom: 0;
    right: 0;
  }
  #image {
    display: none;
  }
}
</style>
