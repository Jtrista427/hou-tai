<template>
    <div>
        <Category :scene="scene"></Category>
        <el-card style="margin:10px 0">
            <div v-show="scene == 0">
                <el-button type="primary" icon="Plus" :disabled="!categoryStore.c3Id" @click="addSpu">新增SPU</el-button>
                <el-table border style="margin:10px 0" :data="records">
                    <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                    <el-table-column label="SPU名称" prop="spuName"></el-table-column>
                    <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
                    <el-table-column label="SPU操作">
                        <template #="{ row, $index }">
                            <el-button type="primary" size="small" icon="Plus" title="添加SKU"
                                @click="addSku(row)"></el-button>
                            <el-button type="primary" size="small" icon="Edit" title="修改SPU"
                                @click="updateSpu(row)"></el-button>
                            <el-button type="primary" size="small" icon="View" title="查看SKU"
                                @click="findSku(row)"></el-button>
                            <el-popconfirm title="确认删除当前数据吗？" width="200px" @confirm="deleteSku(row)">
                                <template #reference>
                                    <el-button type="primary" size="small" icon="Delete" title="删除SKU"></el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination v-model:current-page="pageNO" v-model:page-size="limit" :page-sizes="[3, 5, 7, 10]"
                    :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total"
                    @current-change="getSpuInfo" @size-change="changesize" />
            </div>
            <SpuForm ref="spu" v-show="scene == 1" @changeScene="changeScene"></SpuForm>
            <SkuForm ref="sku" v-show="scene == 2" @changeScene="changeScene"></SkuForm>
            <!-- dialog对话框，展示已有的SKU数据 -->
            <el-dialog v-model="show" title="SKU列表">
                <el-table border :data="skuArr">
                    <el-table-column label="SKU名字" prop="skuName"></el-table-column>
                    <el-table-column label="SKU价格" prop="price"></el-table-column>
                    <el-table-column label="SKU重量" prop="weight"></el-table-column>
                    <el-table-column label="SKU图片">
                        <template #="{ row, $index }">
                            <img :src="row.skuDefaultImg" alt="" style="height: 100px; weight:100px">
                        </template>
                    </el-table-column></el-table>
            </el-dialog>
        </el-card>
    </div>
</template>

<script setup lang='ts'>
import { ref, watch, onBeforeMount } from 'vue'
import { reqSpuInfo, reqSkuList, reqRemoveSpu } from '@/api/product/spu/spu.ts'
import useCategoryStore from '@/store/modules/category';
import type { HasSpuResponseData, Records, SkuData, SkuInfoData, SpuData } from "@/api/product/spu/type"
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import { ElMessage } from 'element-plus';

// 0显示已有SPU，1添加或者修改已有SPU 2添加SKU
let scene = ref<number>(0)
let pageNO = ref<number>(1)
let limit = ref<number>(3)
let total = ref<number>(0)

let records = ref<Records>([])

let categoryStore = useCategoryStore()

//获取子组件实例SpuForm
let spu = ref<any>();
//获取子组件实例SkuForm
let sku = ref<any>();

onBeforeMount(() => {
    // 路由组件切换，这个组件销毁的时候，要把存储在仓库中的分类相关的数据也清除掉
    categoryStore.$reset()
})

const getSpuInfo = async (pager = 1) => {
    // 保证c3id存在
    pageNO.value = pager
    if (categoryStore.c3Id) {
        let result: HasSpuResponseData = await reqSpuInfo(pageNO.value, limit.value, categoryStore.c3Id)
        console.log(result)
        if (result.code == 200) {
            records.value = result.data.records
            total.value = result.data.total
        }
    }
    else {
        return
    }

}

watch(() => categoryStore.c3Id, () => {
    getSpuInfo()
})

const changesize = () => {
    getSpuInfo()
}


const updateSpu = (row: SpuData) => {
    scene.value = 1
    // 不在这里发起请求，直接获取子组件实例，调用子组件的函数，让子组件发起请求，这样数据也不需要再次传递
    spu.value.initHasSpuDate(row)
}

// 子组件点击取消，切换场景
const changeScene = ({ flag, params }) => {
    scene.value = flag
    // 再次获取全部的已有SPU
    if (params == 'update')
        getSpuInfo(pageNO.value)
    else getSpuInfo()
}

const addSpu = () => {
    scene.value = 1
    // 调用子组件的方法,并传入3级id
    spu.value.initAddSpu(categoryStore.c3Id)
}

const addSku = (row: SpuData) => {
    scene.value = 2
    console.log(row)
    // 调用子组件的方法初始化添加SKU的数据（比如有哪些属性）
    sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, categoryStore.c3Id, row)

}

let skuArr = ref<SkuData[]>([])
let show = ref<boolean>(false)
const findSku = async (row: SpuData) => {
    let result: SkuInfoData = await reqSkuList(row.id)
    if (result.code == 200) {
        skuArr.value = result.data
        show.value = true
    }
}

const deleteSku = async (row: SpuData) => {
    let result = await reqRemoveSpu(row.id)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'

        })
        getSpuInfo(pageNO.value)
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'

        })
    }

}
</script>



<style scoped lang='scss'></style>
