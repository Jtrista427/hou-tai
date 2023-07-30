<template>
    <div class="box">
        <div class="title">
            <p>男女比例</p>
            <img src="../../images/dataScreen-title.png" alt="">
        </div>
        <div class="sex">
            <div class="man">
                <p>男士</p>
                <img src="../../images/man.png" alt="">
            </div>
            <div class="women">
                <p>女士</p>
                <img src="../../images/woman.png" alt="">
            </div>
        </div>

        <div class="rate">

        </div>
        <div class="charts" ref='charts'></div>
    </div>
</template>

<script setup lang='ts'>
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
let charts = ref()
onMounted(() => {
    let mycharts = echarts.init(charts.value)
    mycharts.setOption({
        title: {
            text: '男女比例',
            textStyle: {
                color: 'skyblue'
            },
            // 位置
            left: '40%'
        },
        xAxis: {
            show: false,
            min: 0,
            max: 100
        },
        yAxis: {
            show: false,
            type: 'category'
        },
        series: [
            {
                type: 'bar',
                data: [58],
                barWidth: 20,
                // 让男士柱条在上面
                z: 100,
                itemStyle: {
                    color: 'skyblue',
                    borderRadius: 20
                },
                label: {
                    show: true,
                    position: 'right',
                    color: 'white',
                    fontSize: 16
                }
            }
            ,
            {
                type: 'bar',
                data: [100],
                barWidth: 20,
                //调整女士柱条位置 batgap不同柱间的距离
                barGap: '-100%',
                itemStyle: {
                    color: 'pink',
                    borderRadius: 20
                }
            }
        ],
        grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        }

    })
})

</script>

<style scoped lang='scss'>
.box {
    width: 100%;
    height: 100%;
    background: url(../../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;
    margin: 20px 0;
    color: white;

    .title {
        margin-left: 20px;

        p {
            font-size: 25px;


        }
    }

    .sex {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        font-size: 20px;
        color: white;

        .man {
            margin-right: 40px;
            // 将盒子大小设置为背景图大小
            width: 111px;
            height: 115px;
            background: url(../../images/man-bg.png) no-repeat;
            background-size: 100% 100%;
            // 让背景图在最中间
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;

            p {
                margin-bottom: 20px;
            }

        }

        .women {
            width: 111px;
            height: 115px;
            background: url(../../images/woman-bg.png) no-repeat;
            background-size: 100% 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;

            p {
                margin-bottom: 20px;
            }

        }


    }

    .rate {
        display: flex;
        justify-content: space-between;
    }

    .charts {
        height: 100px;
    }
}
</style>
