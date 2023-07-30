// 使用vue-router插件实现路由配置
import { createRouter, createWebHashHistory } from 'vue-router';
import { constantRoute, anyRoute, asyncRoute } from '@/router/routes'

let router = createRouter({
    // 使用hash模式
    history: createWebHashHistory(),
    routes: constantRoute,
    // 滚动行为
    scrollBehavior(to, from, savedPosition) {
        return {
            left: 0,
            top: 0
        }
    }
})

export default router