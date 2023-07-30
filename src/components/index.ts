// import { ElementPlus } from 'element-plus';

// 自定义组件
import SvgIcon from "./SvgIcon/SvgIcon.vue";
import Category from './Category/index.vue'
import Mychart from "./Echarts/Chart.vue";
// 引入element提供的所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const allGloabelComponent = { SvgIcon, Category, Mychart }
export default {
    install(app: any) {
        Object.keys(allGloabelComponent).forEach(key => {
            app.component(key, allGloabelComponent[key])
        });
        // 把element-plus提供的图标所有组件都注册为全局组件
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
        }
    }
}