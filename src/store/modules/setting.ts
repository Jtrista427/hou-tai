// 关于layout组件相关的仓库
import { defineStore } from "pinia";

let useLayoutSettingStore = defineStore('SettingStore', {
    state: () => {
        return {
            fold: false, //用于控制折叠
            refresh: false //刷新组件
        }
    },
})

export default useLayoutSettingStore