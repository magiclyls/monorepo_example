<script setup lang="ts">
provide('isInPromoRebate',true)
provide('isInPromoVip', false)
</script>
<template>
  <div>
    <AppVipInfoBar2 />
    <div class="border-[1px] mt-[24px] border-[#2F4553] bg-[#1A2C38] rounded">
    <AppVipContent :is-center-page="true"/>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: center
</route>
