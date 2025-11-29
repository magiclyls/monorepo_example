<script setup lang='ts'>
import { IconUniHook } from '@tg/icons'

interface Props {
  password: string
  hasErrorMsg?: boolean
  pwdTouched?: boolean
  type?: 'col' | 'row'
}
defineOptions({
  name: 'AppPasswordVerify',
})
const props = withDefaults(defineProps<Props>(), {
  password: '',
  hasErrorMsg: false,
  type: 'col',
})
const emit = defineEmits(['pass'])

const { t } = useI18n()

/** 包含大小写字母 */
const upperLowerRegOk = computed(() => upperLowerReg.test(props.password))
/** 包含数字 */
const lastOneNumberRegOk = computed(() => lastOneNumberReg.test(props.password))
/** 长度至少8个字符 */
const lengthOk = computed(() => props.password.length >= 8)
const level = computed(() => [upperLowerRegOk.value, lastOneNumberRegOk.value, lengthOk.value].filter(a => !!a).length)
const levelText = computed(() => {
  switch (level.value) {
    case 0:
      return t('pwd_danger')
    case 1:
      return t('pwd_danger')
    case 2:
      return t('pwd_normal')
    case 3:
      return t('pwd_safety')

    default:
      return '-'
  }
})

watch(() => props.password, () => {
  emit('pass', upperLowerRegOk.value
  && lastOneNumberRegOk.value
  && lengthOk.value)
})
</script>

<template>
  <div
    v-if="type === 'col'"
    class="app-password"
    :class="{
      'all-ok': upperLowerRegOk && lastOneNumberRegOk && lengthOk,
      'all-not-ok': !upperLowerRegOk && !lastOneNumberRegOk && !lengthOk,
      'has-error-msg': hasErrorMsg,
      'pwd-not-touched': !pwdTouched,
    }"
  >
    <div class="item mb-[8px]">
      <IconUniHook v-if="upperLowerRegOk" class="hook-2 mr-[8px]" name="uni-hook" />
      <IconUniHook v-else class="hook-1 mr-[8px]" name="uni-hook" />
      {{ t('pop_up_create_account_uppercase_lowercase_letter') }}
    </div>
    <div class="item mb-[8px]">
      <IconUniHook v-if="lastOneNumberRegOk" class="hook-2 mr-[8px]" name="uni-hook" />
      <IconUniHook v-else class="hook-1 mr-[8px]" name="uni-hook" />
      {{ t('pop_up_create_account_passcode_least_1_number') }}
    </div>
    <div class="item">
      <IconUniHook v-if="lengthOk" class="hook-2 mr-[8px]" name="uni-hook" />
      <IconUniHook v-else class="hook-1 mr-[8px]" name="uni-hook" />
      {{ t('least_8_characters') }}
    </div>
  </div>
  <div v-else-if="type === 'row'" class="h-[21px] w-full flex items-center gap-[10px] @md:gap-[17px]">
    <div class="flex grow items-center gap-[5px]">
      <div class="theme-normal h-[5px] grow rounded-[28px]" :class="[level > 2 ? ' theme-green' : level > 1 ? ' theme-warn' : 'theme-error']" />
      <div class="theme-normal h-[5px] grow rounded-[28px]" :class="[level > 2 ? ' theme-green' : level > 1 ? ' theme-warn' : '']" />
      <div class="theme-normal h-[5px] grow rounded-[28px]" :class="[level > 2 ? ' theme-green' : '']" />
    </div>
    <span
      class="inline-block whitespace-nowrap text-[12px] font-medium leading-[21px]"
      :class="[level > 2 ? 'text-tg-text-green theme-text-green' : level > 1 ? 'text-tg-text-warn theme-text-warn' : 'text-tg-text-error theme-text-error']"
    >
      {{ levelText }}
    </span>
  </div>
</template>

<style>
:root{
  --tg-normal-bg: var(--tg-secondary-main);
}
[theme="green"]{
  --tg-secondary-main:#197b59;
}
[theme="white"]{
  --tg-secondary-main:#c1c1c1;
}
</style>

<style lang='scss' scoped>
.theme-normal{
  background-color: var(--tg-secondary-main);
}
.theme-green{
  background-color: var(--tg-text-green);
  @include webTheme('white'){
    background-color: #00A501;
  }
  @include webTheme('green'){
    background-color: #1FFF20;
  }
}
.theme-warn{
  background-color: var(--tg-text-warn);
  @include webTheme('white'){
    background-color: #FF9800;
  }
}
.theme-error{
  background-color: var(--tg-text-error);

  @include webTheme('white'){
    background-color: #ED4163;

  }
}
.theme-text-green{
  @include webTheme('white'){
    color: #00A501;
  }
  @include webTheme('green'){
    color: #1FFF20;
  }
}
.theme-text-warn{
  @include webTheme('white'){
    color: #FF9800;
  }
}
.theme-text-error{
  @include webTheme('white'){
    color: #ED4163;
  }
}
.hook-1 {
  --tg-icon-color: var(--tg-text-lightgrey);
  font-size: var(--tg-font-size-base);
}
.hook-2 {
  --tg-icon-color: var(--tg-text-green-deep);
  font-size: var(--tg-font-size-base);
}
.app-password {
  display: flex;
  flex-direction: column;
  // gap: var(--tg-spacing-8);
  color: var(--tg-text-lightgrey);
  font-size: var(--tg-font-size-xs);
  margin-top: var(--tg-spacing-8);
  margin-bottom: var(--tg-spacing-4);
  &.all-ok {
    margin-top: var(--tg-spacing-8);
  }
  &.has-error-msg {
    margin-top: var(--tg-spacing-4);
  }
  &.pwd-not-touched {
    margin-top: var(--tg-spacing-8);
  }
  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    // gap: var(--tg-spacing-8);
    line-height: var(--tg-spacing-16);
  }
}
</style>
