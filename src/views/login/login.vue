<template>
    <div class="login-container">
        <el-row>
            <!-- 当屏幕是xs时，第一个盒子不显示 -->
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <el-form class="login_from" :model="loginForm" :rules="rules" ref="loginForms">
                    <h1>Hello</h1>
                    <h2>欢迎来到后台</h2>
                    <el-form-item prop="username">
                        <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password"
                            show-password='true'></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="login_btn" :loading="loading" color="#4169E1" @click="login">登陆</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang='ts'>
import { User, Lock } from '@element-plus/icons-vue'
// 收集表单数据
import { reactive, ref } from 'vue';
// 引入用户相关的小仓库
import useUserStore from '@/store/modules/user'
let useStore = useUserStore()
// 获取路由器
import { useRouter, useRoute } from 'vue-router';
let $router = useRouter()
let $route = useRoute()

import { ElNotification } from 'element-plus';
let loading = ref(false)
// 获取时间
import { getTime } from "@/utils/time"

// 获取el-form组件
let loginForms = ref()


let loginForm = reactive({ username: 'admin', password: "atguigu123" })
const login = async () => {
    // 保证表单验证通过再发请求，失败了就不会往下走
    await loginForms.value.validate()
    try {
        // loading.value = true  不写也会自己出现
        // 也可以写then语法
        // debugger
        await useStore.userLogin(loginForm)
        // console.log(result);
        // 判断登录的时候，路由是否有query参数
        let redirect: any = $route.query.redirect
        $router.push({ path: redirect || '/' })
        ElNotification({
            type: 'success',
            message: "欢迎回来",
            title: `HI,${getTime()}好`
        })


    } catch (error) {

        ElNotification({
            type: 'error',
            message: error.message
        })
    } finally {
        // 成功或者失败，加载效果消失
        loading.value = false
    }
}
// 定义表单校验需要的规则

const validUserName = (rule: any, value: any, callback: any) => {
    // rule为校验规则，value是文本的内容
    // callback：如果符合条件，callback放行
    // 不符合条件，也调用callback，注入错误信息
    if (/^\w{5,10}$/.test(value)) {
        callback()
    } else {
        callback(new Error('账号长度至少五位'))
    }

}
const validPassword = (rule: any, value: any, callback: any) => {
    if (/^\w{6,15}$/.test(value)) {
        callback()
    } else {
        callback(new Error('密码长度至少六位'))
    }
}
const rules = {
    username: [{ trigger: 'change', validator: validUserName }],
    password: [{ trigger: 'change', validator: validPassword }]
}
</script>

<style scoped lang='scss'>
.login-container {
    width: 100%;
    height: 100vh; //视窗的高度，还有vw
    background: url('../../assets/images/background.jpg') no-repeat;
    background-size: cover;

    .login_from {
        position: relative;
        width: 40%;
        top: 30vh;
        background: url('../../assets/images/login_form.png') no-repeat;
        background-color: cover;
        padding: 40px;

        h1 {
            color: #ffffff;
            font-size: 40px;
        }

        h2 {
            color: #ffffff;
            font-size: 25px;
            margin: 40px 0;
        }

        .login_btn {
            width: 100%;
        }
    }
}
</style>
