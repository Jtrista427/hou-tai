<template>
    <el-card class="box-card">
        <!-- 添加品牌按钮 -->
        <el-button type="primary" size="default" icon="Plus" @click="addTrademark"
            v-has="`btn.Trademark.add`">添加品牌</el-button>
        <!-- 表格组件 -->
        <el-table style="margin:10px 0" border :data="trademark">
            <!-- align是这一列的对齐方式 -->
            <!-- table-column默认展示用div，用props控制展示数据，也可以使用插槽,控制样式 -->
            <el-table-column label="序号" width='80px' align="center" type="index"></el-table-column>
            <el-table-column label="品牌名称">
                <template #="{ row, $index }">
                    <pre>{{ row.tmName }}</pre>
                </template>
            </el-table-column>
            <el-table-column label="品牌LOGO">
                <template #="{ row, $index }">
                    <img :src="row.logoUrl" alt="没有图片" style="width: 100px ; height:100px;">
                </template>
            </el-table-column>
            <el-table-column label="品牌操作">
                <template #="{ row, $index }">
                    <el-button type="primary" size="small" icon="Edit" @click="updateTrademark(row)"
                        v-has="`btn.Trademark.update`"></el-button>
                    <div v-has="`btn.Trademark.remove`" style="float:right">
                        <el-popconfirm :title="`您确定要删除${row.tmName}?`" width="250px" icon="Delete"
                            @confirm='removeTradeMark(row.id)'>
                            <template #reference>
                                <el-button type="primary" size="small" icon="Delete"></el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!--
        v-model:current-page="currentPage" 当前页码
        v-model:page-size 每一页展示数据条数
        :page-sizes 动态改变每一页展示的数据条数
        :background分页器按钮颜色
        layout设置分页器六个子组件布局调整,->表示顶到最右边
      -->
        <el-pagination v-model:current-page="pageNO" v-model:page-size="limit" :page-sizes="[3, 5, 7, 10]"
            :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total"
            @current-change="getHasTrademark" @size-change="sizeChange" />

    </el-card>

    <!-- 对话框组件 -->
    <!-- v-model：控制对话框显示与影藏 title左上角的标题 -->
    <el-dialog v-model="dialogFormVisible" :title="title + '品牌'">
        <el-form style="width:80%" :model="trademarkParms" :rules="rules" ref="formRef">
            <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                <el-input placeholder="请输入品牌名称" v-model="trademarkParms.tmName" />
            </el-form-item>
            <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
                <!-- action是上传图片至服务器的请求地址
                    before-upload是文件上传之前的钩子，可以限制文件格式和大小
                 -->
                <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
                    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="trademarkParms.logoUrl" :src="trademarkParms.logoUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
        </el-form>
        <!-- 具名插槽footer -->
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="cancel">取消</el-button>
                <el-button type="primary" @click="confirm">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template> 

<script setup lang='ts'>
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark/trademark'
import { TradeMarkResponseDate, Records, TradeMark } from '@/api/product/trademark/type'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
let pageNO = ref<number>(1)
let limit = ref<number>(3)
// 存储已有数据品牌数量
let total = ref<number>(0)
let trademark = ref<Records>([])
// 获取el-form组件实例
let formRef = ref()
// 将请求封装成一个函数，初始化，点击分页器的时候就调用即可
const getHasTrademark = async (pager = 1) => {
    pageNO.value = pager
    let result: TradeMarkResponseDate = await reqHasTrademark(pageNO.value, limit.value)
    total.value = result.data.total
    trademark.value = result.data.records
}
onMounted(() => {
    getHasTrademark()
})
// 页码发生改变时，就会触发
// 对于这个自定义事件，组件Pagination中回传了参数，即当前页码数，但这里没用到，就没写
// 直接将发送请求作为事件回调
// const changePageNo = () => {
//     getHasTrademark()
// }
// size-change 自定义事件同样会收到下拉菜单中的数据
const sizeChange = () => {
    // pageNO.value = 1 //数据发生变化，页码总数也会变化，直接让他归1 ,改换到getHasTrademark中,这里是个小trick
    getHasTrademark()
}

// 添加,修改品牌，使用element-plus 中的dialog组件
let dialogFormVisible = ref<boolean>(false)
// 收集品牌数据
let trademarkParms = reactive<TradeMark>({
    tmName: '',
    logoUrl: ''
})
let title = ref('添加')
const addTrademark = () => {
    title.value = ('添加')
    dialogFormVisible.value = true
    //第一种写法:ts的问号语法
    // formRef.value?.clearValidate('tmName');
    // formRef.value?.clearValidate('logoUrl');
    nextTick(() => {
        formRef.value.clearValidate('tmName');
        formRef.value.clearValidate('logoUrl');
    })
}


// 更新品牌需要id，添加品牌不需要
const updateTrademark = (row: TradeMark) => {
    title.value = ('更新')
    nextTick(() => {
        formRef.value.clearValidate('tmName');
        formRef.value.clearValidate('logoUrl');
    })
    dialogFormVisible.value = true
    // 展示已有品牌数据
    Object.assign(trademarkParms, row)
    // trademarkParms.tmName = row.tmName
    // trademarkParms.logoUrl = row.logoUrl
    // trademarkParms.id = row.id
}
const cancel = () => {
    dialogFormVisible.value = false
    // 清空框里面的内容
    trademarkParms.tmName = ''
    trademarkParms.logoUrl = ''
    trademarkParms.id = 0
}
const confirm = async () => {
    // 触发之前，对整个表单进行校验
    // await等待成功的结果，只有校验通过，才会进行后面的步骤
    await formRef.value.validate()
    let result = await reqAddOrUpdateTrademark(trademarkParms)
    if (result.code == 200) {
        // 弹出提示信息
        ElMessage({
            type: 'success',
            message: `${title.value}品牌成功`
        })
        // 再次发起请求，更新页面数据
        // 如果是更新，就要留在当前页
        getHasTrademark(trademarkParms.id ? pageNO.value : 1)
    } else {
        ElMessage({
            type: 'error',
            message: `${title.value}品牌失败`
        })
    }
    dialogFormVisible.value = false
    // 清空框里面的内容，可以在添加品牌的时候清空，这样不需要写两次,id也要清除，否则会一直保留
    trademarkParms.tmName = ''
    trademarkParms.logoUrl = ''
    trademarkParms.id = 0

}
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type == 'image/jpg' || rawFile.type == 'image/png' || rawFile.type == 'image/gif') {
        ElMessage.error('Avatar picture must be JPG/PNG/GIF format!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('Avatar picture size can not exceed 2MB!')
        return false
    }
    return true
}
// 图片上传成功的钩子
// response是这次上传图片请求返回的数据 uploadFile
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    // 收集图片的存储地址，以便向服务器发起请求
    trademarkParms.logoUrl = response.data
    // 图片上传成功，清理掉对应图片的校验结果，输入框的会自己清掉
    formRef.value.clearValidate('logoUrl')
}

// 表单校验规则
const validtmName = (rule: any, value: any, callBack: any) => {
    if (value.trim().length >= 2) { callBack() }
    else { callBack(new Error('品牌名称需要大于两位字符')) }
}
const validlogoUrl = (rule: any, value: any, callBack: any) => {
    // value是图片地址
    console.log(value)
    if (value) { callBack() }
    else { callBack(new Error('品牌LOGO必须上传')) }
}
const rules = {
    tmName: [{ required: true, trigger: 'blur', validator: validtmName }],
    // 图片不是表单元素，blur和change事件都没用，所以采用提供的对整个表单进行校验的方式，valideta()
    logoUrl: [{ required: true, validator: validlogoUrl }]
}

// 删除
const removeTradeMark = async (id: number) => {
    let result = await reqDeleteTrademark(id)
    if (result.code == 200) {
        // 弹出提示信息
        ElMessage({
            type: 'success',
            message: '删除品牌成功'
        })
        // 再次发起请求，更新页面数据
        // 判断当前页面的数据是否大于1
        getHasTrademark(trademark.value.length > 1 ? pageNO.value : pageNO.value - 1)
    } else {
        ElMessage({
            type: 'error',
            message: '删除品牌失败'
        })
    }
}

</script >


<style lang='scss'>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>

<style scoped lang='scss'>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
