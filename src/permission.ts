// 路由鉴权
import router from "./router";
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import setting from "./setting";
// 在组件外部不能直接引入小仓库，要首先引入大仓库，并作为传参
import pinia from "./store";
import useuserStore from '@/store/modules/user'
nprogress.configure({ showSpinner: false })
let userStore = useuserStore(pinia)
// 全局前置守卫
router.beforeEach(async (to, from, next) => {
    nprogress.start()
    // 获取token
    let token = userStore.token
    if (token) {
        // 登陆成功

        if (to.path == '/login') {
            next('/')
        } else {
            // 登陆成功，访问其他路由
            // 可以在这里判断是否有用户信息，没有就发起请求后再放行
            // 现在是本地持久存储，但是并不安全
            if (userStore.username) {
                //放行
                next()
            }
            else {
                try {
                    await userStore.userInfo();
                    // 刷新的时候是异步路由，可能获取到了用户信息，但是异步路由还没有加载完毕，出现空白的效果
                    // 保证to有了，而不是直接放行
                    console.log("xixi", userStore.menuRoutes)
                    next({ ...to, replace: true })
                } catch (error) {
                    await userStore.userLogout();
                    next({ path: '/login', query: { redirect: to.path } })
                }
            }

        }
    } else {
        // 没有登陆
        if (to.path == '/login') {
            next()
        } else {
            next({ path: '/login', query: { redirect: to.path } })
        }
    }

})

// 全局后置守卫
router.afterEach((to, from) => {
    nprogress.done()
    document.title = `${setting.title} - ${to.meta.title}`
})

// 1.实现任意路由切换有进度条--nprogress
// 没有登陆，不能访问其他路由
// 登陆成功，不能访问login
// 登陆没登录根据token判断