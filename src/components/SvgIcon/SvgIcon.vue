<template>
  <svg :style="{width:width,height:height}">
    <use :xlink:href="prefix+name" :fill=color></use>
  </svg>
</template>

<script setup lang="ts">
defineProps({
  // 前缀
  prefix: {
    type: String,
    default: "#icon-",
  },
  // 图标名字
  name: String,
  color:{
    type:String,
    default:''
  },
  width:{
    type:String,
    default:'16px'
  },
  height:{
    type:String,
    default:'16px'
  }
});
</script>

<style>
</style>