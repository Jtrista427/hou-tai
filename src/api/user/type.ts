import { loginResponseData } from '@/api/user/type';
// 定义数据类型
// 登陆接口所需参数
export interface loginFormData {
    username: string,
    password: string,
}

// 全部接口都有的返回数据类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean

}

// 定义登陆接口返回的数据类型
export interface loginResponseData extends ResponseData {
    data: string
}


// 定义用户信息数据类型
// interface userInfo {
//     userId: number,
//     avatar: string,
//     username: string,
//     password: string,
//     desc: string
//     roles: string[],
//     buttons: string[],
//     routes: string[],
//     token: string,

// }
// interface user {
//     checkUser: userInfo

// }
// export interface userResponseDate {
//     code: number,
//     data: user //user是个对象，里面要包含checkuser属性
// }
export interface userInfoResponseData extends ResponseData {
    data: {
        routes: string[],
        buttons: string[],
        roles: string[],
        name: string,
        avatar: string

    }
}