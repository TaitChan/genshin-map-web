import Vue from 'vue'
import Element from 'element-ui'
import L from 'leaflet'
import VueIntro from 'vue-introjs'
import 'leaflet.zoomslider'

import 'element-ui/lib/theme-chalk/index.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet.zoomslider/src/L.Control.Zoomslider.css'
import 'intro.js/introjs.css'
import 'intro.js/introjs-rtl.css'
import './styles/index.scss' // global css

import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(Element, {
  size: 'medium' // set element-ui default size
})
Vue.use(VueIntro)
Vue.config.productionTip = false
/* leaflet icon */
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
