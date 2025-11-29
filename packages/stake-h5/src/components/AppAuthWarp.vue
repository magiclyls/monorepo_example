<script setup lang='ts'>
interface Props {
  showMore?: boolean
}
defineOptions({
  name: 'AppAuthWarp',
})

defineProps<Props>()

const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { push } = useLocalRouter()

// 获取安全验证配置
const { isOpenVerify, isOpenEmailVerify, isOpenMobileVerify } = storeToRefs(useBrandStore())
const { isSetAuth } = useAuthConfig()
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
  <div v-if="isShowDoubleCheck && isOpenVerify && !isSetAuth && !isSecuritySafeCheckPage" class="safe-bottom" :style="{ 'padding-bottom': showMore ? '0' : '16px' }">
    <div class="text-center text-light">
      {{ t('improve_safe_level') }}
    </div>
    <BaseButton
      :bg-style="isStyle2() ? 'secondary' : 'primary'" size="md"
      @click="push('/settings/security-safe-check'); closeDialog()"
    >
      {{ t('turn_on_double_check') }}
    </BaseButton>
  </div>
  <div v-if="showMore" class="center show-more">
    <BaseButton
      size="none" type="text" style="margin-top: var(--tg-spacing-4);"
      @click="push('/blog/vault-description'); closeDialog()"
    >
      {{ t('vault_info') }}
    </BaseButton>
  </div>
</template>

<style lang='scss' scoped>
  .safe-bottom {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    background-color: var(--tg-secondary-dark);
    padding: 20px 16px;
    color: var(--tg-text-lightgrey);
    line-height: 1.5;
    div:first-of-type{
      margin-bottom: var(--tg-spacing-14);
    }
    .text-center{
      @include webTheme('green'){
        color: var(--tg-text-green-main);
      }
    }
    @include webTheme('white'){
      background-color: #e8e8e8;
    }
    @include webTheme('green'){
      background-color:#02432D;
    }
    .text-light{
      @include webTheme('white'){
        color: #555;
        }
    }
  }
  .show-more{
    background-color: var(--tg-secondary-dark);
    padding: 20px 16px;
    @include webTheme('green'){
      --tg-base-button-text-default-color: var(--tg-text-green-main);
    }
    @include webTheme('white'){
      background-color: #e8e8e8;
    }
    @include webTheme('green'){
      background-color:#02432D;
    }
  }
</style>
