<script lang="ts" setup>
import type { EnumCurrencyKey, TaskDetail } from '@tg/types'

import type { CurrencyCode } from '~/composables/useCurrencyData'
import { ApiJobTaskReceive } from '@tg/apis'
import { currencyConfig } from '~/composables/useCurrencyData'
import AppAmount from './AppAmount.vue'
import AppCurrencyIcon from './AppCurrencyIcon.vue'
import { IconTaskReceiveRecord, IconTaskArrow, IconTaskTip, IconChessFrame2 } from '@tg/icons'


defineOptions({
  name: 'AppTaskContent',
})
const TaskRecord = defineAsyncComponent(() => import('~/pages/[lang]/task/task-record.vue'))

const { t } = useI18n()
const { openNotify } = useNotify()
const TIP_REGISTER = t('finished_register')
const TIP_DOWNLOAD = t('finished_download')
const TIP_VERIFY = t('finished_verify')
const TIP_RECHARGE = [t('again_deposit'), t('Available')]
const TIP_BET = [t('rebet'), t('Available')]

const router = useLocalRouter()
const currentLang = getCurrentLanguageForBackend()
const { isLogin } = storeToRefs(useAppStore())
const { isMobile } = storeToRefs(useWindowStore())
const { pcDialogMap, mobileRouterMap } = useTaskHooks()
const { allCategory, currentCategory, allCategoryDetail, taskListDataLoading } = storeToRefs(useTaskStore())
const { changeCurrentCategory, getTaskListAsyncApi } = useTaskStore()
// 1.注册,2.下载,3.手机验证,4.累积存款,5.有效投注，6.邮箱验证，7.KYC认证，8.钱包/虚拟币存款
const leftTipsMap = new Map<number, any>([
  [1, TIP_REGISTER],
  [2, TIP_DOWNLOAD],
  [3, TIP_VERIFY],
  [4, TIP_RECHARGE],
  [5, TIP_BET],
  [6, TIP_VERIFY],
  [7, TIP_VERIFY],
  [8, TIP_RECHARGE],
])
const rulesMap = new Map([
  [1, t('task_center_get_bonus_rule1')],
  [2, t('task_center_get_bonus_rule2')],
  [3, t('task_center_get_bonus_rule3')],
  [6, t('task_center_get_bonus_rule6')],
  [7, t('task_center_get_bonus_rule7')],
])
const curLoading = ref<string[]>([])
const curBtnRef = ref(null)
const btnContainer = ref(null)
const { runAsync: getBonus } = useRequest(ApiJobTaskReceive, {
  onSuccess: (res) => {
    const id = res.task_id
    curLoading.value = curLoading.value.filter(cur => cur !== id)
    if (res.status !== 0) {
      openNotify({
        type: 'error',
        message: res.message,
      })
    }
    else {
      allCategoryDetail.value.forEach((item) => {
        const curId = item.task_info.id
        if (curId === id)
          item.state = 2
      })
    }
  },
  onError: (err) => {
    curLoading.value = []
    openNotify({
      type: 'error',
      message: err.cause as string,
    })
  },

})
const { openDialog } = useDialog({
  title: t('act_rule_label'),
  clazz: 'app-task-center-dialog',
  default: params => h('div', { class: 'p-[16px] pt-0 leading-[1.5] text-tg-text-lightgrey' }, params),
})
const { openDialog: openTaskRecord } = useDialog({
  title: t('receive_record_label'),
  clazz: 'app-task-center-dialog',
  default: params => h(TaskRecord, params),
})

const isLoading = computed(() => taskListDataLoading.value || allCategoryDetail.value?.length < 1)
const pcMenu = computed(() => {
  return allCategory.value.map(item => ({ title: item.category_name, value: item.id }))
})

function handleChangeType(value: string, index: number) {
  if (curLoading.value.length > 0)
    return
  if (curBtnRef.value && btnContainer.value && isMobile.value) {
    const target: HTMLElement = curBtnRef.value[index]
    const container: HTMLElement = btnContainer.value

    const targetLeft = target.offsetLeft
    const targetWidth = target.offsetWidth
    const containerWidth = container.offsetWidth
    const scrollLeft = targetLeft + targetWidth / 2 - containerWidth / 2

    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth',
    })
  }
  changeCurrentCategory(value)
  getTaskListAsyncApi({ lang: currentLang, category_id: value })
}

function isShowArrow(cur: number) {
  const curTip = leftTipsMap.get(cur)
  if (typeof curTip === 'object')
    return true
  return false
}

function getCurName(value: { task_info: { names: string } }) {
  const names = JSON.parse(value.task_info.names)
  return names[currentLang]
}
function curProcess(item: TaskDetail): number {
  if (!isLogin.value)
    return 0

  const taskType = item.task_info.ty
  const taskConfig = leftTipsMap.get(taskType)

  if (typeof taskConfig === 'string')
    return item.state === 0 ? 0 : 100

  if (typeof taskConfig === 'object') {
    const amount = Number(item.deposit_amount || 0)
    if (amount === 0)
      return 0

    const config = item.task_info?.job_config?.bonus_config || []
    if (!Array.isArray(config))
      return 0

    const target = config.find(conf => amount < Number(conf.amount))

    if (target) {
      const ratio = amount / Number(target.amount)
      return Math.min(Math.round(ratio * 100), 100)
    }
    return 100
  }

  return 0
}

function renderLeftTip({ item }: { item: TaskDetail }) {
  const detail = item.task_info
  const curTy = detail.ty
  const curTask = leftTipsMap.get(curTy)
  if (typeof curTask === 'object') {
    const tableList = detail.job_config.bonus_config
    const lastAmount = tableList[tableList.length - 1].amount
    if (Number(item.deposit_amount) > 0 && Number(item.deposit_amount) >= Number(lastAmount))
      return h('div', null, '-')

    const fir = item.next_level_threshold_amount
    const sec = item.next_level_award
    const curCode = item.task_info.job_config.currency_id
    const currencyType = codeToType(curCode)
    const decimal = currencyType ? currencyConfig[currencyType].decimal : 2
    return h('div', { class: 'center' }, [
      h('div', null, curTask?.[0]),
      h('div', null, application.formatNumDecimal(fir, decimal)),
      h('div', null, '，'),
      h('div', null, curTask?.[1]),
      h('div', null, sec),
    ])
  }
  return h('div', null, leftTipsMap.get(curTy))
}
function renderBonus(params: { item: TaskDetail }) {
  // 分为两种，一种是验证注册类，一种是投注存款类
  const { item: curTask } = params
  const curTy = curTask.task_info.ty

  if (rulesMap.has(curTy)) {
    const bonusDetail = curTask.task_info.job_config
    if (bonusDetail.bonus_type == 1)
      return h(AppAmount, { amount: bonusDetail.bonus_amount[0], currencyCode: bonusDetail.currency_id, noFormat: false })
    if (bonusDetail.bonus_type == 2) {
      const currencyType = codeToType(bonusDetail.currency_id)
      const decimal = currencyType ? currencyConfig[currencyType].decimal : 2
      return h('div', { class: 'center' }, [
        h('div', { style: { fontWeight: 500 } }, application.formatNumDecimal(bonusDetail.bonus_amount[0], decimal)),
        h('div', { style: { fontWeight: 500 } }, '～'),
        h(AppAmount, { amount: bonusDetail.bonus_amount[1], currencyCode: bonusDetail.currency_id }),
      ])
    }
  }
  else {
    const bonusDetail = curTask.task_info.job_config
    if (bonusDetail.bonus_type == 1)
      return h(AppAmount, { amount: bonusDetail.bonus_amount[0], currencyCode: bonusDetail.currency_id, noFormat: false })
    if (bonusDetail.bonus_type === 2)
      return h('div', { class: 'flex' }, [h('div', { class: 'font-semibold mr-[4px]' }, bonusDetail.bonus_amount[0]), h(AppCurrencyIcon, { currencyType: codeToType(bonusDetail.currency_id) || 'CNY' })])
  }
}
function showReceive(value: TaskDetail) {
  if (!isLogin.value)
    return
  const devices = value.task_info.job_config.device
  // 24 pc 25 h5
  if (!isPwa() && value.task_info.ty === 2 && (!devices.includes('24') || !devices.includes('25')))
    return

  const { state } = value
  return state !== 0 && state !== 2
}
function goToInnerPage(value: TaskDetail) {
  const id = value.task_info?.id
  const ty = String(value.task_info?.ty)
  if (isMobile.value) {
    const cur = mobileRouterMap.get(ty)
    cur && router.push(cur({ id, ty }))
    return
  }
  const cur = pcDialogMap.get(ty)
  cur && cur({ id, ty })
}
function dealGetBonus(item: TaskDetail) {
  const id = item.task_info.id
  curLoading.value.push(id)
  getBonus({ lang: currentLang, task_id: id })
}
function goToTaskRecord(value: TaskDetail) {
  if (!isMobile.value) {
    openTaskRecord({ id: value.task_info.id })
    return
  }

  router.push(`/task/task-record?id=${value.task_info.id}`)
}
function codeToType(code?: CurrencyCode): EnumCurrencyKey | undefined {
  if (code)
    return Object.entries(currencyConfig).map(([k, v]) => ({ type: k as EnumCurrencyKey, ...v })).filter(item => item.cur === code)[0]?.type
}
watch(isLogin, () => {
  getTaskListAsyncApi({ lang: currentLang, category_id: currentCategory.value })
})
</script>

<template>
  <div class="app-task-center" :class="[isMobile ? '' : 'flex mt-[20px]']">
    <div v-if="isMobile" ref="btnContainer" class="scroll-x grid auto-cols-max grid-flow-col mb-[10px] mt-[16px] gap-[10px] pb-[6px]">
      <div
        v-for="(item, index) of allCategory" ref="curBtnRef" :key="item.id" class="center h-[34px] min-w-[75px] cursor-pointer whitespace-nowrap rounded px-[6px] text-xs font-semibold text-white"
        :class="[currentCategory === item.id ? 'bg-[#1475E1]' : 'bg-[#2F4553]']"
        @click.stop="handleChangeType(item.id, index)"
      >
        {{ item.category_name }}
      </div>
    </div>
    <div v-else class="mr-[24px]" :class="[curLoading.length > 0 ? 'pointer-events-none' : '']">
      <BaseMenu v-model:model-value="currentCategory" :data="pcMenu" @update:model-value="handleChangeType" />
    </div>

    <!-- 分界线 -->
    <div :class="[isMobile ? '' : 'flex-1 p-[24px] bg-[#0F212E] rounded']">
      <BaseLoading v-if="isLoading" class="h-[80px]" />
      <template v-else>
        <div v-for="item of allCategoryDetail" :key="item.task_info.cate_id" class="relative last:mb-0" :class="[isMobile ? 'mb-[16px]' : 'mb-[24px]']">
          <div
            class="text-tg-text-lightgrey relative bg-[#213743] text-xs"
            :class="[showReceive(item) ? 'rounded-t-md ' : 'rounded-md ', isMobile ? 'py-[14px] pl-[12px] pr-[26px]' : 'py-[20px] px-[24px]']"
          >
            <div
              v-if="isLogin" class="absolute cursor-pointer" :class="[isMobile ? 'right-[3px] top-[3px]' : 'right-[10px] top-[10px]']"
              @click.stop="goToTaskRecord(item)"
            >
              <IconTaskReceiveRecord class="text-[14px] text-[#B1BAD3]" :class="[isMobile ? 'text-[14px]' : 'text-[20px]']" />
            </div>
            <div
              v-if="isShowArrow(item.task_info.ty)"
              :class="[isMobile ? 'right-[6px]' : 'right-[24px]']"
              class="absolute top-[50%] cursor-pointer -translate-y-[50%]" @click.stop="goToInnerPage(item)"
            >
              <IconTaskArrow name="task-arrow" class="text-[#B1BAD3]" :class="[isMobile ? 'text-[14px]' : 'text-[20px]']" />
            </div>
            <div v-if="showReceive(item)" class="absolute top-[50%] -translate-y-[50%]" :class="[isShowArrow(item.task_info.ty) ? 'right-[54px]' : 'right-[24px]']">
              <BaseButton v-if="!isMobile" :loading="curLoading.includes(item.task_info.id)" bg-style="primary" class="h-[44px] w-[143px] whitespace-nowrap text-[14px]" @click.stop="dealGetBonus(item)">
                {{ t('vip_right_now') }}
              </BaseButton>
            </div>
            <h1 class="flex" :class="[isMobile ? 'mb-[5px]' : 'mr-[209px] text-xl font-semibold mb-[10px]']">
              <span class="mr-auto">{{ getCurName(item) }}</span>
              <span v-if="isMobile" class="flex">
                {{ t('Bonus') }}
                <span class="text-tg-text-white">
                  <renderBonus :item="item" />
                </span>
              </span>
            </h1>
            <h2 :class="[isMobile ? 'w-[208px] mb-[5px]' : 'mr-[213px] mb-[10px]']">
              <div class="center">
                <BaseProgress :percent="curProcess(item)" :show-info="false" stroke-color="#FFFFFF" :class="[rulesMap.has(item.task_info.ty) ? 'mr-[10px]' : '!pr-[28px]']" />
                <div v-if="rulesMap.has(item.task_info.ty)" class="center cursor-pointer" @click.stop="openDialog(rulesMap.get(item.task_info.ty))">
                  <IconTaskTip name="task-tip" class="text-[#B1BAD3]" :class="[isMobile ? 'text-[18px]' : 'text-[20px]']" />
                </div>
              </div>
            </h2>
            <h3 class="flex" :class="[isMobile ? '' : 'mr-[243px]']">
              <renderLeftTip :item="item" />
              <span class="ml-auto flex">
                <div v-if="!isMobile" class="mr-[13px]">
                  <span class="flex">
                    {{ t('Bonus') }}
                    <span class="text-tg-text-white">
                      <renderBonus :item="item" />
                    </span>
                  </span>
                </div>
                {{ t('Available') }} <span class="font-[500] text-[#00E701]">{{ item.apply_amount }}</span>
                <AppCurrencyIcon :currency-type="codeToType(item.task_info.job_config.currency_id) || 'USDT'" class="ml-[4px]" />
              </span>
            </h3>
          </div>
          <div v-if="showReceive(item) && isMobile" :class="{ loading: curLoading.includes(item.task_info.id) }" class="center text-tg-text-white h-[32px] rounded-b-md bg-[#1475E1] text-xs font-semibold leading-[14px]" @click.stop="dealGetBonus(item)">
            <span v-if="curLoading.includes(item.task_info.id)">
              <IconChessFrame2 name="chess-frame2" class="ani-roll" />
            </span>
            <span v-else>{{ t('vip_right_now') }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-task-center {
  --tg-base-progress-inner-bg: #3c4f59;
  --tg-app-amount-font-weight: 500;
  --tg-app-amount-font-size: 12px;
  --tg-spacing-4: 4px;
}
.loading {
  opacity: 0.5;
  pointer-events: none;
}
</style>

<style>
.app-task-center-dialog {
  --tg-spacing-10: 16px;
  --tg-spacing-12: 16px;
}
</style>
