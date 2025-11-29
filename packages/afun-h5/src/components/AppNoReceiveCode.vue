<script setup lang='ts'>
import { AfunBaseButton } from '@tg/bccomponents'
import { IconRebateLeftArrow } from '@tg/icons'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

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
  <div class="grid gap-[12px]">
    <div class="flex">
      <div class="flex cursor-pointer items-center text-[18px] " @click="$emit('back')">
        <IconRebateLeftArrow class="text-[#B1BAD3] text-[14px] mr-[6px]" />
        <span class="ml-5 font-semibold leading-[24px]">{{ t('没有收到验证码') }}？</span>
      </div>
    </div>
    <i18n-t
      keypath="验证码已发送至您的{0}，如果您多次尝试后仍未收到验证码，请:" tag="div"
      class="text-[14px] text-[#B1BAD3] font-[600] leading-[21px]"
    >
      {{ isEmailType ? t('邮箱') : t('手机') }}
    </i18n-t>
    <ol class="ml-[16px] list-decimal leading-[21px] text-[14px] text-[#B1BAD3] font-[600] ">
      <li class="mb-[8px]">
        {{ isEmailType ? t('检查您的邮箱是否正常进入。') : t('检查您的电话是否停机。') }}
      </li>
      <li class="mb-[8px]">
        <i18n-t
          keypath="检查{0}是否在垃圾箱中。" tag="div"
        >
          {{ isEmailType ? t('邮件') : t('短信') }}
        </i18n-t>
      </li>
      <li>
        {{ t('该消息可能会延迟几分钟，请10分钟后尝试。') }}
      </li>
    </ol>
    <AfunBaseButton class="w-full" @click="$emit('back')">
      {{ t('确认') }}
    </AfunBaseButton>
  </div>
</template>

<style lang='scss' scoped>

</style>
