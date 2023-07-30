import request from "@/utils/request";
import type { TradeMarkResponseDate, TradeMark } from './type'
enum API {
    TRADEMARK_URL = "/admin/product/baseTrademark/",
    UPDATETRADEMARK = "/admin/product/baseTrademark/update",
    ADDTRADEMARK = "/admin/product/baseTrademark/save",
    DELETETRADEMARK = "/admin/product/baseTrademark/remove/"

}

export const reqHasTrademark = (page: number, limit: number) => request.get<any, TradeMarkResponseDate>(API.TRADEMARK_URL + `${page}/${limit}`)
export const reqAddOrUpdateTrademark = (data: TradeMark) => {
    if (data.id) {
        // 修改
        return request.put<any, any>(API.UPDATETRADEMARK, data)
    } else {
        // 新增
        return request.post<any, any>(API.ADDTRADEMARK, data)
    }
}
export const reqDeleteTrademark = (id: number) => request.delete<any, any>(API.DELETETRADEMARK + `${id}`)
