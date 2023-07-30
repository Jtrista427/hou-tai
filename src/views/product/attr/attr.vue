<template>
    <div>
        <!-- 修改界面的时候，分类就不能再变了 -->
        <Category :scene="scene"></Category>
        <el-card class="cardStyle">
            <div v-show="scene == 0">
                <el-button type="primary" size="default" icon="Plus" :disabled="!CategoryStore.c3Id" @click="addAttr"
                    v-has="`btn.Attr.add`">添加平台属性</el-button>
                <el-table border style="margin: 10px 0px;" :data="attrArr">
                    <el-table-column label="序号" align="center" type="index" width="80px"></el-table-column>
                    <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
                    <el-table-column label="属性值名称">
                        <!-- row代表每个属性对象 -->
                        <template #="{ row, $index }">
                            <el-tag style="margin:5px" v-for="(item, index) in row.attrValueList" :key="item.id">{{
                                item.valueName }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120px">
                        <template #="{ row, $index }">
                            <el-button type="primary" size="small" icon="Edit" @click="updateAttr(row)"
                                v-has="`btn.Attr.update`"></el-button>
                            <el-button type="primary" size="small" icon="Delete" @click="deleteAttr(row.id)"
                                v-has="`btn.Attr.remove`"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="scene == 1">
                <el-form :inline="true">
                    <el-form-item label="属性名称">
                        <el-input placeholder="请输入属性名称" v-model="attrParms.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <el-button :disabled="!attrParms.attrName" type="primary" icon="Plus"
                    @click="addAttrValue">添加属性值</el-button>
                <el-button @click="cancel">取消</el-button>
                <el-table style="margin:10px 0" border :data="attrParms.attrValueList">
                    <el-table-column label="序号" width="80px" align="center" type="index">
                    </el-table-column>
                    <el-table-column label="属性值">
                        <template #="{ row, $index }">
                            <!-- 绑定的不是attrParms.attrName.valueName row就是attrName中的每一个对象元素 -->
                            <!-- ref写成函数的形式就可以接收当前实例作为参数 -->
                            <el-input placeholder="请输入属性值名称" v-model="row.valueName" v-if="row.flag"
                                @blur="toLook(row, $index)" :ref="(vc: any) => inputArr[$index] = vc"></el-input>
                            <!-- 编辑和查看模式切换 -->
                            <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template #="{ row, $index }">
                            <el-button type="primary" size="small" icon="Delete"
                                @click="attrParms.attrValueList.splice($index, 1)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" @click="save">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script setup lang='ts'>
import { watch, reactive, ref, nextTick, onBeforeMount } from 'vue'
import useCategoryStore from '@/store/modules/category'
import { reqAttrInfoList, reqAddOrUpdateAttr, reqDeleteAttr } from '@/api/product/attr/attr'
import { AttrResponseData, AttrList, Attrvalue } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'
let CategoryStore = useCategoryStore()

// 用reactive，attrArr是个响应式数据,那么直接使用attrArr=会覆盖响应式
// 解决办法：let attrArr = reactive<AttrList>({data:[]})
// attrArr.data= 这样就是修改响应式数据中的一个属性了，这也是为什么ref可以使用的原因，因为只改变了value
let attrArr = ref<AttrList>([])

onBeforeMount(() => {
    // 路由组件切换，这个组件销毁的时候，要把存储在仓库中的分类相关的数据也清除掉
    CategoryStore.$reset()
})

// 获取已有属性值和方法
const getAttr = async () => {
    const { c1Id, c2Id, c3Id } = CategoryStore
    let result: AttrResponseData = await reqAttrInfoList(c1Id, c2Id, c3Id)
    if (result.code == 200) {
        attrArr.value = result.data
    }
}
// 监听三级Id，发起获取数据请求
watch(() => CategoryStore.c3Id, () => {
    // 变化了要清空上一次查询的结果
    attrArr.value = []
    // 可能变空，要保证三级分类存在
    // if (CategoryStore.c3Id) {
    //     getAttr()
    // }
    if (!CategoryStore.c3Id) return;
    //获取分类的ID
    getAttr();
})

// 使用场景切换，两个盒子，不同场景下显示不同
let scene = ref<number>(0) //0展示table，1展示添加和修改属性的结构
// 收集新增的属性数据
let attrParms = reactive({
    attrName: "",
    attrValueList: [],
    categoryId: '',
    categoryLevel: 3
})
const addAttr = () => {
    // 每一次点击的时候，都清空之前收集的数据
    Object.assign(attrParms, {
        attrName: "",
        attrValueList: [],
        categoryId: CategoryStore.c3Id, //3级分类的ID
        categoryLevel: 3
    })
    scene.value = 1
}
const updateAttr = (row: Attrvalue) => {
    debugger
    scene.value = 1
    // 让页面显示已有参数,同时id什么都带过来了
    // 不要使用浅拷贝,attrParms修改会导致row的修改，这样点击取消返回页面看起来就像修改成功一样
    Object.assign(attrParms, JSON.parse(JSON.stringify(row)))


}

const cancel = () => {
    scene.value = 0
}

const addAttrValue = () => {
    // 点击添加属性值按钮，就向对应数组添加一个对象，然后添加对应插槽
    attrParms.attrValueList.push({
        valueName: '',
        flag: true,// 控制每一个属性值的编辑模式和切换模式
    })
    // 获取最后的input组件聚焦
    nextTick(() => {
        inputArr.value[attrParms.attrValueList.length - 1].focus()
    })
}

// 收集3级分类ID，并发起请求
const save = async () => {
    // 保证有属性值才发起请求
    if (attrParms.attrValueList.length > 0 && attrParms.attrValueList[0].valueName !== '') {
        let result = await reqAddOrUpdateAttr(attrParms)
        console.log(result)
        if (result.code == 200) {
            scene.value = 0
            ElMessage({
                type: 'success',
                message: attrParms.id ? '修改成功' : '添加成功'
            })
            // 重新获取已有属性
            getAttr()
        }
        else {
            ElMessage({
                type: 'error',
                message: attrParms.id ? '修改失败' : '添加失败'
            })
        }
    }
    else {
        ElMessage({
            type: 'error',
            message: '属性值不能为空！'
        })
    }
}

const toLook = (row: Attrvalue, $index: number) => {
    // 1.不能为空 要保证有值，否则div都没有高度，都点不回来了
    if (row.valueName.trim() == '') {
        // 删除属性值为空的元素
        attrParms.attrValueList.splice($index, 1)
        ElMessage({
            type: 'error',
            message: '属性值不能为空'
        })
        return
    }
    // 2.不能重复
    let repeat = attrParms.attrValueList.find((item) => {
        // 要把当前失去焦点的属性值从当前数组去除再判断
        if (item != row) {
            return item.valueName === row.valueName
        }
    })
    if (repeat) {
        attrParms.attrValueList.splice($index, 1)
        ElMessage({
            type: 'error',
            message: '属性值不能为重复'
        })
        return
    }
    row.flag = false
}

// 获取组件实例的数组
let inputArr = ref<any>([])
const toEdit = (row, $index) => {
    row.flag = true
    // 点击就聚焦，不用nexttick不能立马获取到inputarr中的数据
    nextTick(() => {
        inputArr.value[$index].focus()
    })
}

const deleteAttr = async (attrid: number) => {
    let result = await reqDeleteAttr(attrid)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        getAttr()
    }
    else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }

}

</script>


<script lang='ts'>
export default {
    name: 'attr'
}
</script>

<style scoped lang='scss'>
.cardStyle {
    margin: 10px 0;
}
</style>
