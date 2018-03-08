import Vue from 'vue'
import VueRouter from 'vue-router'

import Menu from './Menu.vue'
import Auth from './Auth.vue'
import Sales from './Sales.vue'
import Inventory from './Inventory.vue'
import Settings from './Settings.vue'
import Items from './Settings/Items.vue'
import Farmers from './Settings/Farmers.vue'
import Sellers from './Settings/Sellers.vue'

document.addEventListener('DOMContentLoaded', () => {
  try {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        let router = new VueRouter({
          mode: 'history',
          routes: [
            { name: 'sales', path: '/sales', component: Sales },
            { name: 'inventory', path: '/inventory', component: Inventory },
            {
              name: 'settings',
              path: '/settings',
              component: Settings,
              children: [
                { name: 'items', path: 'items', component: Items },
                { name: 'farmers', path: 'farmers', component: Farmers },
                { name: 'sellers', path: 'sellers', component: Sellers }
              ]
            }
          ]
        })
        Vue.use(VueRouter)
        let app = new Vue({
          router
        })
        app.$mount('#main')
        let menu = new Vue({
          components: {Menu},
          template: '<Menu></Menu>',
          router
        })
        menu.$mount('#menu')
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
