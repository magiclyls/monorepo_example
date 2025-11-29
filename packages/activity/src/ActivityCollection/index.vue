<script lang="ts" setup>
import type { ApiWordCollectionConfigRes, ApiWordCollectionRecordRes } from '@tg/types'
import { ApiWordCollectionConfig, ApiWordCollectionRecord } from '@tg/apis'
import { BaseButton, BaseDialog, BaseImage, BaseInput } from '@tg/bccomponents'
import { SendFlutterAppMessage } from '@tg/types'
import { getCurrencyConfig, isFlutterApp, sendMsgToFlutterApp } from '@tg/utils'
import { useField } from 'vee-validate'
import { computed, h, inject, onMounted, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useActivityConfig } from '../../config'
import { useLocale } from '../utils'
import LuckyWheel from './components/LuckyWheel.vue'
import LuckyWheelGetCouponTask from './components/LuckyWheelGetCouponTask.vue'
import LuckyWheelWordCard from './components/LuckyWheelWordCard.vue'

interface ColorCfg { colorCode?: string, color: string }

defineOptions({
  name: 'KeepAliveWordCollectionRoulette',
})
const { $$t } = useLocale()
const setTitle = inject('setTitle', (v: string) => {})
const route = useRoute()
const showClaim = ref(false)
const showClaimRes = ref(false)
const { isLogin, globalCurrencyCode, callback } = useActivityConfig()
const pid = computed(() => Number(route.query.pid))

const configRes = ref<ApiWordCollectionConfigRes | null>(null)
const recordRes = ref<ApiWordCollectionRecordRes | null>(null)

const {
  value: claimCount,
  errorMessage: errCount,
  resetField: resetCount,
  validate: validateCount,
  setValue: setCount,
} = useField<string>('claimCount', (value) => {
  console.log(resetCount, validateCount)
  if (!isLogin)
    return ''
  if (!value)
    return $$t('min_amount_0')
  else if (Number(value) <= 0)
    return $$t('min_amount_0')
  return ''
})

const tasks = ref([
  { title: $$t('下级累计充值'), progressCurrent: 0, progressTotal: 1, buttonText: '立刻邀请', type: 1 },
  { title: '下级累计充值（100.00）BRL', progressCurrent: 0, progressTotal: 1, buttonText: '立刻邀请', type: 1 },
  { title: '下级累计充值（100.00）BRL', progressCurrent: 0, progressTotal: 1, buttonText: '立刻邀请', type: 1 },
  { title: '下级累计充值（100.00）BRL', progressCurrent: 0, progressTotal: 1, buttonText: '立刻充值', type: 2 },
  { title: '下级累计充值（100.00）BRL', progressCurrent: 0, progressTotal: 1, buttonText: '立刻充值', type: 2 },
  { title: '下级累计充值（100.00）BRL', progressCurrent: 0, progressTotal: 1, buttonText: '立刻充值', type: 2 },
])

const colorConfig: ColorCfg[] = [
  { colorCode: '99357', color: '#C900FF' },
  { colorCode: '99358', color: '#FF4949' },
  { colorCode: '99359', color: '#FFA100' },
  { colorCode: '99360', color: '#FF3AF6' },
  { colorCode: '99361', color: '#2CABFF' },
]

const wordle_tickets = computed(() => {
  const arr = JSON.parse(recordRes.value?.wordle_tickets || '[]')
  if (arr.length) {
    return {
      arr,
      str: arr.map((item: { count: number, world: string }) => `“${item.world}”`).join('、'),
    }
  }
  return {
    arr,
    str: '',
  }
})

function transformCardData() {
  const result: any[] = []
  const colorMap = new Map<string, { colorCode: string, color: string }>() // world -> color
  let configIndex = 0

  for (const item of wordle_tickets.value.arr) {
    // 如果这个 world 已经分配过颜色，就直接复用
    if (!colorMap.has(item.world)) {
      const cfg = colorConfig[configIndex % colorConfig.length]
      colorMap.set(item.world, { colorCode: cfg.colorCode, color: cfg.color })
      configIndex++
    }
    const { colorCode, color } = colorMap.get(item.world)!

    result.push({
      colorCode,
      count: item.count,
      world: item.world,
      color,
    })
  }

  return result
}

interface RollItem {
  amount_quantity: number
  roll_type: [number, string?] // [类型, 可选的字母]
  weight?: string
}

interface OutputItem {
  id: number
  icon: string
  title: string
  color?: string
  iconSize?: number
  colorCode?: string
}

/**
 * 将 a 转换为 b；
 * - 相同 world(字母) 保持相同颜色；
 * - 颜色按 colorConfig 顺序循环使用（如果不够会循环）
 */
function transformRolls(
  input: RollItem[],

): OutputItem[] {
  const result: OutputItem[] = []
  const colorMap = new Map<string, ColorCfg>() // world(letter) -> colorCfg
  let colorIdx = 0

  const pickColorForWorld = (world: string): ColorCfg => {
    if (!colorMap.has(world)) {
      const cfg = colorConfig[colorIdx % colorConfig.length]
      colorMap.set(world, cfg)
      colorIdx++
    }
    return colorMap.get(world)!
  }

  input.forEach((item, i) => {
    const id = i + 1
    const [type, maybeLetter] = item.roll_type

    // 跳过无效项（可按需保留）
    if (type == null)
      return

    switch (type) {
      case 2: {
        // 字母
        const world = String(maybeLetter ?? '').trim()
        if (!world) {
          // 没有字母就跳过或按空奖处理，看你的业务
          return
        }
        const { color, colorCode } = pickColorForWorld(world)
        result.push({
          id,
          icon: world, // 字母
          title: '字母',
          color,
          ...(colorCode ? { colorCode } : {}),
        })
        break
      }

      case 4: {
        // 金币
        result.push({
          id,
          icon: 'coins',
          title: String(item.amount_quantity), // 金币数量作为标题
          iconSize: 30,
        })
        break
      }

      case 1: {
        // 抽奖券
        result.push({
          id,
          icon: 'ticket',
          title: '抽奖券',
          iconSize: 27,
        })
        break
      }

      case 5: {
        // 空奖
        result.push({
          id,
          icon: 'cry-face',
          title: '谢谢参与',
          iconSize: 26,
        })
        break
      }

      case 3: {
        // 数字（如果需要也可显示数字本身）
        // 这里给一个示例：icon 就用数字字符，title 用数字
        result.push({
          id,
          icon: String(item.amount_quantity ?? ''),
          title: String(item.amount_quantity ?? ''),
        })
        break
      }

      default: {
        // 兜底（未知类型）
        result.push({
          id,
          icon: 'unknown',
          title: String(item.amount_quantity ?? ''),
        })
      }
    }
  })

  return result
}

// const pageLoading = computed(() => {
//   let loading = configLoading.value && !fullRes.value
//   if (isLogin)
//     loading = loading || !loginFullRes.value
//   return loading
// })

function handleTaskClick(type: number, detail: any) {
  if (!isLogin) {
    callback('login')
    return
  }
  if (type === 1) {
    callback('share')
  }
  else {
    if (isFlutterApp()) {
      sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_DEPOSIT_MODAL)
    }
    else {
      callback('recharge')
    }
  }
}

function handleClaim() {
  if (!isLogin) {
    callback('login')
    return
  }
  showClaim.value = true
}

function handleWheelRes() {
  showClaimRes.value = true
}

function handleConfirm() {
  showClaimRes.value = false
}

function handleClaimRes() {
  showClaim.value = true
  callback('message', h('div', { class: 'flex items-center gap-[4rem]' }, [
    h('span', { class: 'whitespace-nowrap' }, $$t('transfer_to_wallet_success')),
  ]))
}

function maxNumber() {
  if (!isLogin)
    return
  return 100
}

function handleBlur() {
  setCount('100')
}

async function getConfig() {
  const res = await ApiWordCollectionConfig({ pid: pid.value, cur: globalCurrencyCode })
  configRes.value = res
}

async function getRecords() {
  const res = await ApiWordCollectionRecord({ pid: pid.value, cur: globalCurrencyCode })
  recordRes.value = res
}

watchEffect(() => {
  setTitle($$t('转盘抽奖'))
})

onMounted(() => {
  getConfig()
  getRecords()
})
</script>

<template>
  <!-- <AppLoading v-if="(pageLoading)" full-screen /> -->
  <div class="flex flex-col items-center overflow-x-hidden activity-container">
    <div class="text-center font-medium text-[#B1BAD3] countdown">
      {{ $$t('倒计时活动') }}：永久
    </div>
    <LuckyWheel :size="314" :spin-duration="4" :min-turns="7" :tickets="recordRes?.lottery_tickets || 0" :is-login="isLogin" @done="handleWheelRes" />
    <LuckyWheelWordCard class="mt-16" :cards="transformCardData()" />
    <BaseButton class="my-[16px] w-[340px] h-[44px] text-[14px] font-[600] rounded-[4px]" bg-style="secondary" @click="handleClaim">
      {{ $$t('立即兑换') }}
    </BaseButton>
    <div class="text-center font-[500] text-[#B1BAD3] reward-desc">
      {{ $$t('收集兑换奖励', { wordle_tickets: wordle_tickets.str, amount: configRes?.conf?.collect_amount, currency: getCurrencyConfig(globalCurrencyCode).name }) }}
    </div>
    <div class="w-full">
      <div class="font-semibold title">
        {{ $$t('获取兑换券') }}
      </div>
      <div>
        <template v-for="(task, index) in tasks" :key="index">
          <LuckyWheelGetCouponTask :task="task" class="mt-12" @click="handleTaskClick(task.type)" />
        </template>
      </div>
    </div>
    <div class="mt-16">
      <div class="font-semibold title">
        {{ $$t('活动详情') }}
      </div>
      <!-- <div class="my-16">
                <AppPromotionBaseRuleText
                :amount="max_award" :currency-type="FIXED_DISPLAY_CURRENCY"
                :content="currentDetail"
                />
            </div> -->
    </div>
    <BaseDialog v-model="showClaim" show-close title="兑换奖金" :show="showClaim" height="auto" icon="uni-roulette" @close="showClaim = false">
      <div class="dialog-container">
        <LuckyWheelWordCard class="mb-20" :cards="cards" small />
        <div class="font-medium label">
          {{ $$t('目前可兑换数量') }}：0
        </div>
        <BaseInput
          v-model="claimCount" type="number" :msg="errCount" msg-after-touched
          :placeholder="$$t('请输入兑换数量')" @blur="handleBlur"
          @on-right-button="maxNumber"
        >
          <template #right-button>
            <div class="max-value text-center">
              <span>{{ $$t('最大值') }}</span>
            </div>
          </template>
        </BaseInput>
        <BaseButton class="mt-[20px] w-full h-[44px] text-[14px] font-[600] rounded-[4px]" bg-style="secondary" @click="handleClaimRes">
          {{ $$t('立即兑换') }}
        </BaseButton>
      </div>
    </BaseDialog>
    <BaseDialog v-model="showClaimRes" show-close :show="showClaimRes" height="auto" @close="showClaimRes = false">
      <div class="claim-res-container">
        <!-- <div>
                    <div class="text-[18px] font-medium text-tg-text-white text-center">{{t('恭喜您获得')}}</div>
                    <div class="text-[12px] text-tg-text-white text-center mt-4 mb-20">800 {{t('金币')}}</div>
                    <BaseImage class="w-60 h-60 m-5 mx-auto" url="/activity/png/word-collection/coins.png" />
                    <BaseImage class="w-70 h-41 m-5 mx-auto" url="/activity/png/word-collection/coupon.png" />
                </div> -->
        <div>
          <BaseImage class="m-[5px] mx-auto h-[70px] w-[70px]" url="/activity/png/word-collection/cry-face.png" />
          <div class="text-tg-text-white mt-10 text-center text-[18px] font-medium">
            {{ $$t('太遗憾了，没抽中奖品') }}
          </div>
          <div class="text-tg-text-white mt-[4px] text-center text-[12px]">
            {{ $$t('再接再厉') }}
          </div>
        </div>
        <BaseButton size="md" class="mt-[20px] w-full font-[600] h-[44px] text-[14px] rounded-[4px]" bg-style="secondary" @click="handleConfirm">
          {{ $$t('确定') }}
        </BaseButton>
      </div>
    </BaseDialog>
  </div>
</template>

<style lang="scss" scoped></style>
