// 封装本地存储数据方法
export const SET_TOKEN = (token: string) => {
    localStorage.setItem("TOKEN", token)
}

export const GET_TOKEN = (keyword: string) => {
    return localStorage.getItem(keyword)
}

export const SET_User = (username: string, avatar: string) => {
    localStorage.setItem("USERNAME", username);
    localStorage.setItem("AVATAR", avatar)
}