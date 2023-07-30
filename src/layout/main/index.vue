<template>
    <div>
        <!-- 路由组件出口位置，添加过度动画 -->
        <!-- 注入相应的组件 -->
        <router-view v-slot="{ Component }">
            <transition name="fade">
                <!-- 对组件进行渲染 -->
                <component :is="Component" v-if="flag">
                </component>
            </transition>
        </router-view>
    </div>
</template>

<script setup lang='ts'>
import { watch, ref, nextTick } from 'vue';
import useLayoutSettingStore from '@/store/modules/setting'
let LayoutSettingStore = useLayoutSettingStore()
// 刷新按钮，监听refresh按钮是否发生变化
let flag = ref(true) //控制当前组件是否销毁重建
watch(() => LayoutSettingStore.refresh, () => {
    flag.value = false //销毁组件
    nextTick(() => {
        flag.value = true  //更新完dom之后，即删除完后再次创建
    })
})

</script>

<script lang='ts'>
export default {
    name: 'Main'
}
</script>

<style scoped lang='scss'>
.fade-enter-from {
    opacity: 0;
    transform: scale(0)
}

.fade-enter-active {
    transition: all .3s
}

.fade-enter-to {
    opacity: 1;
    transform: scale(1)
}
</style>
