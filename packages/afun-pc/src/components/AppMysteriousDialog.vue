<script setup lang="ts">
import { ApiMemberPromoList } from '@tg/apis'

import { onMounted, ref, watch } from 'vue'

interface Props {
  type?: string
}
const props = defineProps<Props>()
const show = ref(false)
const { isLogin } = storeToRefs(useAppStore())
const lanMap = ref({
  'zh-CN': 'promos/1745226680804.png',
  'en-US': 'promos/1745226708731.png',
  'vi-VN': 'promos/1745226723794.png',
  'pt-BR': 'promos/1745226740305.png',
})
const { t, locale } = useI18n()
const router = useLocalRouter()
const {
  data: dataPromoList,
  runAsync: runAsyncPromoList,
} = useRequest(ApiMemberPromoList, {
  onSuccess(data) {
    checkHomePop()
  },
})

// 修正日期對比邏輯
function checkShouldShow() {
  const lastClose = localStorage.getItem('dialogClosedTime')
  if (!lastClose)
    return true

  const lastDate = new Date(Number(lastClose))
  const today = new Date()

  // 转换为本地日期字符串（忽略时间）
  const lastDay = lastDate.toDateString()
  const todayDay = today.toDateString()

  return lastDay !== todayDay
}

function checkHomePop() {
  if (!dataPromoList.value)
    return
  dataPromoList.value.forEach((item) => {
    if (item.ty == 17) {
      if (item.pop == 2 && !isLogin.value)
        show.value = true

      else if (item.pop == 3 && isLogin.value)
        show.value = true

      else if (item.pop == 4)
        show.value = true
    }
  })
}

function btnHandle() {
  if (props.type == 'home') {
    const current = dataPromoList.value?.find(item => item.ty == 17)
    show.value = !show.value
    if (current)
      router.push(`/promotions/promotion/mysterious-mine?pid=${current.id}`)
  }
  else {
    show.value = !show.value
  }
}

// 组件挂载时检查显示状态
onMounted(() => {
  const key = checkShouldShow()

  if (props.type == 'home' && key) {
    runAsyncPromoList({
      category: 0,
    })
  }
  else {
    show.value = key
  }
  // 首页进入不弹框
  if (router.options.history.state.back && router.options.history.state.back?.includes('/casino'))
    show.value = false
})

// 监听弹窗状态变化
watch(show, (newVal) => {
  if (!newVal) {
    // 存储关闭时间戳
    localStorage.setItem('dialogClosedTime', Date.now().toString())
  }
})
</script>

<template>
  <BaseDialog
    v-model:show="show"
    :show-close="false"
    transparent
    height="auto"
    class="rounded-lg"
  >
    <div class="text-tg-text-lightgrey content relative">
      <BaseImage width="100%" height="100%" :url="lanMap[locale]" is-network />
      <div class="closeBtn" @click="show = !show" />
      <div class="clickBtn" @click="btnHandle" />
    </div>
  </BaseDialog>
</template>

<style lang="scss">
:root {
  --tg-time-item-bg-color: #213744;
  --tg-time-item-border: 1px solid var(--tg-secondary-main);
  --tg-text-round-bg-color: var(--tg-text-lightgrey);
  --tg-base-dialog-close-only-padding-top: 15px;
}
</style>

<style scoped lang="scss">
.content {
  height: 100%;
  .closeBtn {
    width: 16px;
    height: 16px;
    position: absolute;
    top: 4%;
    right: 5%;
    z-index: 999;
    cursor: pointer;
  }
  .clickBtn {
    position: absolute;
    width: 55%;
    height: 12%;
    bottom: 6.5%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;
    cursor: pointer;
  }
}
</style>
