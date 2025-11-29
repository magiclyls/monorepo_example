<script setup lang="ts">
interface Props {
  data?: {
    [key: string]: string | number
  }
  /** 1注册人数 2下级累计存款 3下级累计打码 4下级首存人数 5下级打码人数 6自身累计存款 7自身累计打码 8自身存款次数 */
  rollType?: number
}
defineOptions({
  name: 'AppDialogGetMoreReps',
})
const props = withDefaults(defineProps<Props>(), {
  rollType: 1,
})

const closeDialog = inject('closeDialog', () => { })
const { openInviteFriendHelpDialog } = useDialogInviteFriendHelp()

/** 是否显示金额条件 */
const showAmount = [2, 3, 6, 7].includes(props?.rollType)
const showText = {
  condition: `activity_turntable_add_reps_condition_${props?.rollType}`,
  finish: `activity_turntable_add_reps_finish_${props?.rollType}`,
  result: `activity_turntable_add_reps_result_${props?.rollType}`,
  rollCondition: props.data?.roll_condition,
  rollTimes: props.data?.roll_times,
  prizeRollTimes: props.data?.prize_roll_times,
  achievedRollCondition: props.data?.achieved_roll_condition,
  totalAchievedRollCondition: props.data?.total_achieved_roll_condition,
  currencyType: getCurrencyConfigByCode(props.data?.currency_id ?? '706').name,
}
const progress = toFixed(mul(+div(+(showText.achievedRollCondition ?? 0), +(showText.rollCondition ?? 1)), 100), 2)

function openHelp() {
  closeDialog()
  openInviteFriendHelpDialog({ pid: props.data?.pid })
}
// function getShowText() {
// switch (props?.rollType) {
//   case 1: return {
//     condition: 'activity_turntable_add_reps_condition_1',
//     finish: 'activity_turntable_add_reps_finish_1',
//     result: 'activity_turntable_add_reps_result_1',
//   }
//   case 2: return ''
//   case 3: return ''
//   case 4: return ''
//   case 5: return ''
//   case 6: return ''
//   case 7: return ''
//   case 8: return ''
//   default: return ''
// }
// }
</script>

<template>
  <div class="components-root flex flex-col p-[16px]">
    <div v-if="showAmount" class="text-center leading-[1.4] font-[600]">
      <i18n-t :keypath="showText.condition">
        <template #amount>
          <AppAmount
            class="inline-block" :amount="showText.rollCondition ?? ''"
            :currency-type="showText.currencyType"
          />
        </template>
        <template #reps>
          {{ showText.rollTimes }}
        </template>
      </i18n-t>
    </div>
    <div v-else class="text-color1 text-center leading-[1.4] font-[600]">
      {{ $t(showText.condition, {
        people: showText.rollCondition,
        reps: showText.rollTimes,
        reps1: showText.rollCondition,
      }) }}
    </div>
    <div class="w-full">
      <div class="theme-text flex justify-between">
        <div v-if="showAmount" class="center">
          <i18n-t :keypath="showText.finish">
            <AppAmount class="ml-[4px]" :amount="showText.achievedRollCondition ?? ''" :currency-type="showText.currencyType" />
          </i18n-t>
        </div>
        <div v-else>
          {{ $t(showText.finish, {
            people: showText.achievedRollCondition ?? '',
            reps: showText.achievedRollCondition ?? '',
          })
          }}
        </div>
        <span>{{ Number(progress) > 100 ? 100 : progress }}%</span>
      </div>
      <BaseProgress
        width="100%" :percent="Number(progress) > 100 ? 100 : Number(progress)" :show-info="false" :stroke-width="8"
        stroke-color="var(--tg-primary-success)" class="progress-bg"
      />
    </div>
    <div v-if="showAmount" class="theme-text2 text-center leading-[1.4] font-[600]">
      <i18n-t :keypath="showText.result">
        <template #amount>
          <AppAmount
            class="inline-block" :amount="showText.totalAchievedRollCondition ?? ''"
            :currency-type="showText.currencyType"
          />
        </template>
        <template #reps>
          {{ showText.prizeRollTimes }}
        </template>
      </i18n-t>
    </div>
    <div v-else class="text-color2 text-tg-secondary-light text-center leading-[1.4] font-[600]">
      {{ $t(showText.result, {
        people: showText.totalAchievedRollCondition,
        reps: showText.prizeRollTimes,
        reps1: showText.totalAchievedRollCondition,
      }) }}
    </div>
    <BaseButton bg-style="primary" size="md" @click="openHelp">
      {{ $t('more_share_with_friends') }}
    </BaseButton>
  </div>
</template>

<style lang="scss" scoped>
.components-root{
  > *:not(:first-child) {
    margin-top: 16px;
  }
  @include webTheme('green') {
    --tg-base-progress-inner-bg: #02432D;
    --tg-primary-success: #42BC91;
  }
  .text-color1 {
    @include webTheme('green') {
      color: #fff;
    }
  }
  .text-color2 {
    @include webTheme('green') {
      color: #42BC91;
    }
  }
  .progress-bg {
    --tg-base-progress-inner-bg: #0F212E;
    @include webTheme('green') {
      --tg-primary-success: #1FFF20;
      --tg-base-progress-inner-bg:#197B59;
    }
    @include webTheme('white'){
      --tg-primary-success:#F2CA5C;
      --tg-base-progress-inner-bg:#C1C1C1;
    }
  }
  .theme-text{
    @include webTheme('white'){
      font-weight: 500;
    }
  }
  .theme-text2{
    @include webTheme('white'){
      color: #555;
    }
    @include webTheme('green') {
      color: #3CB389;
    }
  }
}
</style>
