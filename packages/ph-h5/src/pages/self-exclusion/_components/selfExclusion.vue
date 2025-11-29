<script setup lang='ts'>
import {
  ApiExcludeSendMailCode,
  ApiMemberExclude,
  ApiMemberPhoneSms,
  ApiMemberStopBet,
} from '@tg/apis'
import { PhBaseButton, PhBaseDialog, PhBaseInput, PhBaseLabel, PhBaseSelect } from '@tg/bccomponents'
import { useLogout } from '@tg/hooks'
import { IconBirArrow } from '@tg/icons'
import { useAppStore } from '@tg/stores'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Message } from '~/utils/index'

defineOptions({ name: 'AppPageSelfExclusion' })

const { t } = useI18n()
const appStore = useAppStore()
const { userInfo } = storeToRefs(appStore)

/** 1暂停投注 2自我排除 */
const dialogType = ref(1)
const captcha = ref('')
const show = ref(false)
const step = ref(1)
const countDown = ref(60)
const isCountDown = ref(false)
let timer: any = null
const now = dayjs()
const durationTimeStamp = ref(now.add(1, 'day').unix())
const durationTimeStampList = [
  { label: t('1天'), value: now.add(1, 'day').unix() },
  { label: t('1周'), value: now.add(1, 'week').unix() },
  { label: t('1个月'), value: now.add(1, 'month').unix() },
  { label: t('6个月'), value: now.add(6, 'month').unix() },
  { label: t('1年'), value: now.add(1, 'year').unix() },
  { label: t('永久'), value: now.add(10, 'year').unix() },
]

/** 暂停投注是否结束 */
const isStopBetOver = computed(() => {
  if (userInfo.value && userInfo.value.stop_bet > 0) {
    return dayjs().isAfter(userInfo.value.stop_bet * 1000)
  }
  return true
})
/** 暂停投注截止文字 */
const stopBetTimeText = computed(() => {
  if (userInfo.value && userInfo.value.stop_bet > 0) {
    return dayjs(userInfo.value.stop_bet * 1000).format('YYYY-MM-DD HH:mm:ss')
  }
  return null
})
const useCaptcha = computed(() => {
  if (userInfo.value?.email)
    return 'email'
  if (userInfo.value?.phone)
    return 'phone'
  return ''
})
/** 是否暂停投注 */
const isStopBetDialog = computed(() => dialogType.value === 1)
/** 弹窗标题 */
const dialogTitle = computed(() => {
  if (step.value === -1)
    return t('没有收到验证码？')

  if (step.value === 1) {
    return isStopBetDialog.value ? t('暂停投注') : t('自我排除')
  }

  return t(useCaptcha.value === 'email' ? '邮箱验证' : '手机验证码')
})

function startCountDown() {
  if (isCountDown.value)
    return
  countDown.value = 60
  isCountDown.value = true
  if (timer)
    clearInterval(timer)

  timer = setInterval(() => {
    countDown.value--
    if (countDown.value === 0) {
      clearInterval(timer)
      isCountDown.value = false
    }
  }, 1000)
}

function openDialog(type: 1 | 2) {
  dialogType.value = type

  show.value = true
  step.value = 1
}

function sendCode() {
  if (useCaptcha.value) {
    const callback = () => {
      step.value = 2
      startCountDown()
    }

    if (useCaptcha.value === 'email')
      ApiExcludeSendMailCode({ email: userInfo.value!.email }).then(callback)
    else
      ApiMemberPhoneSms({ type: 1, uid: userInfo.value!.uid }).then(callback)
  }
  else {
    submit(3)
  }
}

const { runMemberLogout } = useLogout(() => {
  show.value = false
})

function submit(ty: number) {
  // 暂停投注
  if (isStopBetDialog.value) {
    ApiMemberStopBet({ ty, captcha: captcha.value, stop_bet: durationTimeStamp.value, domain: location.origin || '' })
      .then(() => {
        appStore.updateUserInfo().then(() => {
          Message.success(t('您已经暂停投注功能'))
          show.value = false
        })
      })
  }
  else {
    // 自我排除
    ApiMemberExclude({ ty, captcha: captcha.value, exclude: durationTimeStamp.value, domain: location.origin || '' })
      .then(() => {
        Message.success(t('您已经启动自我排除'))
        runMemberLogout()
      })
  }
}

function maskEmail(email: string) {
  const prefix = email.slice(0, 3)
  const atIndex = email.indexOf('@')
  const suffix = email.slice(atIndex)
  const maskedPart = '*'.repeat(atIndex - 3)
  return prefix + maskedPart + suffix
}

function maskPhone(phoneNumber: string) {
  const areaCode = phoneNumber.split('-')[0]
  const cleanedNumber = phoneNumber.split('-')[1]
  const prefix = cleanedNumber.slice(0, 3)
  const suffix = cleanedNumber.slice(-4)
  const maskedPart = '*'.repeat(cleanedNumber.length - 7)
  return `${areaCode}-${prefix}${maskedPart}${suffix}`
}
</script>

<template>
  <div class="flex flex-col gap-[16rem] pb-[32rem]">
    <!-- 暂停投注 -->
    <div class="box-outer">
      <div class="px-[16rem]">
        <h6 class="text-[20rem] font-[500] text-[#0D2245] leading-[28rem] mb-[16rem]">
          {{ t('暂停投注') }}
        </h6>
        <div class="text-[14rem] text-[#6D7693] font-[400] flex flex-col gap-[20rem] leading-[1.5]">
          <p>{{ t('自我排除提示语1') }}</p>
          <p>{{ t('自我排除提示语2') }}</p>
          <p>{{ t('自我排除提示语3') }}</p>
        </div>
      </div>
      <div class="line" />
      <div class="flex justify-end px-[16rem]">
        <PhBaseButton v-if="isStopBetOver" style="--ph-base-button-font-size:14rem;" class="min-w-[124rem] h-[44rem]" @click="openDialog(1)">
          {{ t('请求暂停投注') }}
        </PhBaseButton>
        <div
          v-else
          class="h-[44rem] leading-[44rem] whitespace-nowrap px-[20rem] text-[#6D7693] font-[500] text-[14rem] rounded-[8rem] bg-[#fff] border-[1rem] border-dashed border-[#6D7693]"
        >
          {{ t('结束时间') }}{{ t('冒号') }}{{ stopBetTimeText }}
        </div>
      </div>
    </div>

    <!-- 自我排除 -->
    <div class="box-outer">
      <div class="px-[16rem]">
        <h6 class="text-[20rem] font-[500] text-[#0D2245] leading-[28rem] mb-[16rem]">
          {{ t('自我排除') }}
        </h6>
        <div class="text-[14rem] text-[#6D7693] font-[400] flex flex-col gap-[20rem] leading-[1.5]">
          <p>{{ t('自我排除提示') }}</p>
          <p>{{ t('自我排除提示语4') }}</p>
          <p>{{ t('自我排除提示语5') }}</p>
        </div>
      </div>
      <div class="line" />
      <div class="flex justify-end px-[16rem]">
        <PhBaseButton style="--ph-base-button-font-size:14rem;" class="min-w-[124rem] h-[44rem]" @click="openDialog(2)">
          {{ t('请求自我排除') }}
        </PhBaseButton>
      </div>
    </div>

    <!-- 确认弹窗 -->
    <PhBaseDialog
      v-model="show"
      :title="dialogTitle"
      height="auto" @click-title="step === -1 ? (step = 2) : (step--)" @close="show = false"
    >
      <template #icon>
        <IconBirArrow v-if="step !== 1" class="mr-[12rem] text-[#9DABC8] rotate-90" />
      </template>
      <!-- 第一页 -->
      <div v-if="step === 1" class="flex flex-col gap-[16rem] p-[16rem]">
        <PhBaseLabel :label="t('持续时间')" required>
          <PhBaseSelect v-model="durationTimeStamp" :options="durationTimeStampList" />
        </PhBaseLabel>
        <PhBaseButton size="md" class="h-[44rem] w-full" @click="sendCode">
          {{ isStopBetDialog ? t('开始暂停投注') : t('开始自我排除') }}
        </PhBaseButton>
        <div
          v-if="isStopBetDialog"
          class="text-[12rem] font-[400] text-[#6D7693] flex flex-col gap-[15rem] leading-[1.5] p-[10rem] rounded-[6rem] border-dashed border-[1rem] border-[#6D7693]"
        >
          <span>{{ t('自我排除提示语6') }}</span>
          <span>{{ t('联系我们的客服') }}</span>
        </div>
        <div
          v-else
          class="text-[12rem] font-[400] text-[#6D7693] flex flex-col gap-[15rem] leading-[1.5] p-[10rem] rounded-[6rem] border-dashed border-[1rem] border-[#6D7693]"
        >
          <span>{{ t('自我排除提示语7') }}</span>
          <span>{{ t('联系我们的客服') }}</span>
        </div>
      </div>
      <!-- 验证 -->
      <div v-if="step === 2" class="flex flex-col justify-between gap-[16rem] p-[16rem]">
        <span class="text-[#6D7693] font-[400]">
          {{ t('发送6位验证码', { phone: useCaptcha === 'email' ? maskEmail(userInfo!.email) : maskPhone(userInfo!.phone) }) }}
        </span>
        <PhBaseLabel :label="t('验证码')" required>
          <div class="flex gap-[4rem]">
            <PhBaseInput v-model="captcha" class="var" :max="6">
              <template v-if="countDown !== 0" #right>
                <span v-show="countDown !== 0">{{ countDown }}s</span>
              </template>
            </PhBaseInput>
            <PhBaseButton
              v-if="countDown === 0" style="white-space: nowrap;--ph-base-button-font-size:14rem;"
              @click="sendCode"
            >
              {{ t('重新发送') }}
            </PhBaseButton>
          </div>
        </PhBaseLabel>

        <span class="text-[#6D7693] font-[400] cursor-pointer" @click="step = -1">{{ t('没有收到验证码？') }}</span>
        <PhBaseButton @click="submit(useCaptcha === 'email' ? 1 : 2)">
          <span>{{ t('提交') }}</span>
        </PhBaseButton>
      </div>
      <!-- 没有收到验证码？ -->
      <div v-if="step === -1" class="flex flex-col justify-between gap-[16rem] p-[16rem]">
        <i18n-t class="text-[#6D7693]" keypath="验证码已发送至您的{0}，如果您多次尝试后仍未收到验证码，请:" tag="div">
          {{ useCaptcha === 'email' ? t('邮箱') : t("手机") }}
        </i18n-t>
        <div class="text-[#6D7693]">
          1. {{ useCaptcha === 'email' ? t('检查您的邮箱是否正常进入。') : t('检查您的电话是否停机。') }}
        </div>
        <div class="text-[#6D7693]">
          2.
          <i18n-t keypath="检查{0}是否在垃圾箱中。" tag="span">
            {{ useCaptcha === 'email' ? t('邮件') : t("短信") }}
          </i18n-t>
        </div>
        <div class="text-[#6D7693]">
          3. {{ t('该消息可能会延迟几分钟，请10分钟后尝试。') }}
        </div>
        <PhBaseButton @click="step = 2">
          {{ t('确认') }}
        </PhBaseButton>
      </div>
    </PhBaseDialog>
  </div>
</template>

<style lang='scss' scoped>
.box-outer {
  padding: 16rem 0;
  width: 100%;
  border-radius: 6rem;
  background-color: #fff;

  .line {
    width: 100%;
    height: 1rem;
    background-color: #ebebeb;
    margin: 16rem 0;
  }
}
</style>
