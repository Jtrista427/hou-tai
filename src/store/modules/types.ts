// 定义小仓库数据类型
import type { RouteRecordRaw } from "vue-router";
import { CategoryObj } from "@/api/product/attr/type";
export interface userState {
    token: string | null;
    menuRoutes: RouteRecordRaw[],
    username: string,
    avatar: string,
    buttons: string[]
}

// 定义分类仓库的state对象类型
export interface CategoryState {
    c1Id: string | number,
    c2Id: string | number,
    c3Id: string | number,
    C1List: CategoryObj[],
    C2List: CategoryObj[],
    C3List: CategoryObj[]
}