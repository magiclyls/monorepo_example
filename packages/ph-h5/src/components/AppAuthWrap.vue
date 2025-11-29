<script setup lang='ts'>
import { PhBaseButton } from '@tg/bccomponents'
import { useAppStore, useBrandStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserVerify } from '~/hooks'

defineOptions({
  name: 'AppAuthWrap',
})

defineProps<Props>()

const router = useRouter()

interface Props {
  showMore?: boolean
}
// 获取安全验证配置
const { isOpenVerify, isOpenEmailVerify, isOpenMobileVerify } = storeToRefs(useBrandStore())
const { isSetAuth } = storeToRefs(useAppStore())
const { isEmailVerify, isPhoneVerified, isSecuritySafeCheckPage } = useUserVerify()
/**
 * 如果后台开了邮箱手机其中一个就必须要绑定
   2个都开就绑定其中一个
   1个没开就直接显示
 */
const isShowDoubleCheck = computed(() => {
  if (isOpenEmailVerify.value && isOpenMobileVerify.value)
    return isEmailVerify.value || isPhoneVerified.value

  if (isOpenEmailVerify.value)
    return isEmailVerify.value
  if (isOpenMobileVerify.value)
    return isPhoneVerified.value

  return true
})
</script>

<template>
  <div
    v-if="isShowDoubleCheck && isOpenVerify && !isSetAuth && !isSecuritySafeCheckPage"
    class="bg-white text-center rounded-[8rem] py-[16rem] px-[24rem] flex flex-col items-center gap-[8rem] text-[#6D7693] font-[400]"
  >
    <div>
      {{ $t('启用2FA描述') }}
    </div>

    <div class="flex">
      <PhBaseButton
        class="btn1"
        @click="router.push('/double-verify'); "
      >
        {{ $t('启用2FA') }}
      </PhBaseButton>
    </div>
  </div>
  <div v-if="showMore" class="center show-more">
    <PhBaseButton
      @click="router.push('/blog/vault-description'); "
    >
      {{ $t('了解更多有关利息宝的信息') }}
    </PhBaseButton>
  </div>
</template>

<style lang='scss' scoped>
.btn1 {
  --ph-base-button-font-size: 14rem;
  --ph-base-button-font-weight: 500;
  --ph-base-button-primary-text-color: white;
  --ph-base-button-primary-background-color: #025be8;
  --ph-base-button-border-radius: 4rem;
  --ph-base-button-padding-y: 10rem;
}
</style>
