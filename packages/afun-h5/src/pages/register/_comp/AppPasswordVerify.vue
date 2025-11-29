<script setup lang='ts'>
import { lastOneNumberReg, upperLowerReg } from '@tg/utils'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  password: string
}

defineOptions({
  name: 'AppPasswordVerify',
})

const props = withDefaults(defineProps<Props>(), {
  password: '',
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
      return t('高风险')
    case 1:
      return t('高风险')
    case 2:
      return t('普通的')
    case 3:
      return t('安全的')

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
  <div v-show="password" class="flex items-center mt-[12px]">
    <div class="grid grid-cols-3 grow gap-5 mr-[17px]">
      <div class="bg-[#2F4553] h-[5px] rounded-[28px]" :class="[level > 2 ? ' bg-sucess' : level > 1 ? ' bg-warn' : 'bg-error']" />
      <div class="bg-[#2F4553] h-[5px] rounded-[28px]" :class="[level > 2 ? ' bg-sucess' : level > 1 ? ' bg-warn' : '']" />
      <div class="bg-[#2F4553] h-[5px] rounded-[28px]" :class="[level > 2 ? ' bg-sucess' : '']" />
    </div>
    <span
      class="inline-block whitespace-nowrap text-[12px] font-[600] leading-[21px]"
      :class="[level > 2 ? 'text-[#24EE89]' : level > 1 ? 'text-[#FF9800]' : 'text-[#ED4163]']"
    >
      {{ levelText }}
    </span>
  </div>
</template>

<style lang='scss' scoped>
.bg-sucess {
  background: #24ee89;
}
.bg-warn {
  background: #ff9800;
}
.bg-error {
  background: #ed4163;
}
</style>
