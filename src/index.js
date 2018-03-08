import Vue from 'vue'
import VueRouter from 'vue-router'

import Menu from './Menu.vue'
import Auth from './Auth.vue'
import Sales from './Sales.vue'
import Inventory from './Inventory.vue'
import Settings from './Settings.vue'

document.addEventListener('DOMContentLoaded', () => {
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  // // The Firebase SDK is initialized and available here!
  //
  // firebase.auth().onAuthStateChanged(user => { })
  // firebase.database().ref('/path/to/ref').on('value', snapshot => { })
  // firebase.messaging().requestPermission().then(() => { })
  // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { })
  //
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

  try {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        let router = new VueRouter({routes: [
          { name: 'sales', path: '/sales', component: Sales },
          { name: 'inventory', path: '/inventory', component: Inventory },
          { name: 'settings', path: '/settings', component: Settings }
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
