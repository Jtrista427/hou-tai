<template>
    <div class="layout_container">
        <!-- 左侧菜单 -->
        <div class="layout_slider" :class="{ fold: LayoutSettingStore.fold ? true : false }">
            <Logo></Logo>
            <!-- 展示菜单 -->
            <!-- 滚动组件 -->
            <el-scrollbar class="scrollbar">
                <!-- 菜单组件 -->
                <el-menu :collapse="LayoutSettingStore.fold" background-color="$base-menu-background" text-color="#035252"
                    :default-active="$route.path">
                    <Menu :menuList="userStore.menuRoutes"></Menu>
                </el-menu>
            </el-scrollbar>
        </div>

        <!-- 顶部导航 -->
        <div class="layout_tabbar" :class="{ fold: LayoutSettingStore.fold ? true : false }">
            <Tabbar></Tabbar>
        </div>
        <!-- 内容展示 -->

        <div class="layout_main" :class="{ fold: LayoutSettingStore.fold ? true : false }">
            <Main></Main>
        </div>


    </div>
</template>

<script setup lang="ts">
import Logo from '@/layout/logo/logo.vue';
import Menu from '@/layout/menu/menu.vue'

// 右侧内容展示区,将router-view封装以添加过渡动画
import Main from './main/index.vue'
import { useRoute } from 'vue-router'
// 引入顶部菜单tabbar
import Tabbar from './tabbar/tabbar.vue'

import useLayoutSettingStore from '@/store/modules/setting'

import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
let LayoutSettingStore = useLayoutSettingStore()
// 获取路由对象,用于默认激活属性

let $route = useRoute()
</script>

<script lang='ts'>
export default {
    name: 'layout'
}
</script>

<style scoped lang="scss">
.layout_container {
    width: 100%;
    height: 100vh;

    .layout_slider {
        color: white;
        width: $base-menu-width;
        height: 100%;
        background-color: $base-menu-background;
        transition: all 0.3s;


        .scrollbar {
            width: $base-menu-width;
            height: calc(100vh - $base-munu-log-height);


            .el-menu {
                border-right: 0;
            }
        }

        &.fold {
            width: $base-menu-min-width;
            white-space: nowrap; //让文字在一行显示
            overflow: hidden;
        }
    }

    .layout_tabbar {
        position: fixed;
        width: calc(100% - $base-menu-width); //计算一定要有空格
        height: $base-tabbar-height;
        top: 0;
        left: $base-menu-width;
        transition: all 0.3s;

        &.fold {
            width: calc(100% - $base-menu-min-width);
            left: $base-menu-min-width
        }
    }

    .layout_main {
        position: absolute;
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-tabbar-height);
        top: $base-tabbar-height;
        left: $base-menu-width;
        padding: 20px;
        overflow: auto; //给这里加个滚动条，这样内容不会超出container


        &.fold {
            width: calc(100% - $base-menu-min-width);
            left: $base-menu-min-width
        }
    }
}
</style>
