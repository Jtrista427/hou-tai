<template>
    <div>
        <el-card>
            <el-form :inline="true">
                <el-form-item label="一级分类">
                    <!-- v-model就是手机表单的value值,value属性是下拉选择的那个属性 -->
                    <el-select v-model="categoryStore.c1Id" @change="handlerC1" :disabled="scene == 0 ? false : true">
                        <el-option v-for="(c1, index) in categoryStore.C1List" :key="c1.id" :label="c1.name"
                            :value="c1.id"></el-option>>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级分类">
                    <el-select v-model="categoryStore.c2Id" @change="handlerC2" :disabled="scene == 0 ? false : true">
                        <el-option v-for="(c2, index) in categoryStore.C2List" :key="c2.id" :label="c2.name"
                            :value="c2.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="三级分类">
                    <el-select v-model="categoryStore.c3Id" :disabled="scene == 0 ? false : true">
                        <el-option v-for="(c3, index) in categoryStore.C3List" :key="c3.id" :label="c3.name"
                            :value="c3.id" />
                    </el-select>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang='ts'>
// 因为好多数据不止这个组件需要，所以将数据放入仓库中

import { onMounted, ref, watch } from 'vue';
import useCategoryStore from '@/store/modules/category.ts'
let categoryStore = useCategoryStore()
onMounted(() => {
    // 获取一级分类数据
    getC1()
})

// 通知仓库获取一级分类
const getC1 = () => {
    categoryStore.getC1();
}

// 通过select的change事件实现
const handlerC1 = () => {
    // 改变选项之后，如果后面两个框有值那么需要清空
    // 通过清除仓库中的ID
    categoryStore.c2Id = '';
    categoryStore.c3Id = '';
    categoryStore.C3List = [];
    categoryStore.getC2()
}


const handlerC2 = () => {
    // 清理三级分类
    categoryStore.c3Id = '';
    categoryStore.getC3()
}

// 接受父组件的场景值scene
defineProps(['scene'])

</script>

<style scoped lang='scss'></style>
