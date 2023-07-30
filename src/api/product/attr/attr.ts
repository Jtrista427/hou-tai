import request from "@/utils/request";
import { CategoryResponseDate, AttrResponseData, Attr } from "./type";
enum API {
    CATEGORY1 = '/admin/product/getCategory1',
    CATEGORY2 = '/admin/product/getCategory2/',
    CATEGORY3 = '/admin/product/getCategory3/',
    ATTINFOLIST = '/admin/product/attrInfoList/',
    // 添加和修改属性
    ADDORUPDATE = '/admin/product/saveAttrInfo',
    DELETEATTR = '/admin/product/deleteAttr/'

}

export const reqC1 = () => request.get<any, CategoryResponseDate>(API.CATEGORY1)
export const reqC2 = (category1id: number) => request.get<any, CategoryResponseDate>(API.CATEGORY2 + category1id)
export const reqC3 = (category2id: number) => request.get<any, CategoryResponseDate>(API.CATEGORY3 + category2id)
export const reqAttrInfoList = (category1id: number, category2id: number, category3id: number) => request.get<any, AttrResponseData>(API.ATTINFOLIST + `${category1id}/${category2id}/${category3id}`)
export const reqAddOrUpdateAttr = (data: Attr) => request.post<any, any>(API.ADDORUPDATE, data)
export const reqDeleteAttr = (attrid: number) => request.delete<any, any>(API.DELETEATTR + attrid)
