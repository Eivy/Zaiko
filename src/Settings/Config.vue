<template>
  <div>
    <div id='color' class='mdl-card mdl-js-card mdl-shadow--2dp'>
      <div class='mdl-card__title'>ユーザーID</div>
      <div class='mdl-card__supporting-text'><span>{{user.uid}}</span><Icon @click.native='copy' style='padding-left: 1rem'>content_copy</Icon></div>
    </div>
    <div id='color' class='mdl-card mdl-js-card mdl-shadow--2dp'>
      <div class='mdl-card__title'>配色</div>
      <div class='mdl-card__actions'>
        <div>ベース
          <div class='mdl-textfield mdl-js-textfield'>
            <select class='mdl-textfield__input' v-model='color.primary' @change='change("color")' id='color-primary' name='color-primary'>
              <option v-for='(v, k) in primary' :value=k >{{v}}</option>
            </select>
          </div>
        </div>
        <div>アクセント
          <div class='mdl-textfield mdl-js-textfield'>
            <select class='mdl-textfield__input' v-model='color.accent' @change='change("color")' id='color-accent' name='color-accent'>
              <option v-for='(v, k) in accent' :value=k >{{v}}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div id='count' class='mdl-card mdl-js-card mdl-shadow--2dp'>
      <div class='mdl-card__title'>販売数量</div>
      <div class='mdl-card__supporting-text'>
        商品の<Icon>add</Icon>ボタンの代わりに画像部分をクリックすると数量で指定した数を増やせるようになります。<br />
        減らす場合は商品名の部分をクリックします。
      </div>
      <div class='mdl-card__actions'>
        <div>
          <div class='mdl-textfield mdl-js-textfield'>
            <label class='mdl-switch mdl-js-switch mdl-js-ripple-effect' for='use_count'>
              <input @change='change("count")' v-model='count.use' type='checkbox' id='use_count' class='mdl-switch__input'>
              <span class='mdl-switch__label'>大量販売をする</span>
            </label>
          </div>
        </div>
        <div>
          <div class='mdl-textfield mdl-js-textfield' :class='{"is-disabled": !count.use}'>
            <input @change='change("count")' v-model.number='count.count' :disabled='!count.use' class='mdl-textfield__input' type='number' pattern='-?[0-9]*(\.[0-9]+)?' id='count_num'>
            <label class='mdl-textfield__label' for='count_num'>数量</label>
            <span class='mdl-textfield__error'>数値を入力してください</span>
          </div>
        </div>
      </div>
    </div>
    <div id='buyer' class='mdl-card mdl-js-card mdl-shadow--2dp'>
      <div class='mdl-card__title'>販売先</div>
      <div class='mdl-card__actions'>
        <div class='mdl-textfield mdl-js-textfield'>
          <label class='mdl-switch mdl-js-switch mdl-js-ripple-effect' for='use_buyer'>
            <input @change='change("buyer")' v-model='buyer.use' type='checkbox' id='use_buyer' class='mdl-switch__input'>
            <span class='mdl-switch__label'>販売時に販売先を指定する</SPAN>
          </label>
        </div>
      </div>
    </div>
    <div id='data_share' class='mdl-card mdl-js-card mdl-shadow--2dp'>
      <div class='mdl-card__title'>他アカウントの許可</div>
      <div class='mdl-card__supporting-text'>
        <div>他のアカウントのユーザーIDを追加することで、そのアカウントからあなたのデータへアクセスできるようにします.<br/>ユーザーIDは設定画面の最上部に表示されます.</div>
        <div>
          <span>許可済みユーザー</span>
          <div class="mdl-list">
            <div v-for='(v, i) in permitted.users' class="mdl-list__item">
              <span class="mdl-list__item-primary-content">{{v}}</span>
              <DeleteButton :id='v' @delete='remove_permit(i)'></DeleteButton>
            </div>
          </div>
        </div>
        <div>あなたのデータへのリンク: <span>{{link}}</span><Icon @click.native='copy' style='padding-left: 1rem'>content_copy</Icon></div>
      </div>
      <div class='mdl-card__actions'>
        <div class='mdl-textfield mdl-js-textfield' :class='{"is-disabled": !count.use}'>
          <input @keyup.enter='permit_user()' class='mdl-textfield__input' type='text' id='permit_user'>
          <label class='mdl-textfield__label' for='permit_user'>ユーザーID</label>
        </div>
        <SubmitButton @click.native='permit_user()'></SubmitButton>
      </div>
    </div>
    <div id='delete_data' class='mdl-card mdl-js-card mdl-shadow--2dp'>
      <div class='mdl-card__title'>データ削除</div>
      <div class='mdl-card__supporting-text'>すべてのデータを削除します。削除したデータは元に戻せません。</div>
      <div class='mdl-card__actions'>
        <DeleteButton @delete='delete_data()' id='すべてのデータ' class='mdl-color--red-A700' ></DeleteButton>
      </div>
    </div>
    <div id='delete_user' class='mdl-card mdl-js-card mdl-shadow--2dp'>
      <div class='mdl-card__title'>ユーザー削除</div>
      <div class='mdl-card__supporting-text'>すべてのデータとユーザーを削除します。削除したデータは元に戻せません。</div>
      <div class='mdl-card__actions'>
        <DeleteButton @delete='delete_user()' id='すべてのデータ' class='mdl-color--red-A700' ></DeleteButton>
        <div id="auth"></div>
      </div>
    </div>
    <div id="copy_dialog" class="mdl-js-snackbar mdl-snackbar">
      <div class="mdl-snackbar__text"></div>
      <button class="mdl-snackbar__action" type="button"></button>
    </div>
  </div>
</template>

<script>
import path from 'path'

import DeleteButton from '../DeleteButton.vue'
import SubmitButton from '../SubmitButton.vue'

export default {
  components: { DeleteButton, SubmitButton },
  data: function () {
    return {
      user: this.$store.state.user,
      color: { primary: 'blue', accent: 'purple' },
      count: { use: false, count: 10 },
      buyer: { use: false },
      colors: {
        deep_orange: 'Deep Orange',
        red: 'Red',
        pink: 'Pink',
        purple: 'Purple',
        deep_purple: 'Deep Purple',
        indigo: 'Indigo',
        blue: 'Blue',
        light_blue: 'Light Blue',
        cyan: 'Cyan',
        teal: 'Teal',
        green: 'Green',
        light_green: 'Light Green',
        lime: 'Lime',
        yellow: 'Yellow',
        amber: 'Amber',
        orange: 'Orange',
        brown: 'Brown',
        blue_grey: 'Blue Grey',
        grey: 'Grey'
      },
      permitted: { users: [] }
    }
  },
  watch: {
    '$store.state.config': function () {
      this.check_config()
    }
  },
  mounted: function () {
    this.check_config()
    componentHandler.upgradeDom()
  },
  methods: {
    permit_user: function () {
      let user = document.querySelector('#permit_user')
      if (user === '') {
        return
      }
      this.permitted.users.push(user.value)
      user.value = ''
      this.change('permitted')
    },
    remove_permit: function (i) {
      this.permitted.users.splice(i, 1)
      this.change('permitted')
    },
    change: function (key) {
      firebase.firestore().collection(path.join('Zaiko', this.user.uid, 'config')).doc(key).set(this[key])
    },
    check_config: function () {
      for (let k in this.$store.state.config) {
        this[k] = this.$store.state.config[k]
      }
      setTimeout(function () {
        Array.prototype.slice.call(document.querySelectorAll('input[type="text"]', 0)).forEach(function (e) {
          e.parentNode.MaterialTextfield.checkDirty()
        })
        Array.prototype.slice.call(document.querySelectorAll('input[type="checkbox"]'), 0).forEach(function (e) {
          e.parentNode.MaterialSwitch.checkToggleState()
        })
      }, 100)
    },
    delete_data: function () {
      const store = firebase.firestore()
      store.collection(path.join('Zaiko', this.user.uid, 'items')).get().then(function (s) {
        s.forEach(function (d) {
          firebase.storage().ref(this.user.uid).child(d.id).delete().catch(function (err) { console.log(err) })
          firebase.storage().ref(this.user.uid).child('thumb_' + d.id).delete().catch(function (err) { console.log(err) })
        })
      })
      let keys = ['config', 'items', 'buyers', 'sellers', 'sales', 'inventory']

      for (let k in keys) {
        store.collection(path.join('Zaiko', this.user.uid, keys[k])).get().then(function (s) {
          s.forEach(function (d) {
            store.collection(path.join('Zaiko', this.user.uid, keys[k])).doc(d.id).delete().catch(function (err) {
              console.log(err)
            })
          })
        })
      }
    },
    delete_user: function () {
      this.delete_data()
      this.user.delete().then(function () {
        alert('ユーザーが削除されました')
        location.reload()
      }).catch(function (err) {
        if (err.code === 'auth/requires-recent-login') {
          alert('ユーザー削除の為に再認証が必要です.')
          const ui = new firebaseui.auth.AuthUI(firebase.auth())
          ui.start('#auth', {
            signInOptions: [
              this.user.providerId === 'firebase' ? firebase.auth.EmailAuthProvider.PROVIDER_ID : this.user.providerId
            ],
            tosUrl: ''
          })
        }
      })
    },
    copy: function (event) {
      document.getSelection().selectAllChildren(event.target.previousSibling)
      document.execCommand('copy')
      document.querySelector('#copy_dialog').MaterialSnackbar.showSnackbar({message: 'クリップボードにコピーしました'})
    }
  },
  computed: {
    primary: function () {
      let data = {}
      for (let k in this.colors) {
        if (k !== this.color.accent) {
          data[k] = this.colors[k]
        }
      }
      return data
    },
    accent: function () {
      let data = {}
      for (let k in this.colors) {
        if (k !== this.color.primary && k !== 'brown' && k !== 'blue_grey' && k !== 'grey') {
          data[k] = this.colors[k]
        }
      }
      return data
    },
    link: function () {
      return document.location.protocol + '//' + document.location.host + '/?userid=' + this.user.uid
    }
  }
}
</script>

<style scoped lang='scss'>
.mdl-card {
  width: 80%;
  margin: 2rem;
  min-height: initial;
}
.mdl-card#color {
  .mdl-card__actions>div {
    display: inline-block;
    margin: 1rem;
  }
}
.material-icons {
  font-size: inherit;
}
</style>
