<script lang="ts" setup>
import SwiperCore from 'swiper'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/autoplay'

defineProps<{
  items: any[]
}>()

SwiperCore.use([Autoplay])
</script>

<template>
  <Swiper
    direction="vertical"
    :loop="true"
    :autoplay="{ delay: 2500, disableOnInteraction: false }"
    :slides-per-view="1"
    :space-between="8"
    class="h-[30px] rounded-[4px] w-full"
    style="background: linear-gradient(90deg, rgba(254, 91, 96, 0.2) 0%, rgba(254, 91, 96, 0) 17.08%), rgb(238, 238, 255);"
    :allow-touch-move="true"
  >
    <SwiperSlide v-for="(item, index) in items" :key="index">
      <div class="flex items-center gap-2 text-sm text-gray-700 h-[30px] p-[4px]">
        <slot :item="item" />
      </div>
    </SwiperSlide>
  </Swiper>
</template>
