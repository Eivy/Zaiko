import Vue from 'vue'
import VueRouter from 'vue-router'

import Top from './Top.vue'
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
        Vue.use(VueRouter)
        let app = new Vue({
          components: {Top},
          template: '<Top></Top>',
          router: new VueRouter({routes: [
            { path: 'sales', component: Sales },
            { path: 'inventory', component: Inventory },
            { path: 'settings', component: Settings }
          ]
          })
        })
        app.$mount('#top')
      } else {
        let app = new Vue({
          components: {Auth},
          template: '<Auth></Auth>'
        })
        app.$mount('#top')
      }
    })
  } catch (e) {
    console.error(e)
    document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.'
  }
})
