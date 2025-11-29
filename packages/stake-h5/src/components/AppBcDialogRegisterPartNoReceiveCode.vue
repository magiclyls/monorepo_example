<script setup lang='ts'>
import { IconUniBack } from '@tg/icons'
interface Props {
  type: 'email' | 'phone'
}
defineOptions({
  name: 'AppDialogRegisterPartNoReceiveCode',
})
const props = defineProps<Props>()
defineEmits(['back'])

const { t } = useI18n()

const isEmailType = computed(() => props.type === 'email')
</script>

<template>
  <div class="mb-[12px] flex">
    <div class="flex cursor-pointer items-center text-[18px] font-semibold leading-[25px]" @click="$emit('back')">
      <IconUniBack class="text-[14px]" />
      <span class="text-tg-text-white ml-[5px]">{{ t('no_verification_code') }}</span>
    </div>
  </div>
  <i18n-t
    keypath="verify_code_send_already" tag="div"
    class="text-tg-text-lightgrey text-[14px] font-semibold leading-[1.5]"
  >
    {{ isEmailType ? t('mail') : t('cellphone') }}
  </i18n-t>
  <ol class="text-tg-text-lightgrey mb-[12px] ml-[16px] list-decimal text-[14px] font-semibold leading-[1.5]">
    <li class="mb-[8px]">
      {{ isEmailType ? t('check_your_email') : t('check_your_phone') }}
    </li>
    <li class="mb-[8px]">
      <i18n-t
        keypath="check_your_trash_box" tag="div"
      >
        {{ isEmailType ? t('mail_item') : t('sms') }}
      </i18n-t>
    </li>
    <li>
      {{ t('wait_for_10_mins') }}
    </li>
  </ol>
  <BaseButton class="w-full" style="background: linear-gradient(90deg, #24EE89 0%, #9FE871 100%);" @click="$emit('back')">
    {{ t('confirm') }}
  </BaseButton>
</template>

<style lang='scss' scoped>

</style>
