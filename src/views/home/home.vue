<template>
    <el-card>
        <!-- box样式写在card上，那么flex布局不起作用 -->
        <div class="box">
            <img :src="userStore.avatar" alt="" class="avatar">
            <div class="title">
                <h3>{{ getTime() }}好呀！ {{ userStore.username }}</h3>
            </div>
        </div>
    </el-card>
    <div class="bottoms">
        <SvgIcon name="welcome" width="600px" height="500px"></SvgIcon>
    </div>
</template>

<script setup lang='ts'>
// 获取仓库，请求用户信息
import useuserStore from '@/store/modules/user';
import { getTime } from '@/utils/time'
let userStore = useuserStore()
// import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
// let $router = useRouter()
// 不在这里获取用户信息了，不知道怎么使用async函数，转移到路由守卫当中
// 为了获得路由权限，需要在这里获取用户信息
onMounted(() => { userStore.userInfo() })
// async function getuserInfo() {
//     try { await userStore.userInfo() }
//     catch (error) {
//         // 获取用户信息失败，可能是token失效等原因
//         userStore.userLogout() //清空内容,重新返回登陆页
//         $router.push('/login')
//     }
// }


</script>


<style scoped lang='scss'>
.box {
    width: 100%;
    height: 100px;
    display: flex;


    .avatar {
        width: 100px;
        height: 100px;
        border-radius: 100px;
    }

    .title {
        font-size: 30px;
        margin-left: 20px;
        line-height: 100px;
    }
}

.bottoms {
    display: flex;
    justify-content: center;

}
</style>
