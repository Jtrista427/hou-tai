<template>
    <el-form label-width="100px">
        <el-form-item label="SPU名称">
            <el-input placeholder="请输入SPU名称" v-model="SpuParams.spuName"></el-input>
        </el-form-item>
        <el-form-item label="SPU品牌">
            <el-select v-model="SpuParams.tmId">
                <el-option v-for="(item, index) in AllTradeMark" :key="item.id" :label="item.tmName"
                    :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input type="textarea" placeholder="请输入SPU描述" v-model="SpuParams.description"></el-input>
        </el-form-item>
        <el-form-item label="SPU照片">
            <!-- v-model:file-list 默认上传文件，有定义类型，需要name和url
            action是上传图片的接口
            list-type 文件展示类型
            on-preview
            -->
            <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
        </el-form-item>
        <el-form-item label="SPU销售属性">
            <el-select :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '无'"
                v-model="saleAttrIdAndValueName">
                <el-option v-for="(item, index) in unSelectSaleAttr" :key="item.id"
                    :value="`${item.id}:${item.name}`"></el-option>
            </el-select>
            <el-button type="primary" icon="Plus" style="margin-left: 10px;" :disabled="!unSelectSaleAttr.length"
                @click="addSaleAttr">
                添加属性</el-button>
            <el-table border style="margin: 10px 0;" :data="saleAttr">
                <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="销售属性名字" width="120px" prop="saleAttrName"></el-table-column>
                <el-table-column label="销售属性值">
                    <template #="{ row, $index }">
                        <el-tag style="margin:0px 5px" v-for="(tag, index) in row.spuSaleAttrValueList" :key="tag.id"
                            class="mx-1" closable @close="row.spuSaleAttrValueList.splice(index, 1)">{{
                                tag.saleAttrValueName
                            }}</el-tag>
                        <el-button v-if="!row.flag" @click="toEdit(row)" type="primary" size="small"
                            icon="Plus"></el-button>
                        <el-input v-else @blur="toLook(row)" v-model="row.saleAttrValue" placeholder="请你输入属性值" size="small"
                            style="width:100px"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <!-- 这里要用插槽是为了获取当前的数据index，以便于删除当前数据 -->
                    <template #="{ row, $index }">
                        <el-button type="primary" size="small" icon="Delete"
                            @click="saleAttr.splice($index, 1)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" el-button :disabled="saleAttr.length > 0 ? false : true" @click="save">保存</el-button>
            <el-button type="primary" @click="cancel">取消</el-button>
        </el-form-item>

    </el-form>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue';
import { reqAllTradeMark, reqSpuImageList, reqSpuHasSaleAttr, reqAllSaleAttr, reqAddOrUpdateSpu } from '@/api/product/spu/spu'
import type { SpuData, SaleAttrValue, HasSaleAttr, SaleAttr, SpuImg, Trademark, AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData } from '@/api/product/spu/type';
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
let $emit = defineEmits(['changeScene'])
const cancel = () => {
    // 为了符合后面修改的参数
    $emit('changeScene', { flag: 0, params: 'update' })
}
let AllTradeMark = ref<Trademark[]>([]);
//商品图片
let imgList = ref<SpuImg[]>([]);
//已有的SPU销售属性
let saleAttr = ref<SaleAttr[]>([]);
//全部销售属性
let allSaleAttr = ref<HasSaleAttr[]>([]);
// 存储已有的SPU对象
// 在这里只是收集新增的时候需要的数据
let SpuParams = ref<SpuData>({
    category3Id: "",
    spuName: "",
    description: "",
    tmId: "",
    spuImageList: [],
    spuSaleAttrList: [],
})
const initHasSpuDate = async (spu: SpuData) => {
    SpuParams.value = spu
    // spu就是点击的那个SPU对象，不完整，在这里发请求获取完整数据
    // 收集品牌
    let result: AllTradeMark = await reqAllTradeMark()
    AllTradeMark.value = result.data
    // 收集图片
    let result1: SpuHasImg = await reqSpuImageList((spu.id));
    imgList.value = result1.data.map(item => {
        // 修改格式以匹配element的定义类型
        return {
            name: item.imgName,
            url: item.imgUrl
        }
    })
    //获取已有的SPU销售属性的数据
    let result2: SaleAttrResponseData = await reqSpuHasSaleAttr((spu.id));
    saleAttr.value = result2.data
    //获取整个项目全部SPU的销售属性
    let result3: HasSaleAttrResponseData = await reqAllSaleAttr();
    allSaleAttr.value = result3.data
}


// 控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 存储预览图片的地址
let dialogImageUrl = ref<string>('')
// 图片点击预览的时候触发
const handlePictureCardPreview = (file: any) => {
    // 会注入当前预览的图片地址
    dialogVisible.value = true
    dialogImageUrl.value = file
}
// 照片墙删除图片的钩子
const handleRemove = () => {
    // 不需要写回调，因为已经v-model动态绑定了文件
}
// 对上传图片进行格式限制
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

// 计算出当前SPU还未拥有的销售属性，即可以添加的属性
let unSelectSaleAttr = computed(() => {
    let unSelectArr = allSaleAttr.value.filter(item => {
        // 仅保留，allSaleAttr中有，但是saleAttr中没有的属性
        return saleAttr.value.every(item1 => {
            return item.name != item1.saleAttrName
        })
    })
    return unSelectArr;
})

//将来收集还未选择的销售属性的ID与属性值的名字
let saleAttrIdAndValueName = ref<string>('')

// 添加销售属性
const addSaleAttr = () => {
    /*必须有的字段
    "baseSaleAttrId": number,
    "saleAttrName": string,
    "spuSaleAttrValueList": SpuSaleAttrValueList
    */
    const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
    //准备一个新的销售属性对象:将来带给服务器即可
    let newSaleAttr: SaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
    }
    //追加到数组当中
    saleAttr.value.push(newSaleAttr);
    //清空收集的数据
    saleAttrIdAndValueName.value = '';
}
// 新增属性值
const toEdit = (row: SaleAttr) => {
    row.flag = true;
    //直接在row新增字段，而不是在spuSaleAttrValueList中新增了一个数组，在blur的时候再push到数组中，因为需要整理参数
    row.saleAttrValue = ''
}

const toLook = (row: SaleAttr) => {
    //整理收集的属性的ID与属性值的名字
    const { baseSaleAttrId, saleAttrValue } = row;
    //整理成服务器需要的属性值形式
    let newSaleAttrValue: SaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: (saleAttrValue as string)
    }
    // 收集数据不合法
    if ((saleAttrValue as string).trim() == '') {
        ElMessage({
            type: 'error',
            message: '属性值不能为空的'
        })
        return;
    }
    //判断属性值是否在数组当中存在
    let repeat = row.spuSaleAttrValueList.find(item => {
        return item.saleAttrValueName == saleAttrValue;
    })

    if (repeat) {
        ElMessage({
            type: 'error',
            message: '属性值重复'
        })
        return;
    }

    //追加新的属性值对象
    row.spuSaleAttrValueList.push(newSaleAttrValue);
    //切换为查看模式
    row.flag = false;
}

// 保存
const save = async () => {
    // 整理参数
    // 发送请求
    // 照片墙的数据
    SpuParams.value.spuImageList = imgList.value.map((item: any) => {
        return {
            imgName: item.name,
            // 新增的图片应该保存服务器返回的地址而不是本地地址
            imgUrl: (item.response && item.response.data) || item.url
        }
    })
    // 销售属性的属性
    SpuParams.value.spuSaleAttrList = saleAttr.value
    let result = await reqAddOrUpdateSpu(SpuParams.value);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: SpuParams.value.id ? '更新成功' : '添加成功'
        })
        //通知父组件切换场景为0，通知告知父亲是更新还是修改，修改要留在当前页数，更新返回第一页
        $emit('changeScene', { flag: 0, params: SpuParams.value.id ? 'update' : 'add' });
    } else {
        ElMessage({
            type: 'error',
            message: SpuParams.value.id ? '更新失败' : '添加失败'
        })
    }
}

// 添加一个新的SPU初始化的方法
const initAddSpu = async (c3Id: number | string) => {
    //每次开头清空数据
    Object.assign(SpuParams.value, {
        category3Id: "",//收集三级分类的ID
        spuName: "",//SPU的名字
        description: "",//SPU的描述
        tmId: '',//品牌的ID
        spuImageList: [],
        spuSaleAttrList: [],
    });
    //清空照片
    imgList.value = [];
    //清空销售属性
    saleAttr.value = [];
    saleAttrIdAndValueName.value = '';
    // 先修改在新增就会有id，需要手动清空
    SpuParams.id = ''
    //存储三级分类的ID
    SpuParams.value.category3Id = c3Id;
    //获取全部品牌的数据
    let result: AllTradeMark = await reqAllTradeMark();
    // 获取全部销售属性
    let result1: HasSaleAttrResponseData = await reqAllSaleAttr();
    AllTradeMark.value = result.data;
    allSaleAttr.value = result1.data;

}

// 对外暴露
defineExpose({ initHasSpuDate, initAddSpu })

</script>

<style scoped lang='scss'></style>
