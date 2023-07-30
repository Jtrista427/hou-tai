<template>
    <div class="box">
        <div class="title">
            <p>年龄比例</p>
            <img src="../../images/dataScreen-title.png" alt="">
        </div>
        <!-- 图形图标的容器 -->
        <div class="charts" ref="charts"></div>

    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue';
//引入echarts
import * as echarts from 'echarts';
let charts = ref();
onMounted(() => {
    let mychart = echarts.init(charts.value);
    //设置配置项
    let option = {
        tooltip: {
            trigger: 'item'
        },
        // 图例
        legend: {
            right: 30,
            top: 40,
            orient: 'vertical',//图例组件方向的设置
            textStyle: {
                color: 'white',
                fontSize: 14
            }
        },
        series: [
            {
                name: 'Age',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'inside',
                    color: 'white'
                },

                labelLine: {
                    show: false
                },
                data: [
                    { value: 1048, name: '20+' },
                    { value: 735, name: '30+' },
                    { value: 580, name: '40+' },
                    { value: 484, name: '50+' },
                    { value: 300, name: '60+' }
                ]
            }
        ],
        //调整图形图标的位置
        grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        }
    };
    mychart.setOption(option);
});
</script>

<style scoped lang='scss'>
.box {
    width: 100%;
    height: 100%;
    background: url(../../images/dataScreen-main-cb.png) no-repeat;
    color: white;
    background-size: 100% 100%;

    .title {
        margin-left: 20px;
        font-size: 25px;
    }

    .charts {
        height: 260px;
    }

}
</style>
