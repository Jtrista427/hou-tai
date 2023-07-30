<template>
    <div>
        <template v-for="(item, index) in menuList" :key="item.path">
            <!-- 没有子路由 -->
            <template v-if="!item.children">

                <el-menu-item :index="item.path" v-if="!item.meta.hidden" @click="goRoute">
                    <el-icon>
                        <component :is="item.meta.icon"></component>
                    </el-icon>
                    <template #title>
                        <span>{{ item.meta.title }}</span>
                    </template>

                </el-menu-item>
            </template>

            <!-- 只有一个子路由 -->
            <template v-if="item.children && item.children.length == 1">
                <el-menu-item :index="item.children[0].path" v-if="!item.children[0].meta.hidden" @click="goRoute">
                    <el-icon>
                        <component :is="item.children[0].meta.icon"></component>
                    </el-icon>
                    <template #title>
                        <span>{{ item.children[0].meta.title }}</span>
                    </template>
                </el-menu-item>
            </template>

            <!-- 多个子路由 -->
            <el-sub-menu :index="item.path" v-if="item.children && item.children.length > 1">
                <template #title>
                    <el-icon>
                        <component :is="item.meta.icon"></component>
                    </el-icon>
                    <span>{{ item.meta.title }}</span>
                </template>
                <Menu :menuList="item.children"></Menu>
            </el-sub-menu>
        </template>
    </div>
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router'
// 获取父组件传递的路由数组
const props = defineProps(['menuList'])
console.log(props.menuList)

// 获取路由器对象
let $router = useRouter()
// 点击菜单的回调
const goRoute = (vc: any) => {
    // vc.index获得的是当前的路由路径，子路由也要写完整
    $router.push(vc.index)


}

</script>

<script lang="ts">
// 使用递归组件，必须有名字
export default {
    name: 'Menu'
}
</script>

<style scoped lang="scss"></style>

