<script setup lang='ts'>
import { ApiMemberNoticeLimitCount } from '@tg/apis'

defineOptions({
  name: 'AppDialogNoMoreToday',
})
const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const {
  currentNoticeId,
  noticeList,
  saveCurrentNoticeId,
  removeCurrentNoticeId,
  checkIsNoMore,
  checkHideNoMoreTip,
} = useDialogSiteAnnouncementList()
const { bool: checked } = useBoolean(false)
const { bool: hide } = useBoolean(false)

function onNoMoreTipChecked(v: boolean) {
  if (isLogin.value) {
    ApiMemberNoticeLimitCount({
      types: 2,
      is_check: checked.value ? 1 : 2,
      ids: [noticeList.value.find(a => a.id === currentNoticeId.value)?.id ?? ''],
    })
  }
  if (v)
    return saveCurrentNoticeId()
  removeCurrentNoticeId()
}

watch(currentNoticeId, (a) => {
  checked.value = checkIsNoMore(a)
  hide.value = checkHideNoMoreTip(a)
})

onMounted(() => {
  checked.value = checkIsNoMore(currentNoticeId.value)
  hide.value = checkHideNoMoreTip(currentNoticeId.value)
})
</script>

<template>
  <div v-show="!hide" class="no-more flex items-center whitespace-nowrap">
    <BaseCheckBox
      v-model="checked"
      @check="onNoMoreTipChecked"
    >
      {{ t('dont_tip_today') }}
    </BaseCheckBox>
  </div>
</template>

<style lang='scss' scoped>
.no-more {
  --tg-base-checkbox-box-width: 16px;
  --tg-font-weight-semibold: 500;
  --tg-base-checkbox-label-font-size: 14px;
  --tg-border-color-main: #d8d8d8;
  --tg-border-color-deep-grey: #d8d8d8;
  --tg-secondary-main: transparent;
  --tg-base-checkbox-label-color: var(--tg-text-white);
  --tg-base-checkbox-outer-border-color: #d8d8d8;

  @include webTheme('white') {
    --tg-base-checkbox-label-color: #ffffff;
    --tg-base-checkbox-outer-border-color: #fff;
    --tg-base-checkbox-outer-border-color-active: #f2ca5c;
    --tg-border-color-deep-grey: #f2ca5c;
  }
  @include webTheme('green') {
    --tg-base-checkbox-outer-border-color: #fff;
  }
}
</style>
