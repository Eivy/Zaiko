<template>
  <div>
    <div class='mdl-layout mdl-js-layout'>
      <div id='submit' class='mdl-card mdl-shadow--2dp'>
        <div class='mdl-card__supporting-text'>
          <form>
            <div class='mdl-textfield mdl-js-textfield'>
              <input id='name' class='mdl-textfield__input' type='text'>
              <label class='mdl-textfield__label' for='name'>名前</label>
            </div>
            <div class='mdl-textfield mdl-js-textfield'>
              <input id='price' class='mdl-textfield__input' type='number'>
              <label class='mdl-textfield__label' for='price'>値段</label>
            </div>
            <div class='mdl-textfield mdl-js-textfield'>
              <input id='count' class='mdl-textfield__input' type='number'>
              <label class='mdl-textfield__label' for='count'>個数</label>
            </div>
            <div class='mdl-textfield mdl-js-textfield'>
              <select id='saller' class='mdl-textfield__input' name=''>
                <option value='' v-for=''></option>
              </select>
              <label class='mdl-textfield__label' for='saller'>仕入先</label>
            </div>
            <label id='preview' class='mdl-button mdl-js-button mdl-button--fab' for='image'>
              <i class='material-icons'>add_a_photo</i>
              <input id='image' class='mdl-textfield__input' type='file' accept='image/*' @change='preview_image'>
            </label>
          </form>
        </div>
        <div class='mdl-card__actions'>
          <button class='mdl-button mdl-js-button mdl-button--raised mdl-button--colored' @click='submit'>登録</button>
        </div>
      </div>
    </div>
    <div>
      <table class='mdl-data-table mdl-js-data-table mdl-data-table--selectable  mdl-shadow--2dp'>
        <thead>
          <tr>
            <th class='mdl-data-table__cell--non-numeric'></th>
            <th class='mdl-data-table__cell--non-numeric'>名前</th>
            <th>値段</th>
            <th>在庫数</th>
            <th class='mdl-data-table__cell--non-numeric'>仕入先</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='i in [1,2,3]'>
            <td class='mdl-data-table__cell--non-numeric'><img src=''></img></td>
            <td class='mdl-data-table__cell--non-numeric'>{{i}}</td>
            <td>{{i}}</td>
            <td>{{i}}</td>
            <td class='mdl-data-table__cell--non-numeric'></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import path from 'path'
export default {
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
        console.log(user.uid)
        let file = document.getElementById('image').files[0]
        if (file) {
          let r = firebase.storage().ref()
          let fileRef = r.child(path.join(user.uid, file.name))
          fileRef.put(file).then(snapshot => {
            e.target.disabled = false
          }).catch(err => {
            alert(err)
          })
        } else {
          e.target.disabled = false
        }
      }, 200, e)
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
}
table {
  width: 100%;
}
</style>
