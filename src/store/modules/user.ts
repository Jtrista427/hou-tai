// 创建用户相关的仓库
import { defineStore } from 'pinia'
// 引入接口
import { reqLgin, reqUserInfo, reqLogout } from '@/api/user'
// 引入数据类型
import type { loginFormData, loginResponseData, userInfoResponseData } from '@/api/user/type'
import type { userState } from './types'

// 引入操作本地存储的方法
import { SET_TOKEN, GET_TOKEN, SET_User } from '@/utils/token'
import router from '@/router'
// 引入常量路由，放入store存储,为了显示菜单
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'


import cloneDeep from 'lodash/cloneDeep'
// 过滤路由
function filterAsyncRoute(asyncRoutes: any, routes: any) {
    return asyncRoutes.filter((item: any) => {
        if (routes.includes(item.name)) { //一级路由
            if (item.children && item.children.length > 0) {
                item.children = filterAsyncRoute(item.children, routes) //这里改变了原数组，所以需要深拷贝
            }
            return true
        }
    })
}


// 使用的选择式API
let useuserStore = defineStore('User', {
    // 存储数据的地方
    state: (): userState => {
        return {
            token: GET_TOKEN("TOKEN"),    //用户的唯一标识
            menuRoutes: constantRoute,  //菜单需要的数组，路由过滤也用到了
            // menuRoutes: constantRoute,
            username: GET_TOKEN("USERNAME"),
            avatar: GET_TOKEN("AVATAR"),
            //存储当前用户是否包含某一个按钮
            buttons: [],
        }
    },
    actions: {
        // 用户登录
        async userLogin(data: loginFormData) {
            // console.log("111", data)
            let result: loginResponseData = await reqLgin(data);
            // 200成功获得token,201失败
            if (result.code == 200) {
                this.token = result.data
                // 还要本地持久化存储一下,以便刷新后还有
                SET_TOKEN(result.data)
                // 返回一个成功的promise
                return "ok"
            } else {
                return Promise.reject(new Error(result.data))
            }
        },
        // 获取用户信息
        async userInfo() {
            let result: userInfoResponseData = await reqUserInfo()
            console.log(result)
            if (result.code == 200) {
                this.username = result.data.name
                this.avatar = result.data.avatar
                // 还要本地持久化存储一下,以便刷新后还有
                // SET_User(this.username, this.avatar)
                // 过滤路由信息,要深拷贝
                let userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), result.data.routes)
                this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute];
                // []前面一定要有分号
                // 注册路由，不需要回到路由文件中操作！
                [...userAsyncRoute, anyRoute].forEach((route: any) => {
                    router.addRoute(route)
                })
                // 可以打印当前用户的全部路由
                console.log(router.getRoutes())
                // 保存buttons
                this.buttons = result.data.buttons
                // // 返回一个成功的promise
                return "ok";
            } else {
                return Promise.reject(new Error(result.message))
            }

        },
        // 退出登录
        async userLogout() {
            let result: any = await reqLogout()
            if (result.code == 200) {
                this.token = "";
                this.username = '';
                this.avatar = '';
                localStorage.removeItem('TOKEN');
                localStorage.removeItem('USERNAME');
                localStorage.removeItem('AVATAR')
                return 'ok'
            } else {
                return Promise.reject(new Error(result.message))
            }

        }

    },
    getters: {},
})

export default useuserStore