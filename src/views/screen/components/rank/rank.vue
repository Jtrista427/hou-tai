<template>
    <div class="box6">
        <Mychart :options="option" :title="title"></Mychart>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
let title = ref('热门商品排行')
let option = {
    //标题组件
    title: {
        //主标题
        text: '商品排行',
        link: 'http://www.baidu.com',
        //标题的位置
        left: '50%',
        //主标题文字样式
        textStyle: {
            color: 'yellowgreen',
            fontSize: 20
        },
        //子标题
        subtext: "各大商品排行",
        //子标题的样式
        subtextStyle: {
            color: 'yellowgreen',
            fontSize: 14
        }
    },
    //x|y轴组件
    xAxis: {
        type: 'category',//图形图标在x轴均匀分布展示
    },
    yAxis: {},
    //布局组件
    grid: {
        left: 30,
        bottom: 20,
        right: 20
    },
    //系列:决定显示图形图标是哪一种的
    series: [
        {
            type: 'bar',
            data: [10, 40, 70, 50, 40, 60, 30],
            //柱状图的:图形上的文本标签，
            label: {
                show: true,
                //文字的位置
                position: 'insideTop',
                //文字颜色
                color: 'white'
            },
            //是否显示背景颜色
            // showBackground: true,
            backgroundStyle: {
                //底部背景的颜色
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'black' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'blue' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                }
            },
            //柱条的样式
            itemStyle: {
                borderRadius: [10, 10, 0, 0],
                //柱条颜色
                color: function (data: any) {
                    //data是每个柱条 给每一个柱条这是背景颜色
                    let arr = ['red', 'orange', 'yellowgreen', 'green', 'purple', 'hotpink', 'skyblue']
                    return arr[data.dataIndex];
                }
            }
        },
        {
            type: 'line',
            data: [20, 40, 80, 50, 80, 60, 40],
            smooth: true,//平滑曲线
        },
        {
            type: 'bar',
            data: [90, 80, 40, 80, 20, 30, 10],
            //柱状图的:图形上的文本标签，
            label: {
                show: true,
                //文字的位置
                position: 'insideTop',
                //文字颜色
                color: 'white'
            },
            //是否显示背景颜色
            showBackground: true,
            backgroundStyle: {
                //底部背景的颜色
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'white' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'yellow' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                }
            },
            //柱条的样式
            itemStyle: {
                borderRadius: [10, 10, 0, 0],
                //柱条颜色
                color: function (data: any) {
                    //给每一个柱条这是背景颜色
                    let arr = ['red', 'orange', 'yellowgreen', 'green', 'purple', 'hotpink', 'skyblue']
                    return arr[data.dataIndex];
                }
            }
        },
    ],
    tooltip: {
        backgroundColor: 'rgba(50,50,50,0.7)'
    }
}

</script>

<style scoped lang="scss">
.box6 {
    width: 100%;
    height: 100%;
    margin: 10px 0px;
}
</style>
