<template>
    <div class="box4" ref="map">
        我是地图组件
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
//引入中国地图的JSON数据
import chinaJSON from './china.json'
let map = ref();
//注册中国地图
echarts.registerMap('china', chinaJSON)
onMounted(() => {
    let mychart = echarts.init(map.value)
    mychart.setOption({
        // 地图组件
        geo: {
            map: 'china',
            roam: true,//鼠标缩放
            // 地图位置
            left: 150,
            top: 170,
            right: 150,
            //地图上的文字的设置
            label: {
                show: true,//文字显示出来
                color: 'white',
                fontSize: 14
            },
            itemStyle: {
                //每一个多边形的样式
                color: {
                    type: 'linear', //线性渐变
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'pink' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'skyblue' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                },
                opacity: .8
            },
            //地图高亮的效果
            emphasis: {
                itemStyle: {
                    color: 'skyblue'
                },
                label: {
                    fontSize: 40
                }
            }


        },
        //布局位置
        grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        },
        series: [
            {
                type: 'lines',//航线的系列
                data: [
                    {
                        coords: [
                            [116.405285, 39.904989],  // 起点
                            [119.306239, 26.075302]   // 终点

                        ],
                        // 统一的样式设置
                        lineStyle: {
                            color: 'black',
                            width: 3
                        }
                    },
                    {
                        coords: [
                            [116.405285, 39.904989],  // 起点
                            [114.298572, 30.584355]   // 终点

                        ],
                        // 统一的样式设置
                        lineStyle: {
                            color: 'black',
                            width: 3
                        }
                    }
                ],
                //开启动画特效
                effect: {
                    show: true,
                    symbol: 'arrow',
                    color: 'white',
                    symbolSize: 10
                }
            }
        ]
    })
})
</script>

<style scoped lang='scss'></style>
