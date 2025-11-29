<script lang="ts" setup>
import type { TaskDetail } from '@tg/types'
import { ApiJobTaskReceive } from '@tg/apis'
import { AfunBaseAmount, AfunBaseCurrencyIcon, AfunBaseProgress } from '@tg/bccomponents'
import { IconChessFrame2, IconTaskReceiveRecord, IconTaskTip, IconUniArrowRight } from '@tg/icons'
import { useAppStore, useTaskStore } from '@tg/stores'
import { application, getCurrencyConfig } from '@tg/utils'
import { getLangForBackend } from '@tg/vue-i18n'
import { useTitle } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, h, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import AppLoading from '~/components/AppLoading.vue'
import { Message } from '~/utils'

defineOptions({
  name: 'AppTaskContent',
})

const { t } = useI18n()

const TIP_REGISTER = t('完成注册领取奖金。')
const TIP_DOWNLOAD = t('完成下载领取奖金。')
const TIP_VERIFY = t('完成验证领取奖金。')
const TIP_RECHARGE = [(a: string, b: string) => t('再存款可领取', [a, b])]
const TIP_BET = [(a: string, b: string) => t('再投注可领取', [a, b])]
const TASKINNERB = ({ id, ty }: { id: string, ty: string }) => `/task/task-inner-b?id=${id}`
const TASKINNERD = ({ id, ty }: { id: string, ty: string }) => `/task/task-inner-d?id=${id}&ty=${ty}`

const router = useRouter()
const currentLang = getLangForBackend() || 'en_US'
useTitle(t('任务中心'))

const { isLogin } = storeToRefs(useAppStore())
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
  [1, t('每个用户只能领取一次奖金，相同IP，相同设备重新注册无法领取奖金。')],
  [2, t('每个用户只能领取一次奖金，相同IP，相同设备，卸载重新下载注册无法领取奖金。')],
  [3, t('每个用户只能领取一次奖金，更换号码重新验证无法再次领取奖金。')],
  [6, t('每个用户只能领取一次奖金，更换邮箱重新验证无法再次领取奖金。')],
  [7, t('每个用户只能领取一次奖金，更换KYC重新验证无法再次领取奖金。')],
])
const tyRouterMap = new Map([
  ['4', TASKINNERD],
  ['5', TASKINNERB],
  ['8', TASKINNERD],
])
const curLoading = ref<string[]>([])
const curBtnRef = ref(null)
const btnContainer = ref(null)
const { runAsync: getBonus } = useRequest(ApiJobTaskReceive, {
  onSuccess: (res) => {
    const id = res.task_id
    curLoading.value = curLoading.value.filter(cur => cur !== id)
    if (res.status !== 0) {
      Message.error(res.message)
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
    Message.error(err.cause as string)
  },

})

const isLoading = computed(() => taskListDataLoading.value || allCategoryDetail.value?.length < 1)
function handleChangeType(value: string, index: number) {
  if (curLoading.value.length > 0)
    return
  if (curBtnRef.value && btnContainer.value) {
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
  return names[currentLang] || names.default
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
    const decimal = getCurrencyConfig(curCode).decimal
    return h('div', null, curTask?.[0](application.formatNumDecimal(fir, decimal), sec))
  }
  return h('div', null, leftTipsMap.get(curTy))
}
function renderBonus(params: { item: TaskDetail }) {
  // 分为两种，一种是验证注册类，一种是投注存款类
  const { item: curTask } = params
  const curTy = curTask.task_info.ty

  if (rulesMap.has(curTy)) {
    const bonusDetail = curTask.task_info.job_config
    if (bonusDetail.bonus_type === 1)
      return h(AfunBaseAmount, { amount: bonusDetail.bonus_amount[0], currencyCode: bonusDetail.currency_id, style: '--ss-base-amount-font-size: 12px', noFormat: false })
    if (bonusDetail.bonus_type === 2) {
      const decimal = getCurrencyConfig(bonusDetail.currency_id).decimal
      return h('div', { class: 'center' }, [
        h('div', { style: { fontWeight: 500, fontSize: '12px' } }, application.formatNumDecimal(bonusDetail.bonus_amount[0], decimal)),
        h('div', { style: { fontWeight: 500, fontSize: '12px' } }, '～'),
        h(AfunBaseAmount, { amount: bonusDetail.bonus_amount[1], currencyCode: bonusDetail.currency_id, style: '--ss-base-amount-font-size: 12px' }),
      ])
    }
  }
  else {
    const bonusDetail = curTask.task_info.job_config
    if (bonusDetail.bonus_type === 1)
      return h(AfunBaseAmount, { amount: bonusDetail.bonus_amount[0], currencyCode: bonusDetail.currency_id, style: '--ss-base-amount-font-size: 12px', noFormat: false })
    if (bonusDetail.bonus_type === 2) {
      if (isLogin.value) {
        return h('div', { class: 'flex' }, [
          h('div', { class: 'font-[600] mr-[4px]' }, bonusDetail.bonus_amount[0]),
          h(AfunBaseCurrencyIcon, { currencyType: getCurrencyConfig(bonusDetail.currency_id).name || 'CNY' }),
        ])
      }
      else {
        return h('div', { class: 'font-[600]' }, bonusDetail.bonus_amount[0])
      }
    }
  }
}
function showReceive(value: TaskDetail) {
  if (!isLogin.value)
    return

  const { state } = value
  return state !== 0 && state !== 2
}
function goToInnerPage(value: TaskDetail) {
  if (!isShowArrow(value.task_info.ty)) {
    return
  }
  const id = value.task_info?.id
  const ty = String(value.task_info?.ty)
  const cur = tyRouterMap.get(ty)
  cur && router.push(cur({ id, ty }))
}
function dealGetBonus(item: TaskDetail) {
  const id = item.task_info.id
  curLoading.value.push(id)
  getBonus({ lang: currentLang, task_id: id })
}
function goToTaskRecord(value: TaskDetail) {
  router.push(`/task/task-record?id=${value.task_info.id}`)
}

watch(isLogin, () => {
  getTaskListAsyncApi({ lang: currentLang, category_id: currentCategory.value })
})
</script>

<template>
  <div class="app-task-center ">
    <div ref="btnContainer" class="scroll-x hide-scroll-bar grid auto-cols-max grid-flow-col mb-[10px] mt-[16px] gap-[10px] pb-[6px]">
      <div
        v-for="(item, index) of allCategory" ref="curBtnRef" :key="item.id" class="center rounded-[4px] h-[34px] min-w-[75px] cursor-pointer whitespace-nowrap px-[6px] text-[12px] font-[600]"
        :class="[currentCategory === item.id ? 'bg-[linear-gradient(90deg,#24EE89_0%,#9FE871_100%)] text-[#000]' : 'bg-[#0F212E] text-[#fff]']"
        @click.stop="handleChangeType(item.id, index)"
      >
        {{ item.category_name }}
      </div>
    </div>

    <!-- 分界线 -->
    <div>
      <AppLoading v-if="isLoading" />
      <template v-else>
        <div v-for="item of allCategoryDetail" :key="item.task_info.cate_id" class="relative last:mb-0 mb-[16px]">
          <div
            class="relative bg-[#213743] text-[12px] py-[14px] pl-[12px]"
            :class="[
              showReceive(item) ? 'rounded-t-[6px]' : 'rounded-[6px] shadow-[0_2px_4px_0_rgba(0,0,0,0.2)]',
              isShowArrow(item.task_info.ty) || isLogin ? 'pr-[26px]' : 'pr-[7px]',
            ]"
            @click.stop="goToInnerPage(item)"
          >
            <div
              v-if="isLogin" class="absolute cursor-pointer text-[14px] text-[#B1BAD3] right-[3px] top-[3px]"
              @click.stop="goToTaskRecord(item)"
            >
              <IconTaskReceiveRecord />
            </div>
            <div
              v-if="isShowArrow(item.task_info.ty)"
              class="absolute top-[50%] cursor-pointer right-[6px] text-[#B1BAD3] text-[14px] -translate-y-[50%]"
            >
              <IconUniArrowRight class="text-[16px] text-[#9DABC9]" />
            </div>
            <h1 class="flex mb-[5px] font-[400]">
              <span class="mr-auto text-[#B1BAD3]">{{ getCurName(item) }}</span>
              <span class="flex text-[#B1BAD3]">
                {{ t('奖金') }}
                <span class="text-[#fff] ml-[1px]">
                  <renderBonus :item="item" />
                </span>
              </span>
            </h1>
            <h2 class="w-[208px] mb-[5px]">
              <div class="center">
                <AfunBaseProgress :value="curProcess(item)" height="8px" :show-percentage="false" background-color="#EBEBEB" bar-color="#fff" :class="[rulesMap.has(item.task_info.ty) ? 'mr-[10px]' : '!pr-[28px]']" />
                <div v-if="rulesMap.has(item.task_info.ty)" class="center text-[#B1BAD3] text-[18px] cursor-pointer" @click="Message.info(rulesMap.get(item.task_info.ty) as string)">
                  <IconTaskTip />
                </div>
              </div>
            </h2>
            <h3 class="flex font-[400] text-[#B1BAD3]">
              <renderLeftTip :item="item" />
              <span class="ml-auto flex items-start whitespace-nowrap">
                <div class="center">
                  {{ t('可领取') }}
                  <AfunBaseAmount class="green-amount ml-[1px]" :amount="item.apply_amount" :currency-code="item.task_info.job_config.currency_id" :no-format="false" style="--ss-base-amount-font-size: 12px" />
                </div>
              </span>
            </h3>
          </div>
          <div v-if="showReceive(item)" :class="{ loading: curLoading.includes(item.task_info.id) }" class="center h-[32px] rounded-b-[6px] bg-[linear-gradient(90deg,#24EE89_0%,#9FE871_100%)] text-[12px] font-[600] leading-[14px]" @click.stop="dealGetBonus(item)">
            <span v-if="curLoading.includes(item.task_info.id)">
              <IconChessFrame2 class="ani-roll" />
            </span>
            <span v-else class="text-black">{{ t('立即领取') }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style>
:root {
  --tg-green-amount-color: #24ee89;
  --ss-app-amount-font-weight: 500;
}
</style>

<style lang="scss" scoped>
.app-task-center {
  --ph-app-amount-font-weight: 500;
  --afun-base-amount-font-size: 12px;
  .green-amount {
    color: var(--tg-green-amount-color);
  }

  /* 确保滚动条完全隐藏 */
  .hide-scroll-bar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .hide-scroll-bar::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  .hide-scroll-bar::-webkit-scrollbar-track {
    display: none;
  }

  .hide-scroll-bar::-webkit-scrollbar-thumb {
    display: none;
  }
}
.loading {
  opacity: 0.5;
  pointer-events: none;
}
</style>
