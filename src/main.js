import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
// 全局引入自定义的组件
import Components from '@/components'

// 全局引入自定义的指令
import * as directives from '@/directives'
// 全局引入自定义的过滤器方法集
import * as filters from '@/filters'

import '@/icons' // icon
import '@/permission' // permission control
// 全局引入打印插件
import Print from 'vue-print-nb'

// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach((key) => {
  Vue.directive(key, directives[key])
})
// 遍历所有导出的过滤器对象 完成自定义过滤器全局注册
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// 注册自己的插件
Vue.use(Components)

// 注册打印插件
Vue.use(Print)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
