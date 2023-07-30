<template>
    <div class="logo">
        <img :src="setting.logo" alt="">
        <p>{{ setting.title }}</p>
    </div>
</template>

<script setup lang=ts>
import setting from '@/setting';

</script>

<style scoped lang="scss">
.logo {
    height: $base-munu-log-height;
    width: 100%;
    color: aliceblue;
    display: flex;
    align-items: center;
    font-size: 23px;
    padding: 10px;

    img {
        width: 40px;
        height: 40px;
        margin-right: 10px
    }
}
</style>
