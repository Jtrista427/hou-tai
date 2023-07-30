<template>
    <div class="tabbar">
        <div class="tabbar_left">
            <el-icon style="margin-right:10px" @click="changeIcon">
                <component :is="LayoutSettingStore.fold?'Fold':'Expand'"></component>
                <!-- <Expand></Expand> -->
            </el-icon>
            <!-- 左侧面包屑 -->
            <el-breadcrumb separator-icon="ArrowRight">
                <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title"
                    :to="item.path">
                    <!-- 展示图标 -->
                    <el-icon style="margin:0 5px">
                        <component :is="item.meta.icon"></component>
                    </el-icon>
                    <!-- 展示标题 -->
                    <span>{{ item.meta.title }}</span>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="tabbar_right">
            <el-button size="small" icon="Refresh" circle
                @click="LayoutSettingStore.refresh = !LayoutSettingStore.refresh"></el-button>
            <el-button size="small" icon="FullScreen" circle @click="fullscreen"></el-button>
            <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
                <!-- 表单元素 -->
                <el-form>
                    <el-form-item label="主题颜色">
                        <el-color-picker @change="setColor" v-model="color" size="small" show-alpha
                            :predefine="predefineColors" />
                    </el-form-item>
                    <el-form-item label="暗黑模式">
                        <el-switch @change="changeDark" v-model="dark" class="mt-2" style="margin-left: 24px" inline-prompt
                            active-icon="MoonNight" inactive-icon="Sunny" />
                    </el-form-item>
                </el-form>
                <template #reference>
                    <el-button size="small" icon="Setting" circle></el-button>
                </template>
            </el-popover>
            <img :src="userStore.avatar" style="width:22px; height:22px;">
            <!-- 下拉菜单 -->
            <el-dropdown>
                <span class="el-dropdown-link">
                    {{ userStore.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang='ts'>
import useLayoutSettingStore from '@/store/modules/setting'
import useuserStore from '@/store/modules/user'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
// 获取用户信息
let userStore = useuserStore()

// // 定义变量控制图标切换，因为父亲组件也要用，所以写在仓库当中
// let fold = ref(false)
let LayoutSettingStore = useLayoutSettingStore()
const changeIcon = () => {
    LayoutSettingStore.fold = !LayoutSettingStore.fold
}
// 获取路由对象,获取当前路由路径
let $route = useRoute()
let $router = useRouter()
// 全屏事件
const fullscreen = () => {
    // dom属性，判断当前是不是全屏模式【全屏：true,不是：false】
    let full = document.fullscreenElement
    if (!full) {
        // 文档根节点的方法实现全屏
        document.documentElement.requestFullscreen()
    } else {
        // 退出全屏
        document.exitFullscreen()
    }
}
// 退出登录的回调
const logout = async () => {
    // 第一件事：向服务器发起请求【退出登录接口，通知服务器，唯一标识失效】
    // 第二件事：清空仓库中用户仓库的数据
    // 第三件事：跳转到login
    await userStore.userLogout()
    // 带一个参数，做再进来的时候，还是在当前页面，而不是首页的需求
    $router.push({ path: '/login', query: { redirect: $route.path } })

}

//颜色组件组件的数据
let color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
])

let dark = ref<boolean>(false)

const changeDark = () => {
    let html = document.documentElement;
    dark.value ? html.classList.add('dark') : html.className = ''
}

const setColor = () => {
    let html = document.documentElement;
    html.style.setProperty('--el-color-primary', color.value);

}
</script>

<script lang='ts'>
export default {
    name: 'tabbar'
}
</script>

<style scoped lang="scss">
.tabbar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;

    // background-image: linear-gradient(to right, rgb(243, 238, 238), rgba(214, 199, 199, 0), rgb(247, 241, 241));

    .tabbar_left {
        display: flex;
        align-items: center;
        margin-left: 20px
    }

    .tabbar_right {
        display: flex;
        align-items: center;

        img {
            display: inline-block;
            margin: 0 10px;
            border-radius: 22px
        }
    }
}
</style>
