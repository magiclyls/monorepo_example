<script lang="ts" setup>
// 导入基础组件和工具
import { AfunBaseImage } from '@tg/bccomponents'
import { useActivityMenu, useGlobalPromoState, usePromoHotGate } from '@tg/hooks'
import { IconUniClose3 } from '@tg/icons'
import { isArray, throttle } from 'lodash'
import Swiper from 'swiper'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import 'swiper/css'

// 定义组件名称
defineOptions({
  name: 'AppPromoHotGate',
})

// 使用活动菜单钩子
const { openActivity } = useActivityMenu()

// 当前路由信息
const route = useRoute()

// 组件DOM引用
const promoHotGateRef = ref()

// 获取全局推广状态
const { promoShortCut } = useGlobalPromoState()
// 获取推广热门的显示状态控制
const { show, setShow, closeAll, setCloseAll } = usePromoHotGate()

// 已删除的图片列表
const deletedImgs = ref<string[]>([])
// Swiper实例引用
const swiper = ref()

// 处理轮播数据，解析图标配置
const sliders = computed(() => promoShortCut.value?.map((h) => {
  let temp
  try {
    temp = JSON.parse(h.icon) // 尝试解析JSON格式的图标配置
  }
  catch {
    temp = h.icon // 解析失败则直接使用
  }

  // 处理数组格式的图标
  if (isArray(temp) && temp.length) {
    const tf = temp.filter((e: string) => e !== undefined && e !== null && e.trim().length && e.includes('.'))
    return tf.length ? tf.map((t: string) => ({ ...h, ty: h.ty, id: h.id, icon: t })) : undefined
  }
  else if (isArray(temp) && temp.length === 0) {
    return undefined
  }
  else {
    return { ...h, icon: temp }
  }
}).filter((f): f is NonNullable<typeof f> => f !== undefined && f !== null).flat().filter((f: { icon: string }) => !deletedImgs.value.includes(f.icon)))

// 关闭所有推广
function deleteAll() {
  swiper.value?.destroy() // 销毁Swiper实例
  setShow(false) // 隐藏组件
  setCloseAll(true) // 设置全局关闭状态
}

// 自动播放相关
let autoplayTimer: ReturnType<typeof setTimeout>
const stopAutoplay = () => clearTimeout(autoplayTimer)

// 自动播放功能
function autoplay() {
  stopAutoplay()
  if (sliders.value && sliders.value.length > 1 && show.value) {
    autoplayTimer = setTimeout(() => {
      swiper.value.slideNext() // 切换到下一张
      autoplay() // 递归调用，实现循环播放
    }, 3000) // 3秒间隔
  }
}

// 点击活动节流处理（防止快速点击）
const openThrottleActivity = throttle((item: any) => {
  openActivity(item)
}, 1.2 * 1000, {
  leading: true,
  trailing: false,
})

// 初始化Swiper轮播
async function initSwiper(sliders: any) {
  if (closeAll.value)
    return

  // 检查是否有数据且满足显示条件
  if (sliders && sliders.length && ((route.name === 'casino-home' || route.path === '/'))) {
    setShow(true)
    await nextTick()
    setTimeout(() => {
      // 创建Swiper实例
      swiper.value = new Swiper('.swiperlocal', {
        direction: 'horizontal', // 水平方向
        loop: true, // 循环播放
        autoplay: true, // 自动播放
      })
      setTimeout(() => {
        autoplay() // 延迟启动自动播放
      }, 2000)
    }, 0)
  }
}

// 组件挂载时
onMounted(() => {
  initSwiper(sliders.value) // 初始化轮播
})

// 组件卸载前
onBeforeUnmount(() => {
})

// 监听轮播数据变化
watch(sliders, (val) => {
  if (!val || val.length === 0)
    swiper.value?.destroy() // 无数据时销毁Swiper
  if (val && val.length)
    initSwiper(sliders.value) // 有数据时初始化Swiper
}, { deep: true, immediate: true })

// 监听路由变化
watch(route, (val) => {
  if ((val.name === 'casino-home' || val.path === '/')) {
    // 在指定页面显示
    setShow(true)
    nextTick(() => {
      initSwiper(sliders.value)
    })
  }
  else {
    // 其他页面隐藏
    swiper.value?.destroy()
    setShow(false)
  }
})
</script>

<template>
  <!-- 使用teleport将组件渲染到body下 -->
  <!-- 推广热门入口组件 -->
  <div
    v-if="sliders && sliders.length && show && !closeAll"
    ref="promoHotGateRef"
    draggable="true"
    class="relative overflow-hidden duration-[0.05s] h-[75px] w-[75px] "
  >
    <!-- 轮播容器 -->
    <div
      class="text-tg-text-white swiperlocal relative text-[10px] h-[75px] w-[75px] "
    >
      <div class="swiper-wrapper">
        <!-- 轮播项 -->
        <div v-for="(item, idx) in sliders" :key="item.id + idx" class="swiper-slide relative cursor-pointer">
          <AfunBaseImage is-network :url="item.icon[0] === '/' ? item.icon : `/${item.icon}`" @click.stop="openThrottleActivity(item)" />
        </div>
      </div>
    </div>
    <!-- 关闭按钮 -->
    <a class="text-tg-text-white close absolute right-0 top-0 z-[1001] h-[15px] w-[15px] flex cursor-pointer justify-end text-[10px]" @click.stop="deleteAll">
      <IconUniClose3 />
    </a>
  </div>
  <!-- 预加载图片（隐藏） -->
  <AfunBaseImage v-for="(item, idx) in sliders" :key="idx" width="0px" height="0px" class="invisible h-0 w-0" is-network hidden :url="item.icon[0] === '/' ? item.icon : `/${item.icon}`" />
</template>

<style lang="scss" scoped>
// 关闭按钮样式
.close {
  --tg-icon-color: white;
  svg {
    cursor: pointer;
    display: block;
  }
}

// 轮播容器样式
.swiperlocal {
  --tg-icon-color: white;
}
</style>
