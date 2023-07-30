import { AttrvalueList } from './type';
import { ResponseData } from './../trademark/type';

// 分类ts类型
export interface CategoryObj {
    id: number | string,
    name: string,
    category1Id?: number,
    category2Id?: number,
    category3Id?: number,
}

export interface CategoryResponseDate extends ResponseData {
    data: CategoryObj[]
}

// 已有属性值对象的ts
export interface Attrvalue {
    id?: number,
    valueName: string,
    attrId?: number,
    flag?: boolean
}

// 存储每个属性值的数组类型
export type AttrvalueList = Attrvalue[]
// 属性对象
export interface Attr {
    id?: number,
    attrName: string,
    categoryId: number | string,
    categoryLevel: number,
    attrValueList: AttrvalueList
}
// 存储每一个属性对象的数组类型
export type AttrList = Attr[]
// 属性接口返回数据类型
export interface AttrResponseData extends ResponseData {
    data: AttrList
}