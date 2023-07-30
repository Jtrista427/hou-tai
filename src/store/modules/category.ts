import { defineStore } from "pinia";
import { reqC1, reqC2, reqC3 } from '@/api/product/attr/attr.ts'
import { CategoryResponseDate } from "@/api/product/attr/type";
import { CategoryState } from "./types";
let useCategoryStore = defineStore('Category', {
    state: (): CategoryState => {
        return {
            // 这里不需要定义let/const
            c1Id: '',
            c2Id: '',
            c3Id: '',
            C1List: [],
            C2List: [],
            C3List: [],
        }
    },
    actions: {
        async getC1() {
            let result: CategoryResponseDate = await reqC1()
            if (result.code == 200) {
                this.C1List = result.data
            }
        },

        async getC2() {
            let result: CategoryResponseDate = await reqC2(this.c1Id)
            console.log(result)
            if (result.code == 200) {
                this.C2List = result.data
            }
        },

        async getC3() {
            let result: CategoryResponseDate = await reqC3(this.c2Id)
            console.log(result)
            if (result.code == 200) {
                this.C3List = result.data
            }
        }
    }
})

export default useCategoryStore