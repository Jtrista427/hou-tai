// 封装函数，判断时间
export const getTime = () => {
    let time = ""
    let hours = new Date().getHours()
    if (hours <= 12) {
        time = "上午"
    } else if (hours > 12 && hours < 18) {
        time = "下午"
    }
    else {
        time = "晚上"
    }
    return time
}