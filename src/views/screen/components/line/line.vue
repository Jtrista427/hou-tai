<template>
    <div class="box5">
        <div class="title">
            <p>未来七天游客数量趋势图</p>
            <img src="../../images/dataScreen-title.png" alt="">
        </div>
        <div class="charts" ref='line'></div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
let line = ref()
onMounted(() => {
    let mycharts = echarts.init(line.value);
    mycharts.setOption({
        title: {
            text: '访问量'
        },
        xAxis: {
            type: 'category',
            //两侧不留白
            boundaryGap: false,
            //分割线不要
            splitLine: {
                show: false
            },
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            //轴线的设置
            axisLine: {
                show: true
            },
            //刻度
            axisTick: {
                show: true
            }
        },
        yAxis: {
            splitLine: {
                show: false
            },
            axisLine: {
                show: true
            },
            //刻度
            axisTick: {
                show: true
            }
        },
        grid: {
            left: 70,
            top: 70,
            bottom: 30,
            right: 10
        },
        series: [{
            type: 'line',
            data: [120, 1240, 66, 2299, 321, 890, 1200],
            smooth: true,
            //区域填充样式
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'yellow' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'skyblue' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                }
            }
        }],

    })
})
</script>

<style scoped lang='scss'>
.box5 {
    width: 100%;
    height: 100%;
    background: url(../../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;
    margin: 0px 20px;


    .title {
        margin-left: 10px;
        margin-top: 10px;

        p {
            color: white;
            font-size: 25px;

        }
    }

    .charts {
        height: calc(100% - 60px);
    }

}
</style>
