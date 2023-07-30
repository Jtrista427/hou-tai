import pinia from '@/store'
import useuserStore from '@/store/modules/user'
// 获取用户仓库
let userStore = useuserStore(pinia)
export const isHasButton = (app: any) => {
    // 全局自定义指令
    app.directive('has', {
        // 代表使用这个全局自定义指令的dom挂载完毕的时候就执行一次
        mounted(el: any, option) {
            // el是使用这个的组件或者dom，option.value可以拿到使用指令时候右侧的值
            if (!userStore.buttons.includes(option.value)) {
                el.parentNode.removeChild(el)
            }
        },

    })
}