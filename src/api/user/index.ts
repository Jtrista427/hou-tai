// 统一管理用户相关的接口
import request from "@/utils/request";

// 使用mock时候,定义的数据类型都得按服务器重写
import type { loginFormData, loginResponseData, userInfoResponseData } from "./type";
// // import type只会从模块中获取类型信息
// enum API {
//     LOGIN_URL = "/user/login",
//     USERINFO_URL = "/user/info"
// }

// export const reqLgin = (data: loginForm) => request.post<any, loginResponseData>(API.LOGIN_URL, data)
// export const reqUserInfo = () => request.get<any, userResponseDate>(API.USERINFO_URL)

enum API {
    LOGIN_URL = "/admin/acl/index/login",
    USERINFO_URL = "/admin/acl/index/info",
    LOGOUT_URL = "/admin/acl/index/logout"
}

export const reqLgin = (data: loginFormData) => request.post<any, loginResponseData>(API.LOGIN_URL, data)
export const reqUserInfo = () => request.get<any, userInfoResponseData>(API.USERINFO_URL)
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)