<script setup lang='ts'>
import {
  ApiExcludeSendMailCode,
  ApiMemberPhoneSms,
  ApiMemberExclude,
  ApiMemberStopBet
} from '@tg/apis';
import { IconUniArrowLeft } from '@tg/icons';

defineOptions({ name: 'AppPageSelfExclusion' })

const { t } = useI18n()
const appStore = useAppStore()
const { userInfo } = storeToRefs(appStore)
const { openNotify } = useNotify()

/** 1暂停投注 2自我排除 */
const dialogType = ref(1)
const captcha = ref('')
const show = ref(false)
const step = ref(1)
const countDown = ref(60)
const isCountDown = ref(false)
let timer: any = null
const now = dayjs();
const durationTimeStamp = ref(now.add(1, "day").unix())
const durationTimeStampList = [
  { label: t('one_day'), value: now.add(1, "day").unix() },
  { label: t('one_week'), value: now.add(1, "week").unix() },
  { label: t('one_month'), value: now.add(1, "month").unix() },
  { label: t('six_month'), value: now.add(6, "month").unix() },
  { label: t('one_year'), value: now.add(1, "year").unix() },
  { label: t('forever'), value: now.add(10, "year").unix() },
]

/** 暂停投注是否结束 */
const isStopBetOver = computed(()=>{
  if (userInfo.value && userInfo.value.stop_bet > 0) {
    return dayjs().isAfter(userInfo.value.stop_bet * 1000)
  }
  return true
})
/** 暂停投注截止文字 */
const stopBetTimeText = computed(() => {
  if (userInfo.value && userInfo.value.stop_bet > 0) {
    return dayjs(userInfo.value.stop_bet * 1000).format("YYYY-MM-DD HH:mm:ss")
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
    return t('no_sms')

  if (step.value === 1) {
    return isStopBetDialog.value ? t('suspend_betting') : t('extend')
  }

  return t(useCaptcha.value === 'email' ? 'label_email_check' : 'phone_verify')
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
          openNotify({
            type: 'success',
            title: t('bet_stop_completed'),
            message: t('bet_stop_completed2')
          })

          show.value = false
        })
      })
  }
  else {
    // 自我排除
    ApiMemberExclude({ ty, captcha: captcha.value, exclude: durationTimeStamp.value, domain: location.origin || '' })
      .then(() => {
        openNotify({
          type: 'success',
          title: t('extend_on'),
          message: t('extend_on_content')
        })
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
  <div class="flex flex-col gap-[24px] pb-[32px]">
    <!-- 暂停投注 -->
    <div class="box-outer">
      <div class="px-[24px]">
        <h6 class="text-[20px] font-[600] text-[#fff] leading-[28px] mb-[20px]">{{ t('suspend_betting') }}</h6>
        <div class="text-[16px] text-[#B1BAD3] font-[500] flex flex-col gap-[20px] leading-[1.5]">
          <p>{{ t('self_exclusion_tip1') }}</p>
          <p>{{ t('self_exclusion_tip2') }}</p>
          <p>{{ t('self_exclusion_tip3') }}</p>
        </div>
      </div>
      <div class="line"></div>
      <div class="flex justify-end px-[24px]">
        <BaseButton v-if="isStopBetOver" bg-style="primary" class="h-[44px]" style="--tg-base-button-min-width:124px;"
          @click="openDialog(1)">
          {{ t('request_to_suspend_betting') }}
        </BaseButton>
        <div v-else
          class="h-[44px] leading-[44px] whitespace-nowrap px-[20px] text-[#B1BAD3] font-[600] text-[16px] rounded-[4px] bg-[#213743] border-[1px] border-dashed border-[#B1BAD3]">
          {{ t('end_time') }}{{ t('colon') }}{{ stopBetTimeText }}
        </div>
      </div>
    </div>

    <!-- 自我排除 -->
    <div class="box-outer">
      <div class="px-[24px]">
        <h6 class="text-[20px] font-[600] text-[#fff] leading-[28px] mb-[20px]">{{ t('self_exclusion') }}</h6>
        <div class="text-[16px] text-[#B1BAD3] font-[500] flex flex-col gap-[20px] leading-[1.5]">
          <p>{{ t('extend_content_1') }}</p>
          <p>{{ t('self_exclusion_tip5') }}</p>
          <p>{{ t('self_exclusion_tip6') }}</p>
        </div>
      </div>
      <div class="line"></div>
      <div class="flex justify-end px-[24px]">
        <BaseButton bg-style="primary" class="h-[44px]" style="--tg-base-button-min-width:124px;"
          @click="openDialog(2)">
          {{ t('extend_btn') }}
        </BaseButton>
      </div>
    </div>

    <!-- 确认弹窗 -->
    <BaseDialog show-close :showIcon="step !== 1" :icon="step !== 1 ? IconUniArrowLeft : ''" :title="dialogTitle"
      :show="show" height="auto" @click-title="step === -1 ? (step = 2) : (step--)" @close="show = false">
      <div v-if="step === 1" class="flex flex-col gap-[16px] px-[16px] pb-[16px]">
        <BaseLabel :label="t('duration')" must>
          <BaseSelect class="mt-[4px]" v-model="durationTimeStamp" :options="durationTimeStampList" border popper
            :autoSize="true" style="--tg-base-select-popper-style-padding-x:12px;--tg-base-select-popper-style-padding-y:10.5px;" />
        </BaseLabel>
        <BaseButton bg-style="primary" size="md" class="h-[44px] w-full" @click="sendCode">
          {{ isStopBetDialog ? t('start_suspend_betting') : t('extend_btn_2') }}
        </BaseButton>
        <div v-if="isStopBetDialog"
          class="text-[12px] font-[500] text-[#B1BAD3] flex flex-col gap-[15px] leading-[1.5] p-[10px] rounded-[6px] border-dashed border-[1px] border-[#B1BAD3]">
          <span>{{ t('self_exclusion_tip7') }}</span>
          <span>{{ t('extend_content_5') }}</span>
        </div>
        <div v-else
          class="text-[12px] font-[500] text-[#B1BAD3] flex flex-col gap-[15px] leading-[1.5] p-[10px] rounded-[6px] border-dashed border-[1px] border-[#B1BAD3]">
          <span>{{ t('self_exclusion_tip9') }}</span>
          <span>{{ t('extend_content_5') }}</span>
        </div>
      </div>
      <div v-if="step === 2" class="flex flex-col justify-between gap-[16px] px-[16px] pb-[16px]">
        <span class="text">{{ t('extend_content_6', {
          phone: useCaptcha === 'email' ? maskEmail(userInfo!.email) :
            maskPhone(userInfo!.phone)
        }) }}</span>
        <div class="flex gap-[4px]">
          <BaseInput v-model="captcha" class="var" :max="6">
            <template v-if="countDown !== 0" #right-icon>
              <span v-show="countDown !== 0">{{ countDown }}s</span>
            </template>
          </BaseInput>
          <BaseButton v-if="countDown === 0" class="var" bg-style="primary" style="white-space: nowrap"
            @click="sendCode">
            {{ t('re_send') }}
          </BaseButton>
        </div>
        <span class="text cursor-pointer" @click="step = -1">{{ t('extend_content_7') }}</span>
        <BaseButton bg-style="primary" @click="submit(useCaptcha === 'email' ? 1 : 2)">
          <span>{{ t('submit') }}</span>
        </BaseButton>
      </div>
      <div v-if="step === -1" class="flex flex-col justify-between gap-[16px] px-[16px] pb-[16px]">
        <i18n-t class="text" keypath="verify_code_send_already" tag="div">
          {{ useCaptcha === 'email' ? t('mail') : t("cellphone") }}
        </i18n-t>
        <div class="text">
          1. {{ useCaptcha === 'email' ? t('check_your_email') : t('check_your_phone') }}
        </div>
        <div class="text">
          2.
          <i18n-t keypath="check_your_trash_box" tag="span">
            {{ useCaptcha === 'email' ? t('mail_item') : t("sms") }}
          </i18n-t>
        </div>
        <div class="text">
          3. {{ t('wait_for_10_mins') }}
        </div>
        <BaseButton bg-style="primary" size="xl" @click="step = 2">
          {{ t('confirm') }}
        </BaseButton>
      </div>
    </BaseDialog>
  </div>
</template>

<style lang='scss' scoped>
.box-outer {
  padding: 24px 0;
  width: 100%;
  border-radius: 4px;
  background-color: #213743;
  border: 2px solid #2F4553;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.20), 0 1px 2px 0 rgba(0, 0, 0, 0.12);

  .line {
    width: 100%;
    height: 1px;
    background-color: #2F4553;
    margin: 16px 0;
  }
}

.text {
  line-height: 1.5;
  color: #B1BAD3;
}
</style>
