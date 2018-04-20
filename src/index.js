import path from 'path'

import Menu from './Menu.vue'
import Sales from './Sales.vue'
import Inventory from './Inventory.vue'
import Settings from './Settings.vue'
import Items from './Settings/Items.vue'
import Partners from './Settings/Partners.vue'
import Categories from './Settings/Categories.vue'
import Config from './Settings/Config.vue'
import History from './History.vue'
import Detail from './Detail.vue'
import Icon from './Icon.vue'

document.addEventListener('DOMContentLoaded', function () {
  try {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        if (location.search.length > 0) {
          user = {uid: location.search.substring(1)}
        }
        let router = new VueRouter({
          mode: 'history',
          routes: [
            { name: 'sales', path: '/sales', component: Sales },
            { name: 'salesHistory', path: '/sales/history', component: History },
            { name: 'salesDetail', path: '/sales/detail/:id', component: Detail, props: true },
            { name: 'inventory', path: '/inventory', component: Inventory },
            { name: 'inventoryHistory', path: '/inventory/history', component: History },
            { name: 'inventoryDetail', path: '/inventory/detail/:id', component: Detail, props: true },
            {
              name: 'settings',
              path: '/settings',
              component: Settings,
              children: [
                { name: 'items', path: 'items', component: Items },
                { name: 'buyers', path: 'buyers', component: Partners },
                { name: 'sellers', path: 'sellers', component: Partners },
                { name: 'categories', path: 'categories', component: Categories },
                { name: 'config', path: 'config', component: Config }
              ]
            }
          ]
        })
        var names = {
          'sales': '販売',
          'inventory': '在庫',
          'detail': '詳細',
          'history': '履歴',
          'settings': '管理',
          'items': '商品',
          'buyers': '販売先',
          'sellers': '仕入先',
          'categories': 'カテゴリー',
          'config': '設定'
        }
        var mixin = {
          mounted: function () {
            this.updateTitle()
          },
          watch: {
            '$route': function (to, from) {
              this.updateTitle()
            }
          },
          methods: {
            updateTitle: function () {
              document.title = 'Zaiko - ' + this.$route.path.split('/').filter(function (i) { return i.length > 1 }).map(function (i) { return names[i] }).join(' - ')
            },
            format_price: function (p) {
              return String(p).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
            },
            format_date: function (date) {
              if (date) {
                return [date.getFullYear(), this.padding(date.getMonth(), 2), this.padding(date.getDay(), 2)].join('/') + ' ' + [this.padding(date.getHours(), 2), this.padding(date.getMinutes(), 2)].join(':')
              }
            },
            padding: function (s, n) {
              return ('0'.repeat(n) + s).slice(-1 * n)
            }
          }
        }
        Vue.mixin(mixin)
        Vue.use(VueRouter)
        Vue.use(Vuex)
        Vue.component('Icon', Icon)
        var data = {
          user: user,
          config: {},
          items: {},
          sellers: {},
          buyers: {},
          categories: []
        }
        let store = new Vuex.Store({
          state: data,
          mutations: {
            push: function (state, payload) {
              state[payload.name].push(payload.value)
            },
            set: function (state, payload) {
              Vue.set(state[payload.name], payload.value.id, payload.value.data())
            }
          }
        })
        let app = new Vue({
          router: router,
          store: store,
          template: '<router-view></router-view>'
        })
        app.$mount('#main')
        let menu = new Vue({
          components: {Menu},
          template: '<Menu></Menu>',
          router: router
        })
        menu.$mount('#menu')
        if (window.location.pathname === '/') {
          router.push('/sales')
        }
        ['config', 'items', 'buyers', 'sellers'].forEach(function (c) {
          firebase.firestore().collection(path.join('Zaiko', user.uid, c)).onSnapshot(function (s) {
            for (let k in data[c]) {
              Vue.delete(data[c], k)
            }
            s.forEach(function (d) {
              var p = { name: c, value: d }
              store.commit('set', p)
            })
            componentHandler.upgradeDom()
          })
        })
        firebase.firestore().collection(path.join('Zaiko', user.uid, 'categories')).onSnapshot(function (s) {
          data.categories.splice(0, data.categories.length)
          s.forEach(function (d) {
            store.commit('push', { name: 'categories', value: d.id })
          })
        })
        firebase.firestore().collection(path.join('Zaiko', user.uid, 'config')).doc('color').onSnapshot(function (d) {
          if (d.exists) {
            document.head.querySelectorAll('link[href*="code.getmdl.io"]').forEach(function (l) {
              l.setAttribute('href', 'https://code.getmdl.io/1.3.0/material.' + d.data().primary + '-' + d.data().accent + '.min.css')
            })
          }
          componentHandler.upgradeDom()
        })
      } else {
        const ui = new firebaseui.auth.AuthUI(firebase.auth())
        ui.start('#firebase-auth-container', {
          signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            firebase.auth.GithubAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID
          ],
          tosUrl: ''
        })
      }
    })
  } catch (e) {
    console.error(e)
  }
})
