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
  </div>
</template>

<script>
import path from 'path'

export default {
  data: function () {
    return {
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
      console.log(d.data())
      this.color.primary = d.data().primary
      this.color.accent = d.data().accent
    })
  },
  methods: {
    change_color: function () {
      let user = firebase.auth().currentUser
      firebase.firestore().collection(path.join('Zaiko', user.uid, 'config')).doc('color').set(this.color)
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
  .mdl-card__actions>div {
    display: inline-block;
    margin: 1rem;
  }
}
</style>
