import { createApp } from 'vue'
import App from '@/App.vue'
// 引入插件和样式 
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-Cn.mjs'
// svg插件
import 'virtual:svg-icons-register'
import router from './router'
// 引入自定义插件对象：注册整个项目的全局组件
import globalComponent from '@/components/index'
// 引入模板的全局样式
import '@/style/index.scss'
import pinia from './store'

// 引入路由鉴权的文件，让他执行一次
import './permission'

// 引入暗黑模式需要的样式
import 'element-plus/theme-chalk/dark/css-vars.css'

// 引入自定义指令
import { isHasButton } from './directives/hasButton'

const app = createApp(App)
isHasButton(app)
app.use(ElementPlus, {
    locale: zhCn
})



app.use(globalComponent)
app.use(router)
app.use(pinia)



app.mount('#app')
