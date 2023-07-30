<template>
    <div class="box7">
        <Mychart :options="option" :title="title"></Mychart>
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
let title = ref('年度销售量对比')
let option = {
    title: {
        text: '散点图',
        left: '80%',
        textStyle: {
            color: 'yellowgreen'
        }
    },
    xAxis: {
        type: 'category',
        show: true,
    },
    yAxis: {
        show: false
    },
    grid: {
        left: 10,
        top: 20,
        right: 0,
        bottom: 30
    },
    series: {
        type: 'scatter',
        data: [33, 88, 21, 9, 88, 234, 113, 1231, 674, 3, 88, 33, 21, 888, 362, 313, 123, 5, 657, 7],
        //标记图形设置
        symbol: 'diamond',
        symbolSize: 16,
        //图文标签
        label: {
            show: true,
            position: 'top',
            color: 'white'
        },
        //散点图标记的颜色
        itemStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'pink' // 0% 处的颜色
                }, {
                    offset: 1, color: 'cyan' // 100% 处的颜色
                }],
                global: false // 缺省为 false
            }
        }
    }

}

</script>
  
<style scoped lang="scss">
.box7 {
    width: 100%;
    height: 100%;
    margin-top: 20px;
}
</style>