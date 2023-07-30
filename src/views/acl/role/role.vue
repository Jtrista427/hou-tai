<template>
    <el-card>
        <el-form :inline="true" class="form">
            <el-form-item label="职位搜索">
                <el-input placeholder="请你输入搜索职位关键字" v-model="keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="default" :disabled="keyword ? false : true" @click="search">搜索</el-button>
                <el-button type="primary" size="default" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 0px;">
        <el-button type="primary" size="default" icon="Plus" @click="addRole" v-has="`btn.Role.add`">添加职位</el-button>
        <el-table border style="margin: 10px 0px;" :data="allRole">
            <el-table-column type="index" align="center" label="#"></el-table-column>
            <el-table-column label="ID" align="center" prop="id"></el-table-column>
            <el-table-column label="职位名称" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" show-overflow-tooltip prop="createTime"></el-table-column>
            <el-table-column label="更新时间" align="center" show-overflow-tooltip prop="updateTime"></el-table-column>
            <el-table-column label="操作" width="280px" align="center">
                <!-- row:已有的职位对象 -->
                <template #="{ row, $index }">
                    <el-button type="primary" size="small" icon="User" @click="setPermisstion(row)"
                        v-has="`btn.Role.assgin`">分配权限</el-button>
                    <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)"
                        v-has="`btn.Role.update`">编辑</el-button>
                    <el-popconfirm :title="`你确定要删除${row.roleName}?`" width="260px" @confirm="removeRole(row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" icon="Delete" v-has="`btn.Role.remove`">删除</el-button>
                        </template>
                    </el-popconfirm>

                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
            :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getRole"
            @size-change="getRole" />
    </el-card>
    <!-- 添加职位与更新已有职位的结构:对话框 -->
    <el-dialog v-model="dialogVisite" :title="RoleParams.id ? '更新职位' : '添加职位'">
        <el-form :model="RoleParams" ref="form">
            <el-form-item label="职位名称" prop="roleName">
                <el-input placeholder="请你输入职位名称" v-model="RoleParams.roleName"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" size="default" @click="dialogVisite = false">取消</el-button>
            <el-button type="primary" size="default" @click="save">确定</el-button>
        </template>
    </el-dialog>
    <!-- 抽屉组件:分配职位的菜单权限与按钮的权限 -->
    <el-drawer v-model="drawer">
        <template #header>
            <h4>分配菜单与按钮的权限</h4>
        </template>
        <template #default>
            <!-- 树形控件
                 default-expand-all默认展开所有层级
                 default-checked-keys 默认勾线的节点
                 props：配置选项
             -->
            <el-tree ref="tree" :data="menuArr" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="selectArr" :props="defaultProps" />
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="drawer = false">取消</el-button>
                <el-button type="primary" @click="handler">确定</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang='ts'>
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqRemoveRole, reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList, reqSetPermisstion } from '@/api/acl/role/role';
import type { RoleResponseData, Records, RoleData, MenuResponseData, MenuList } from '@/api/acl/role/type'
import useLayOutSettingStore from '@/store/modules/setting';
import { ElMessage } from 'element-plus';
let settingStore = useLayOutSettingStore();
let keyword = ref<string>('')
//当前页码
let pageNo = ref<number>(1);
//一页展示几条数据
let pageSize = ref<number>(10);
//存储全部已有的职位
let allRole = ref<Records>([]);
//职位总个数
let total = ref<number>(0);
//收集新增岗位数据
let RoleParams = reactive<RoleData>({
    roleName: ''
})
const getRole = async (pager = 1) => {
    pageNo.value = pager
    let result: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value);
    if (result.code == 200) {
        total.value = result.data.total;
        allRole.value = result.data.records;
    }
}

onMounted(() => {
    getRole()
})

let dialogVisite = ref<boolean>(false)
let form = ref<any>();
const addRole = () => {
    dialogVisite.value = true

    Object.assign(RoleParams, {
        roleName: '',
        id: 0
    });
    //清空上一次表单校验错误结果
    nextTick(() => {
        form.value.clearValidate('roleName');
    })

}
const save = async () => {
    if (RoleParams.roleName.trim() == '') {
        ElMessage({ type: 'error', message: '职位不能为空！' });
        return;
    }
    let result = await reqAddOrUpdateRole(RoleParams)
    if (result.code == 200) {
        //提示文字
        ElMessage({ type: 'success', message: RoleParams.id ? '更新成功' : '添加成功' });
        //对话框显示
        dialogVisite.value = false;
        //再次获取全部的已有的职位
        getRole(RoleParams.id ? pageNo.value : 1);
    }

}
const updateRole = async (role: RoleData) => {
    dialogVisite.value = true
    Object.assign(RoleParams, role)
    nextTick(() => {
        form.value.clearValidate('roleName');
    })

}

//删除已有的职位
const removeRole = async (id: number) => {
    let result: any = await reqRemoveRole(id);
    if (result.code == 200) {
        //提示信息
        ElMessage({ type: 'success', message: '删除成功' });
        getRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1);
    }
}
//搜索按钮的回调
const search = () => {
    //再次发请求根据关键字
    getRole();
    keyword.value = '';
}
//重置按钮的回调
const reset = () => {
    settingStore.refresh = !settingStore.refresh;
}

// 权限管理
//准备一个数组:数组用于存储勾选的节点的ID(四级的)
let selectArr = ref<number[]>([]);
//定义数组存储用户权限的数据
let menuArr = ref<MenuList>([]);
//获取tree组件实例
let tree = ref<any>();
let drawer = ref<boolean>(false)

//树形控件的测试数据
const defaultProps = {
    children: 'children',
    label: 'name',
}
const setPermisstion = async (role: RoleData) => {
    drawer.value = true
    //收集当前要分类权限的职位的数据
    Object.assign(RoleParams, role);
    let result: MenuResponseData = await reqAllMenuList((RoleParams.id as number));
    if (result.code == 200) {
        menuArr.value = result.data;
        // 根据select属性
        selectArr.value = filterSelectArr(menuArr.value, []);
    }
}

// 应该从最低级开始过滤
const filterSelectArr = (allData: any, initArr: any) => {
    allData.forEach((item) => {
        if (item.select && item.level == 4) {
            initArr.push(item.id)
        }
        if (item.children && item.children.length > 0) {
            filterSelectArr(item.children, initArr)
        }
    })
    return initArr
}

const handler = async () => {
    //职位的ID
    const roleId = (RoleParams.id as number);
    //所有选中节点的ID,tree组件提供的方法
    let arr = tree.value.getCheckedKeys();
    let arr1 = tree.value.getHalfCheckedKeys();
    let permissionId = arr.concat(arr1);
    console.log("let me see", permissionId)
    let result: any = await reqSetPermisstion(roleId, permissionId);
    if (result.code == 200) {
        //抽屉关闭
        drawer.value = false;
        //提示信息
        ElMessage({ type: 'success', message: '分配权限成功' });
        //页面刷新
        window.location.reload();
    }
}
</script>

<style scoped lang='scss'></style>
