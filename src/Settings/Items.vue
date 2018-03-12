<template>
  <div id='wrapper'>
    <table class='mdl-data-table mdl-js-data-table mdl-data-table--selectable  mdl-shadow--2dp'>
      <thead>
        <tr>
          <th class='mdl-data-table__cell--non-numeric'></th>
          <th class='mdl-data-table__cell--non-numeric'>名前</th>
          <th>値段</th>
          <th>在庫数</th>
          <th class='mdl-data-table__cell--non-numeric'>仕入先</th>
          <th class='mdl-data-table__cell--non-numeric'></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for='i in items' @click='set_name(i.name)'>
          <td class='mdl-data-table__cell--non-numeric'><img class='item_image' :src='i.image'></img></td>
          <td class='mdl-data-table__cell--non-numeric'>{{i.name}}</td>
          <td>{{i.price}}</td>
          <td>{{i.count}}</td>
          <td class='mdl-data-table__cell--non-numeric'>{{i.seller}}</td>
          <td class='mdl-data-table__cell--non-numeric'>
            <button class='mdl-button mdl-js-button mdl-button--raised mdl-button--accent' @click.stop='delete_item(i.name)'>削除</button>
          </td>
        </tr>
        <tr>
          <td class='mdl-data-table__cell--non-numeric'>
            <label id='preview' class='mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab' for='image'>
              <i class='material-icons'>add_a_photo</i>
              <input id='image' class='mdl-textfield__input' type='file' accept='image/*' @change='preview_image'>
            </label>
          </td>
          <td class='mdl-data-table__cell--non-numeric'>
            <div class='mdl-textfield mdl-js-textfield'>
              <input id='name' v-model='name' class='mdl-textfield__input' type='text' required @change='load_value()'>
              <label class='mdl-textfield__label' for='name'>名前</label>
              <label class='mdl-textfield__error' for='name'>必須です</label>
            </div>
          </td>
          <td>
            <div id='field_price' class='mdl-textfield mdl-js-textfield'>
              <input id='price' class='mdl-textfield__input' type='number'>
              <label class='mdl-textfield__label' for='price'>値段</label>
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
              <select id='seller' class='mdl-textfield__input' name=''>
                <option value=''></option>
                <option v-for='v in sellers' :value='v'>{{v}}</option>
              </select>
              <label class='mdl-textfield__label' for='seller'>仕入先</label>
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
export default {
  data: function () { return { items: [], sellers: [], name: '' } },
  created: function () {
    let user = firebase.auth().currentUser
    let ref = firebase.firestore().collection(path.join('Zaiko', user.uid, 'items'))
    ref.onSnapshot((s) => {
      this.items.splice(0, this.items.length)
      s.forEach((d) => {
        this.items.push(d.data())
      })
    })
    ref = firebase.firestore().collection(path.join('Zaiko', user.uid, 'sellers'))
    ref.onSnapshot((s) => {
      this.sellers.splice(0, this.sellers.length)
      s.forEach((d) => {
        this.sellers.push(d.id)
      })
    })
  },
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
        let user = firebase.auth().currentUser
        // data set
        if (this.name === '') {
          e.target.disabled = false
          document.getElementById('name').focus()
          return
        }
        let price = document.getElementById('price')
        let count = document.getElementById('count')
        let seller = document.getElementById('seller')
        let data = {}
        data.name = this.name
        data.price = Number(price.value)
        data.count = Number(count.value)
        data.seller = seller.value
        data.time = new Date()
        const store = firebase.firestore()
        let collect = store.collection(path.join('Zaiko', user.uid, 'items'))
        let ref = collect.doc(this.name)
        ref.set(data, {merge: true}).then(() => {
          this.clear_form()
        }).catch((err) => {
          console.log(err)
        })
        // file upload
        let file = document.getElementById('image').files[0]
        if (file) {
          let r = firebase.storage().ref()
          let fileRef = r.child(path.join(user.uid, this.name))
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
    delete_item: function (name) {
      let user = firebase.auth().currentUser
      let collect = firebase.firestore().collection(path.join('Zaiko', user.uid, 'items'))
      firebase.storage().ref().child(path.join(user.uid, name)).delete().catch((err) => {
        if (err.t !== 'storage/object-not-found') {
          console.log(err)
        }
      })
      collect.doc(name).delete()
    },
    clear_form: function () {
      this.name = ''
      document.getElementById('name').parentNode.MaterialTextfield.change('')
      document.getElementById('price').parentNode.MaterialTextfield.change('')
      document.getElementById('count').parentNode.MaterialTextfield.change('')
      document.getElementById('seller').parentNode.MaterialTextfield.change('')
      document.getElementById('image').value = null
      document.getElementById('preview').style.backgroundImage = ''
    },
    set_name: function (nameValue) {
      this.name = nameValue
      let name = document.getElementById('name')
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
        document.getElementById('price').parentNode.MaterialTextfield.change(o.price)
        document.getElementById('count').parentNode.MaterialTextfield.change(o.count)
        document.getElementById('seller').parentNode.MaterialTextfield.change(o.seller)
        document.getElementById('preview').style.backgroundImage = 'url(' + o.image + ')'
      } else {
        document.getElementById('price').parentNode.MaterialTextfield.change('')
        document.getElementById('count').parentNode.MaterialTextfield.change('')
        document.getElementById('seller').parentNode.MaterialTextfield.change('')
        document.getElementById('preview').style.backgroundImage = ''
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
  #field_price, #field_count {
    width: 50px;
    #price, #count {
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
