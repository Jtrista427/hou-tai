<template>
    <div class="box">
        <div class="title">
            <p>{{ title }}</p>
            <img src="../../views/screen/images/dataScreen-title.png" alt="">
        </div>
        <div class="charts" ref="charts"></div>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, onMounted, watch } from 'vue';
let charts = ref();
const props = defineProps({
    options: {
        type: Object,
        default: () => ({})
    },
    title: String
})
let mychart = null
onMounted(() => {
    mychart = echarts.init(charts.value);
    mychart.setOption(props.options)
})

watch(props.options, (newOption) => {
    mychart.setOption(newOption)
},
    { deep: true }
)



</script>
<style scoped lang="scss">
.box {
    width: 100%;
    height: 100%;
    background: url(../../views/screen/images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;
    margin-top: 20px;

    .title {
        p {
            color: white;
            font-size: 25px;
            margin-top: 10px;
        }
    }

    .charts {
        height: 100%;
        width: 100%;
    }

}
</style>