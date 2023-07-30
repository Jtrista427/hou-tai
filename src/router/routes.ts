// 常量路由
export const constantRoute = [
    {
        name: 'login',
        path: '/login',
        component: () => import('@/views/login/login.vue'), //函数不会自动执行
        // 添加元信息，用于在菜单中展示名字
        meta: {
            title: '登录',
            hidden: true //代表路由标题在菜单中是否隐藏
        }
    },
    {
        name: 'layout',
        path: '/',
        component: () => import('@/layout/index.vue'),
        meta: {
            // title: 'layout',
            hidden: false, //代表路由标题在菜单中是否隐藏
            // icon: "Avatar" //图标名称，支持element图标
        },
        redirect: '/home',
        children: [
            {
                name: 'Home',
                path: '/home',
                component: () => import('@/views/home/home.vue'),
                meta: {
                    title: '首页',
                    hidden: false,
                    icon: "HomeFilled"
                },
            },
        ]
    },
    {
        name: '404',
        path: '/404',
        component: () => import('@/views/404/404.vue'),
        meta: {
            title: '404',
            hidden: true
        },
    },
    {
        name: 'Screen',
        path: '/screen',
        component: () => import('@/views/screen/screen.vue'),
        meta: {
            hidden: false,
            title: '数据大屏',
            icon: "Platform"

        }
    },

]

export const asyncRoute = [// children里面的path 不要加 / ，加了就表示是根目录下的路由。
    {
        name: 'Acl',
        path: '/acl',
        // 点击大标题的时候还是显示原来的页面
        component: () => import('@/layout/index.vue'),
        meta: {
            hidden: false,
            title: '权限管理',
            icon: "Lock"
        },
        redirect: '/acl/permission',
        children: [
            {
                name: 'User',
                path: '/acl/user',
                // 点击大标题的时候还是显示原来的页面
                component: () => import('@/views/acl/user/user.vue'),
                meta: {
                    hidden: false,
                    title: '用户管理',
                    icon: "User"
                },
            },
            {
                name: 'Role',
                path: '/acl/role',
                // 点击大标题的时候还是显示原来的页面
                component: () => import('@/views/acl/role/role.vue'),
                meta: {
                    hidden: false,
                    title: '角色管理',
                    icon: "UserFilled"
                },
            },

            {
                name: 'Permission',
                path: '/acl/permission',
                // 点击大标题的时候还是显示原来的页面
                component: () => import('@/views/acl/permission/permission.vue'),
                meta: {
                    hidden: false,
                    title: '菜单管理',
                    icon: "Monitor"
                },
            },
        ]
    },

    {
        name: 'Product',
        path: '/product',
        // 点击大标题的时候还是显示原来的页面
        component: () => import('@/layout/index.vue'),
        meta: {
            hidden: false,
            title: '商品管理',
            icon: "Goods"
        },
        redirect: '/product/attr',
        children: [
            {
                name: 'Trademark',
                path: '/product/trademark',
                component: () => import('@/views/product/trademark/trademark.vue'),
                meta: {
                    hidden: false,
                    title: '品牌管理',
                    icon: "ShoppingCartFull"
                },
            },
            {
                name: 'Attr',
                path: '/product/attr',

                component: () => import('@/views/product/attr/attr.vue'),
                meta: {
                    hidden: false,
                    title: '属性管理',
                    icon: "ChromeFilled"
                },
            },
            {
                name: 'Spu',
                path: '/product/spu',
                component: () => import('@/views/product/spu/spu.vue'),
                meta: {
                    hidden: false,
                    title: 'SPU管理',
                    icon: "Calendar"
                },
            },
            {
                name: 'Sku',
                path: '/product/sku',
                component: () => import('@/views/product/sku/sku.vue'),
                meta: {
                    hidden: false,
                    title: 'SKU管理',
                    icon: "Orange"
                },
            },
        ]
    },]

// 任意路由
export const anyRoute = {
    // 任意路由
    path: '/:pathMatch(.*)*',  //这利用了正则表达式，vue2可以直接使用path:'*'
    redirect: '/404',
    name: 'Any',
    meta: {
        title: 'any',
        hidden: true
    },
}