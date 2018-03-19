<template>
  <div>
    <div id='color' class='mdl-card mdl-js-card mdl-shadow--2dp'>
      <div class='mdl-card__title'>配色</div>
      <div class='mdl-card__actions'>
        <div>ベース
          <div class='mdl-textfield mdl-js-textfield'>
            <select class='mdl-textfield__input' @change='change_color' v-model=color.primary id='color-primary' name='color-primary'>
              <option v-for='(v, k) in primary' :value=k >{{v}}</option>
            </select>
          </div>
        </div>
        <div>アクセント
          <div class='mdl-textfield mdl-js-textfield'>
            <select class='mdl-textfield__input' @change='change_color' v-model=color.accent id='color-accent' name='color-accent'>
              <option v-for='(v, k) in accent' :value=k >{{v}}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div id='count' class='mdl-card mdl-js-card mdl-shadow--2dp'>
      <div class='mdl-card__title'>数量</div>
      <div class='mdl-card__supporting-text'>
        商品の<i class='material-icons'>add</i>ボタンの代わりに画像部分をクリックすると数量で指定した数を増やせるようになります。<br />
        減らす場合は商品名の部分をクリックします。
      </div>
      <div class='mdl-card__actions'>
        <div>
          <div class='mdl-textfield mdl-js-textfield'>
            <label class='mdl-switch mdl-js-switch mdl-js-ripple-effect' for='use_count'>
              <input @change='change_count' v-model='count.use' type='checkbox' id='use_count' class='mdl-switch__input'>
              <span class='mdl-switch__label'>大量販売をする</span>
            </label>
          </div>
        </div>
        <div>
          <div class='mdl-textfield mdl-js-textfield' :class='{"is-disabled": !count.use}'>
            <input @change='change_count' v-model='count.count' :disabled='!count.use' class='mdl-textfield__input' type='text' pattern='-?[0-9]*(\.[0-9]+)?' id='count_num'>
            <label class='mdl-textfield__label' for='count_num'>数量</label>
            <span class='mdl-textfield__error'>数値を入力してください</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import path from 'path'

export default {
  data: function () {
    return {
      count: {
        use: false,
        count: 10
      },
      color: {
        primary: 'blue',
        accent: 'purple'
      },
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
      }
    }
  },
  created: function () {
    let user = firebase.auth().currentUser
    firebase.firestore().collection(path.join('Zaiko', user.uid, 'config')).doc('color').get().then((d) => {
      this.color.primary = d.data().primary
      this.color.accent = d.data().accent
    })
    firebase.firestore().collection(path.join('Zaiko', user.uid, 'config')).doc('count').onSnapshot((d) => {
      this.count.use = d.data().use
      this.count.count = d.data().count
      if (this.count.use) {
        document.getElementById('use_count').parentNode.MaterialSwitch.on()
      } else {
        document.getElementById('use_count').parentNode.MaterialSwitch.off()
      }
      document.getElementById('count_num').parentNode.MaterialTextfield.change(this.count.count)
    })
  },
  mounted: function () {
    componentHandler.upgradeDom()
  },
  methods: {
    change_color: function () {
      let user = firebase.auth().currentUser
      firebase.firestore().collection(path.join('Zaiko', user.uid, 'config')).doc('color').set(this.color)
    },
    change_count: function () {
      componentHandler.upgradeDom()
      let user = firebase.auth().currentUser
      firebase.firestore().collection(path.join('Zaiko', user.uid, 'config')).doc('count').set(this.count)
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
    }
  }
}
</script>

<style scoped lang='scss'>
.mdl-card {
  width: 80%;
  margin: 2rem;
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
