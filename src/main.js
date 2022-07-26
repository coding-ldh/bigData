import Vue from 'vue'

import Cookies from 'js-cookie'

import PadDownloader from "@/utils/tool";

import echarts from 'echarts'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element, { Message, MessageBox } from 'element-ui'

import "element-ui/lib/theme-chalk/index.css"

import './styles/element-variables.scss'
import "@/styles/common.scss";

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control


import * as filters from './filters' // global filters

Vue.prototype.$echarts = echarts;
Vue.prototype.$message = Message;
Vue.prototype.$mb = MessageBox

Vue.use(PadDownloader)


/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
})


// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
