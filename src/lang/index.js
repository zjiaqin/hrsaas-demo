import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookie from 'js-cookie'
import elementEN from 'element-ui/lib/locale/lang/en'
import elementZH from 'element-ui/lib/locale/lang/zh-CN'
import customZH from './zh' // 引入自定义中文包
import customEN from './en' // 引入自定义英文包

Vue.use(VueI18n)
export default new VueI18n({
  locale: Cookie.get('language') || 'zh',
  messages: {
    en: {
      ...elementEN,
      ...customEN // 将饿了么的英文语言包引入
    },
    zh: {
      ...elementZH,
      ...customZH // 将饿了么的中文语言包引入
    }
  }
})
