<template>
    <div class="box8">
        <Mychart :options="option" :title="title"></Mychart>
    </div>
</template>
    
<script setup lang="ts">
import { ref } from 'vue'
let title = ref('用户消费统计')
let option = {
    title: {
        text: '用户消费统计',
        left: ' 70%',
        top: 0,
        textStyle: {
            color: 'yellow'
        }
    },
    radar: {
        // shape: 'circle',
        indicator: [
            { name: '消费', max: 6500 },
            { name: '好感', max: 16000 },
            { name: '出行', max: 30000 },
            { name: '小吃', max: 38000 },
            { name: '爱好', max: 52000 },
            { name: '景点', max: 25000 }
        ]
    },
    series: [
        {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
                {
                    value: [4200, 3000, 20000, 35000, 50000, 18000],
                    name: '购物'
                },
                {
                    value: [5000, 14000, 28000, 26000, 42000, 21000],
                    name: '吃饭'
                }
            ]
        }
    ]
};
//组件挂载完毕
// onMounted(() => {
//     //一个容器可以同时展示多种类型的图形图标
//     let mychart = echarts.init(charts.value);
//     //设置配置项
//     mychart.setOption(option)
// })
</script>
    
<style scoped lang="scss">
.box8 {
    width: 100%;
    height: 100%;
    margin: 10px 0;
}
</style>