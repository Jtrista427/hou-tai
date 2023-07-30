export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

// 每个品牌的ts数据类型
export interface TradeMark {
    id?: number, //新增品牌的时候不需要有id
    tmName: string,
    logoUrl: string
}

// 包含全部品牌数据的ts类型
export type Records = TradeMark[]

// 获取全部品牌时服务器返回的数据类型
export interface TradeMarkResponseDate extends ResponseData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        searchCount: boolean,
        pages: number

    }
}