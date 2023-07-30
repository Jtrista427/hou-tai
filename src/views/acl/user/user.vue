<template>
    <el-card style="height: 80px;">
        <el-form :inline="true" class="form">
            <el-form-item label="用户名:">
                <el-input placeholder="请你输入搜索用户名" v-model="keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="default" :disabled="keyword ? false : true" @click="search">搜索</el-button>
                <el-button type="primary" size="default" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 0px;">
        <el-button type="primary" size="default" @click="addUser" v-has="`btn.User.add`">添加用户</el-button>
        <el-button type="primary" size="default" :disabled="selectIdArr.length ? false : true" @click="deleteSelectUser"
            v-has="`btn.User.remove`">批量删除</el-button>
        <!-- table展示用户信息 -->
        <!--selection-change 复选框勾线的时候会差分  -->
        <el-table style="margin: 10px 0px;" border :data="userArr" @selection-change="selectChange">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="#" align="center" type="index"></el-table-column>
            <el-table-column label="ID" align="center" prop="id"></el-table-column>
            <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template #="{ row, $index }">
                    <el-button type="primary" size="small" icon="User" @click="setRole(row)"
                        v-has="`btn.User.assgin`">分配角色</el-button>
                    <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)"
                        v-has="`btn.User.update`">编辑</el-button>
                    <el-popconfirm :title="`你确定要删除${row.username}?`" width="260px" @confirm="deleteUser(row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" icon="Delete" v-has="`btn.User.remove`">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
            :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasUser"
            @size-change="getHasUser" />
    </el-card>
    <!-- 抽屉结构:完成添加新的用户账号|更新已有的账号信息 -->
    <el-drawer v-model="drawer">
        <template #header>
            <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
        </template>
        <template #default>
            <el-form :model="userParams" :rules="rules" ref="formRef">
                <el-form-item label="用户姓名" prop="username">
                    <el-input placeholder="请您输入用户姓名" v-model="userParams.username"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="name">
                    <el-input placeholder="请您输入用户昵称" v-model="userParams.name"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
                    <el-input placeholder="请您输入用户密码" v-model="userParams.password"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="save">确定</el-button>
            </div>
        </template>
    </el-drawer>
    <!-- 抽屉结构:用户某一个已有的账号进行职位分配 -->
    <el-drawer v-model="drawer1">
        <template #header>
            <h4>分配角色(职位)</h4>
        </template>
        <template #default>
            <el-form>
                <el-form-item label="用户姓名">
                    <el-input v-model="userParams.username" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="职位列表">
                    <!--  v-model 控制是否全选
                    indeterminate设置不确定时候的样式（有的勾，有的不勾的时候的显示)
                    change事件，就是点击全选框的时候的事件，会收到一个boolean值表示全选状态
                -->
                    <el-checkbox @change="handleCheckAllChange" v-model="checkAll"
                        :indeterminate="isIndeterminate">全选</el-checkbox>
                    <!-- 显示职位的的复选框，change事件收到当前已勾选的数据 -->
                    <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
                        <!-- label是 checkbox-group收集的数据-->
                        <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">{{ role.roleName
                        }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="drawer1 = false">取消</el-button>
                <el-button type="primary" @click="confirmClick">确定</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang='ts'>
import useLayOutSettingStore from '@/store/modules/setting'
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqSelectUser, reqRemoveUser, reqUserInfo, reqAddOrUpdateUser, reqAllRole, reqSetUserRole } from '@/api/acl/user/user'
import type { SetRoleData, UserResponseData, Records, User, AllRoleResponseData, AllRole } from '@/api/acl/user/type';
import { ElMessage } from 'element-plus';
let pageNo = ref<number>(0)
let pageSize = ref<number>(5)
let total = ref<number>(0)
let keyword = ref<string>('')
let userArr = ref<Records>([])

const getHasUser = async (pager = 1) => {
    pageNo.value = pager
    let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyword.value);
    if (result.code == 200) {
        total.value = result.data.total;
        userArr.value = result.data.records;
    }
}

onMounted(() => {
    getHasUser();
});

let drawer = ref<boolean>(false)
let userParams = reactive<User>({
    username: '',
    name: '',
    password: ''
})
//校验用户名字回调函数
const validatorUsername = (rule: any, value: any, callBack: any) => {
    //用户名字|昵称,长度至少五位
    if (value.trim().length >= 5) {
        callBack();
    } else {
        callBack(new Error('用户名字至少五位'))
    }
}
//校验用户名字回调函数
const validatorname = (rule: any, value: any, callBack: any) => {
    //用户名字|昵称,长度至少五位
    if (value.trim().length >= 5) {
        callBack();
    } else {
        callBack(new Error('用户昵称至少五位'))
    }
}
const validatorPassword = (rule: any, value: any, callBack: any) => {
    //用户名字|昵称,长度至少五位
    if (value.trim().length >= 6) {
        callBack();
    } else {
        callBack(new Error('用户密码至少六位'))
    }
}
//表单校验的规则对象
const rules = {
    // 不要用change，不然当初始化清空数据的时候，也会触发表单校验
    //用户名字
    username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
    //用户昵称
    name: [{ required: true, trigger: 'blur', validator: validatorname }],
    //用户的密码
    password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}
const addUser = () => {
    drawer.value = true
    // 清空数据
    Object.assign(userParams, {
        id: 0,
        username: '',
        name: '',
        password: ''
    })
    //清除上一次的错误的提示信息
    nextTick(() => {
        // 一开始是没有formRef，只有点击添加用户之后，渲染之后才有这个
        formRef.value.clearValidate('username');
        formRef.value.clearValidate('name');
        formRef.value.clearValidate('password');
    });

}

const cancel = () => {
    drawer.value = false
}
//获取form组件实例
let formRef = ref<any>();
const save = async () => {
    //点击保存按钮的时候,务必需要保证表单全部复合条件在去发请求
    await formRef.value.validate()
    //保存按钮:添加新的用户|更新已有的用户账号信息
    let result: any = await reqAddOrUpdateUser(userParams as User);
    console.log(result)
    if (result.code == 200) {
        drawer.value = false;
        ElMessage({ type: 'success', message: userParams.id ? '更新成功' : '添加成功' });
        // getHasUser(userParams.id ? pageNo.value : 1);
        // 浏览器自动刷新，为了防止修改了当前登陆的账号信息后，右上角的用户信息还是原来的
        // 如果修改的不是登陆的账号，刷新后只是重新发起请求
        // 否则，会跳到登录页（路由鉴权那里）
        window.location.reload();
    }
    else {
        //关闭抽屉
        drawer.value = false;
        //提示消息
        ElMessage({ type: 'error', message: userParams.id ? '更新失败' : '添加失败' });
    }
}

const updateUser = async (row: User) => {
    drawer.value = true;
    // row中包含id
    Object.assign(userParams, row)
    //清除上一次的错误的提示信息
    nextTick(() => {
        formRef.value.clearValidate('username');
        formRef.value.clearValidate('name');
    });
}

//收集顶部复选框全选数据
let checkAll = ref<boolean>(false);
//控制顶部全选复选框不确定的样式
const isIndeterminate = ref<boolean>(true);
//存储全部职位的数据
let allRole = ref<AllRole>([]);
//当前用户已有的职位
let userRole = ref<AllRole>([]);
// 分配角色
let drawer1 = ref<boolean>(false)
const setRole = async (row: User) => {
    drawer1.value = true
    Object.assign(userParams, row)
    let result: AllRoleResponseData = await reqAllRole(row.id)
    if (result.code == 200) {
        allRole.value = result.data.allRolesList
        userRole.value = result.data.assignRoles;
    }
}

const handleCheckAllChange = (val: boolean) => {
    userRole.value = val ? allRole.value : [];
    isIndeterminate.value = false
}

const handleCheckedCitiesChange = (value: string[]) => {
    checkAll.value = value.length === allRole.value.length
    isIndeterminate.value = value.length !== allRole.value.length
}

const confirmClick = async () => {
    // 收集参数
    let data: SetRoleData = {
        userId: userParams.id,
        roleIdList: userRole.value.map(item => {
            return item.id
        })
    }
    let result: any = await reqSetUserRole(data);
    if (result.code == 200) {
        //提示信息
        ElMessage({ type: 'success', message: '分配职务成功' });
        //关闭抽屉
        drawer1.value = false;
        //获取更新完毕用户的信息,更新完毕留在当前页
        getHasUser(pageNo.value);
    }
}

const deleteUser = async (id: number) => {
    let result: any = await reqRemoveUser(id);
    if (result.code == 200) {
        ElMessage({ type: 'success', message: '删除成功' });
        getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
    }
}
//准备一个数组存储批量删除的用户的ID
let selectIdArr = ref<User[]>([]);
// value就是已经勾选的数据
const selectChange = (value: any) => {
    selectIdArr.value = value

}

const deleteSelectUser = async () => {
    //整理批量删除的参数
    let idsList: any = selectIdArr.value.map(item => {
        return item.id;
    });
    //批量删除的请求
    let result: any = await reqSelectUser(idsList);
    if (result.code == 200) {
        ElMessage({ type: 'success', message: '删除成功' });
        getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
    }
}

const search = () => {
    getHasUser();
    keyword.value = '';
}

//获取模板setting仓库
let settingStore = useLayOutSettingStore();
//重置按钮在main里面使用v-if来删除以及重建来实现刷新
const reset = () => {
    settingStore.refresh = !settingStore.refresh;
}


</script>

<style scoped lang='scss'></style>
