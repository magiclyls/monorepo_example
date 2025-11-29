<script setup lang='ts'>
import type { EnumCurrencyKey, INotificationInfoItem } from '@tg/types'
import { AfunBaseCurrencyIcon } from '@tg/bccomponents'
import { IconNavbarWallet, IconUniDelete, IconUniWarning } from '@tg/icons'
import { timeToFromNow } from '@tg/vue-i18n'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

interface Props {
  data: INotificationInfoItem
}

defineOptions({ name: 'AppMessageNotificationItem' })
const props = defineProps<Props>()
const emit = defineEmits(['delete', 'ready'])
const { t } = useI18n()
const router = useRouter()
const rightRef = ref()
const showDelete = ref(false)

// 根據 state 返回圖標組件
function getIcon(state: number) {
  if (state === 1)
    return 'IconNavbarWallet' // 成功 - 錢包圖標
  else if (state === 2)
    return 'IconUniWarning' // 失敗 - 警告圖標
  else
    return '' // 其他 - 顯示貨幣圖標
}

// 解析 payload 獲取 state
const payloadData = computed(() => {
  try {
    return typeof props.data.payload === 'string'
      ? JSON.parse(props.data.payload)
      : props.data.payload
  }
  catch {
    return {}
  }
})

const iconComponent = computed(() => getIcon(payloadData.value?.state))

function formatDepositState(state: number) {
  switch (state) {
    case 1: return t('成功')
    case 2: return t('失败')
    case 3: return t('进行中')
    case 4: return t('失败')
    case 5: return t('进行中')
    case 6: return t('失败')
    default: return '--'
  }
}

function formatWithdrawState(state: number) {
  switch (state) {
    case 1: return t('成功')
    case 2: return t('失败')
    case 3: return t('进行中')
    case 4: return t('失败')
    case 5: return t('失败')
    case 6: return t('进行中')
    default: return '--'
  }
}

function getColor(state: number, originalTitle: string) {
  const isDeposit = originalTitle.includes('deposit')
  const isWithdraw = originalTitle.includes('withdraw')

  if (state === 1)
    return '#24EE89' // 成功 - 綠色
  if (state === 3 || (state === 5 && isDeposit) || (state === 6 && isWithdraw))
    return '#FF9800' // 進行中 - 橙色
  return '#E91134' // 失敗 - 紅色
}

function onClickItem() {
  if (props.data.is_read === 1) {
    emit('ready', props.data)
  }

  // 判斷是存款還是提款
  const isDeposit = props.data?.originalTitle?.includes('deposit') ?? false
  const method = isDeposit ? 'deposit' : 'withdraw'
  const status = isDeposit ? formatDepositState(payloadData.value.state) : formatWithdrawState(payloadData.value.state)

  // 跳轉到交易記錄詳情頁
  router.push({
    name: 'TransactionRecordDetail',
    query: {
      data: JSON.stringify({
        ...payloadData.value,
        method,
        status,
        color: getColor(payloadData.value.state, props.data.originalTitle ?? ''),
      }),
    },
  })
}

function onClickDelete() {
  emit('delete', props.data)
}

onMounted(() => {
  let startX = 0
  let startY = 0

  rightRef.value.addEventListener('touchstart', (e: any) => {
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
  })

  rightRef.value.addEventListener('touchend', (e: any) => {
    const dx = e.changedTouches[0].clientX - startX
    const dy = e.changedTouches[0].clientY - startY
    if (Math.abs(dx) > Math.abs(dy)) {
      // 向右
      if (dx > 0) {
        showDelete.value = false
      }
      // 向左
      if (dx < 0) {
        showDelete.value = true
      }
    }
  })
})
</script>

<template>
  <div class="flex w-full h-[62rem] rounded-[4px] overflow-hidden" @click="onClickItem">
    <div class="flex-none h-full flex items-center text-[20rem] justify-center bg-[#213743] w-[62rem]">
      <AfunBaseCurrencyIcon v-if="!iconComponent" :currency-type="data.content.split(',')[1] as EnumCurrencyKey" style="--afun-app-currency-icon-size: 20rem;" />
      <IconNavbarWallet v-else-if="iconComponent === 'IconNavbarWallet'" class="text-[#24EE89]" />
      <IconUniWarning v-else-if="iconComponent === 'IconUniWarning'" class="text-[#F23038]" />
    </div>
    <div ref="rightRef" class="flex grow h-full bg-[#2F4553] items-center" style="max-width: calc(100% - 62rem);">
      <div class="w-full h-full flex items-center">
        <div class="flex flex-col overflow-hidden w-full">
          <div class="px-[12rem] mb-[2rem] flex text-[14rem] font-[500] leading-[20rem] items-center justify-between">
            <div class="overflow-hidden whitespace-nowrap text-ellipsis max-w-[80%] text-[#fff]">
              <span>{{ data.title }}</span>
            </div>
            <span class="flex-none flex items-center ml-[8rem] text-[#B1BAD3] font-[400] text-[12rem]">
              <span
                v-show="data.is_read === 1"
                class="inline-block w-[6rem] h-[6rem] bg-[#24EE89] rounded-[50%] mr-[4rem]"
              />
              {{ timeToFromNow(data.timestamp) }}
            </span>
          </div>
          <div class="px-[12px] leading-[20px] w-full text-[#B1BAD3] flex items-center gap-[4px]">
            <span>{{ t('金额') }} {{ data.content.split(',')[0] }}</span>
            <AfunBaseCurrencyIcon :currency-type="data.content.split(',')[1] as EnumCurrencyKey" />
          </div>
        </div>
        <div
          :class="showDelete ? 'w-[70rem]' : 'w-0'"
          class="duration-[0.35s] h-full text-[26rem] bg-[#F23038] flex flex-none items-center justify-center overflow-hidden"
          @click.stop="onClickDelete"
        >
          <IconUniDelete class="text-white" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped></style>
