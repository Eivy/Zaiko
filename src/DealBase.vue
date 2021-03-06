<template>
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
      <div class="mdl-layout__header-row">
        <span class="mdl-layout-title">{{title}}</span>
        <div class='mdl-layout-spacer'></div>
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right">
          <label class="mdl-button mdl-js-button mdl-button--icon" for="fixed-header-drawer-exp"><Icon>search</Icon></label>
          <div class="mdl-textfield__expandable-holder">
            <input class="mdl-textfield__input" v-model='filter' type="text" name="sample" id="fixed-header-drawer-exp">
            <ul class='mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect' for='fixed-header-drawer-exp'>
              <li class='mdl-menu__item'>カテゴリー</li>
              <li v-for='c in categories' class='mdl-menu__item'>
                <label @click.stop class='mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect' :for=c >
                  <input :id=c type='checkbox' v-model='filter_category' :value='c' class='mdl-checkbox__input'>
                  <span class='mdl-checkbox__label'>{{c}}</span>
                </label>
              </li>
            </ul>
          </div>
        </div>
        <nav class='mdl-navigation'>
          <router-link class='mdl-navigation__link' :to='$route.path + "/history"'>履歴</router-link>
        </nav>
      </div>
    </header>
    <main>
      <div v-if='objectKeys(items).length === 0' class='caution'><router-link to='/settings/items'>商品管理</router-link>で商品の登録をしてください</div>
      <div v-else-if='objectKeys(filterd_items).length === 0' class='caution'>該当商品がありません</div>
      <div v-for='i in filterd_items' @click='increase_more(i.id)' class='mdl-card mdl-shadow--2dp mdl-badge mdl-badge--overlap' :style='{background: "url(" + i.image + ") center / cover"}' :data-badge='deal[i.id] ? deal[i.id].count : null'>
        <div class="mdl-card__title mdl-card--expand"></div>
        <div @click.stop='decrease_more(i.id)' class="mdl-card__supporting-text">
          <div>{{i.id}}</div>
          <div>¥{{format_price(price(i.id))}} 残:{{count(i.id)}}</div>
          <button :disabled='!deal[i.id]' class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab remove" @click.stop='decrease(i.id)'><Icon>remove</Icon></button>
          <button :disabled='is_able_increment(i.id)' class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab add" @click.stop='increase(i.id)'><Icon>add</Icon></button>
        </div>
      </div>
    </main>
    <footer class="mdl-mini-footer">
      <div class="mdl-mini-footer__left-section">
        <div v-if='use_dealer' class='mdl-textfield mdl-js-textfield'>
          <select id='dealer' class='mdl-textfield__input' v-model=dealer >
            <option value=''></option>
            <option v-for='(v, k) in dealers' :value='v'>{{k}}</option>
          </select>
          <label class='mdl-textfield__label' for='dealer'>{{$route.name === "sales" ? "販売先" : "仕入先"}}</label>
        </div>
      </div>
      <div class="mdl-mini-footer__right-section">
        <span>合計: <span>{{sum_count}}</span>個 <span>{{sum_price}}円</span></span>
        <SubmitButton :disabled='sum_count === 0' @click.native='before_submit()'></SubmitButton>
      </div>
    </footer>
    <div id='confirm' :style='{display: confirm ? "flex" : "none"}' @click.stop='confirm = !confirm'>
      <div class='mdl-card mdl-shadown--2dp' @click.stop >
        <div class='mdl-card__title'><h4>以下の内容でよろしいですか?</h4></div>
        <div class='mdl-list'>
          <div v-for='(v, k) in deal' class="mdl-list__item mdl-list__item--two-line mdl-shadow--2dp">
            <span class='mdl-list__item-primary-content'>
              <div class='mdl-list__item-avatar' :style='{background: "url(" + v.image + ") center / cover"}'></div>
              <span class='mdl-list__item-title'>{{k}}</span>
              <span class='mdl-list__item-sub-title'>{{format_price(price(k))}}円</span>
            </span>
            <span class='mdl-list__item-secondary-action'>{{v.count}}個</span>
          </div>
        </div>
        <h5>合計: {{sum_price}}円</h5>
        <div class='mdl-card__actions'>
          <SubmitButton @click.native='submit()'></SubmitButton>
          <button class='mdl-button mdl-js-button mdl-ripple-effect mdl-button--raised' @click.stop='confirm = !confirm'><Icon>close</Icon></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import objectAssign from 'object-assign'
import SubmitButton from './SubmitButton.vue'
import Icon from './Icon.vue'

let snapshot = []
export default {
  components: { SubmitButton, Icon },
  data: function () { return objectAssign({ confirm: false, dealer: '', deal: {}, filter: '', filter_category: [] }, this.$store.state) },
  mounted: function () {
    componentHandler.upgradeDom()
  },
  destroy: function () {
    snapshot()
  },
  methods: {
    increase_more: function (id) {
      if (this.config.count && this.config.count.use) {
        if (!this.deal[id]) {
          let data = objectAssign({}, this.items[id])
          data.count = 0
          Vue.set(this.deal, id, data)
        }
        if (this.items[id].count >= this.deal[id].count + this.config.count.count) {
          this.deal[id].count += this.config.count.count
        } else {
          this.deal[id].count = this.items[id].count
        }
        if (this.deal[id].count === 0) {
          Vue.delete(this.deal, id)
        }
      }
    },
    decrease_more: function (id) {
      if (this.config.count && this.config.count.use && this.deal[id]) {
        if (this.deal[id].count <= this.config.count.count) {
          Vue.delete(this.deal, id)
        } else {
          this.deal[id].count -= this.config.count.count
        }
      }
    },
    increase: function (id) {
      if (!this.deal[id]) {
        let data = objectAssign({}, this.items[id])
        data.count = 0
        Vue.set(this.deal, id, data)
      }
      this.deal[id].count += 1
    },
    decrease: function (id) {
      if (this.deal[id]) {
        if (this.deal[id].count > 0) {
          this.deal[id].count -= 1
        }
        if (this.deal[id].count < 1) {
          Vue.delete(this.deal, id)
        }
      }
    },
    before_submit: function () {
      if (!this.is_valid_submit()) {
        return
      }
      this.confirm = true
    },
    objectKeys: function (o) {
      let a = []
      for (let k in o) {
        a.push(k)
      }
      return a
    }
  },
  computed: {
    sum_count: function () {
      let sum = 0
      for (let id in this.deal) {
        sum += this.deal[id].count
      }
      return sum
    },
    filterd_items: function () {
      if (this.filter === '' && this.filter_category.length === 0) {
        return this.items
      }
      let r = {}
      if (this.filter_category.length > 0) {
        for (let k in this.items) {
          if (this.items[k].categories) {
            let isInclude = true
            for (let c in this.filter_category) {
              isInclude = isInclude && (this.items[k].categories.indexOf(this.filter_category[c]) >= 0)
            }
            if (isInclude) {
              r[k] = this.items[k]
            }
          }
        }
      } else {
        objectAssign(r, this.items)
      }
      let re = new RegExp('.*(' + this.filter.replace(/([[\]\\{}.?*+^$])/, '\\$1').split(new RegExp('[ 　]+')).join('|') + ').*')
      for (let k in r) {
        if (!k.match(re)) {
          delete r[k]
        }
      }
      return r
    }
  }
}
</script>

<style scoped lang='scss'>
$backColor: rgba(240, 240, 240, 0.8);
main {
  height: 100%;
  overflow-y: auto;
  .caution {
    padding: 2rem;
  }
}
.mdl-checkbox__label {
  position: absolute;
}
.mdl-card {
  max-width: calc(50vmin - 2rem);
  max-height: calc(50vmin - 2rem);
  min-height: 100px;
  min-width: 100px;
  width: 200px;
  height: 200px;
  float: left;
  margin: 1rem;
  position: relative;
  overflow: visible;
  &:hover {
    box-shadow: 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12), 0 5px 5px -3px rgba(0, 0, 0, .2);
  }
  .mdl-card__supporting-text {
    width: 100%;
    padding: 5px 5px 0 5px;
    background: $backColor;
    box-sizing: border-box;
    opacity: 1;
    .mdl-button {
      background-color: #eee;
      height: 30px;
      width: 30px;
      min-width: 30px;
      min-height: 30px;
      position: absolute;
      bottom: 2px;
      &[disabled] {
        background-color: #ccc;
      }
      &.add {
        right: 34px;
      }
      &.remove {
        right: 2px;
      }
    }
  }
}
.mdl-mini-footer {
  .mdl-textfield {
    padding: 0;
    background-color: white;
    color: black;
  }
  .mdl-textfield__label {
    top: 5px;
    &:after {
      bottom: 0;
    }
  }
  #buyer {
    background-color: white;
  }
}
#confirm {
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  z-index:999;
  width: 100%;
  height: 100%;
  background-color: rgba(50, 50, 50, 0.8);
  .mdl-card__title {
    h4 {
      margin: 0;
    }
  }
  .mdl-card {
    width: 80%;
    height: auto;
    max-width: 600px;
    max-height: 80%;
    background-color: white;
    h5 {
      text-align: right;
      padding-right: 1rem;
    }
  }
  .mdl-list {
    height: 100%;
    overflow-y: auto;
  }
  .mdl-list__item {
    background-color: white;
    margin: 1rem;
  }
  .mdl-list__item-avatar {
    border-radius: 0;
  }
}
</style>
