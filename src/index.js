import path from 'path'

import Menu from './Menu.vue'
import Auth from './Auth.vue'
import Sales from './Sales.vue'
import Inventory from './Inventory.vue'
import Settings from './Settings.vue'
import Items from './Settings/Items.vue'
import Partners from './Settings/Partners.vue'
import Categories from './Settings/Categories.vue'
import Config from './Settings/Config.vue'
import SalesHistory from './Sales/History.vue'
import Icon from './Icon.vue'

document.addEventListener('DOMContentLoaded', () => {
  try {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        let router = new VueRouter({
          mode: 'history',
          routes: [
            { name: 'sales', path: '/sales', component: Sales },
            { name: 'salesHistory', path: '/sales/history', component: SalesHistory },
            { name: 'inventory', path: '/inventory', component: Inventory },
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
        Vue.use(VueRouter)
        Vue.use(Vuex)
        Vue.component('Icon', Icon)
        var data = {
          user,
          config: {},
          items: {},
          sellers: {},
          buyers: {},
          categories: []
        }
        let store = new Vuex.Store({
          state: data,
          mutations: {
            push (state, payload) {
              state[payload.name].push(payload.value)
            },
            set (state, payload) {
              Vue.set(state[payload.name], payload.value.id, payload.value.data())
            }
          }
        })
        let app = new Vue({
          router,
          store,
          template: '<router-view></router-view>'
        })
        app.$mount('#main')
        let menu = new Vue({
          components: {Menu},
          template: '<Menu></Menu>',
          router
        })
        menu.$mount('#menu')
        if (window.location.pathname === '/') {
          router.push('/sales')
        }
        ['config', 'items', 'buyers', 'sellers'].forEach(c => {
          firebase.firestore().collection(path.join('Zaiko', user.uid, c)).onSnapshot(s => {
            for (let k in data[c]) {
              delete data[c][k]
            }
            s.forEach(d => {
              var p = { name: c, value: d }
              store.commit('set', p)
            })
          })
        })
        firebase.firestore().collection(path.join('Zaiko', user.uid, 'categories')).onSnapshot(s => {
          data.categories.splice(0, data.categories.length)
          s.forEach(d => {
            store.commit('push', { name: 'categories', value: d.id })
          })
        })
        firebase.firestore().collection(path.join('Zaiko', user.uid, 'config')).doc('color').onSnapshot((d) => {
          document.head.querySelectorAll('link[href*="code.getmdl.io"]').forEach((l) => {
            l.setAttribute('href', 'https://code.getmdl.io/1.3.0/material.' + d.data().primary + '-' + d.data().accent + '.min.css')
          })
        })
      } else {
        let app = new Vue({
          components: {Auth},
          template: '<Auth></Auth>'
        })
        app.$mount('#main')
      }
    })
  } catch (e) {
    console.error(e)
    document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.'
  }
})
