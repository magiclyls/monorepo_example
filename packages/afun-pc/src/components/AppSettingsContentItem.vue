<script setup lang='ts'>
interface Props {
  /** 标题 */
  title: string
  /** 是否展示徽章  */
  badge?: boolean
  /** 最后一行 */
  lastOne?: boolean
  /** 按钮loading状态 */
  btnLoading?: boolean
  /** 是否验证 */
  verified?: boolean
  /** 按钮文字 */
  btnText?: string
  /** 依赖数据变化 disabled */
  dependsDisabled?: any[]
  showHr?: boolean
  /** 是否在dialog弹框中使用 */
  dialogBox?: boolean
  /** 是否在倒计时 */
  isCounting?: boolean
  /** 是否展示提交按钮 */
  showSubmitBtn?: boolean
}
defineOptions({
  name: 'AppSettingsContentItem',
})
const props = withDefaults(defineProps<Props>(), {
  lastOne: false,
  verified: false,
  badge: false,
  btnText: 'save',
  showHr: true,
  showSubmitBtn: true,
})
const emit = defineEmits(['submit'])

const initDisabled = ref(Boolean(props.dependsDisabled !== undefined
&& props.dependsDisabled && props.dependsDisabled.length))
const dependsData = computed(() =>
  props.dependsDisabled ? [...props.dependsDisabled] : [])

const onSubmit = function () {
  emit('submit')
  setTimeout(() => {
    if (props.dependsDisabled && props.dependsDisabled.length)
      initDisabled.value = true
  }, 150)
}

watch(() => dependsData.value, (val, old) => {
  if (val.length && old.length) {
    for (let i = 0; i < val.length; i++) {
      if (val[i] !== old[i]) {
        if (initDisabled.value)
          initDisabled.value = false
        break
      }
    }
  }
})
</script>

<template>
  <div
    class="settings-content-box settings-content-item setting-form-content"
    :class="{ 'not-last-one': !lastOne }"
  >
    <div class="content-top">
      <div class="top-title">
        <span>{{ props.title }}</span>
        <span v-if="props.badge" class="badge ml-[0.5rem]">{{ $t('verified') }}</span>
      </div>
      <div class="top-desc">
        <slot name="top-desc" />
      </div>
    </div>
    <div class="content-mid">
      <hr v-if="showHr">
      <div class="mid-form" :class="[showSubmitBtn ? 'py-[16px]' : 'pt-[16px] pb-[26px]']">
        <slot />
      </div>
    </div>
    <div v-if="showSubmitBtn" class="content-btm">
      <div class="btm-left">
        <slot name="btm-left" />
      </div>
      <div class="btm-right">
        <slot name="btm-right" />
        <BaseButton
          bg-style="primary"
          size="md"
          class="btn-width"
          :loading="btnLoading"
          :disabled="props.verified || initDisabled || isCounting"
          @click="onSubmit"
        >
          {{ $t(btnText) }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style>
:root{
  --tg-app-settings-content-item-style-max-width: 420px;
}
</style>

<style lang='scss' scoped>
.settings-content-box{
  .content-btm{
    padding: var(--tg-spacing-16);
    border-top: 1px solid var(--tg-secondary-main);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    @include webTheme('green'){
      border-top: 1px solid var(--tg-border-color-grey);
    }
    .btm-left {
      line-height: 21px;
      color: var(--tg-text-lightgrey);
    }
    .btm-right{
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      .btn-width{
        max-width: 100%;
        min-width: 12ch;
        @include webTheme('green'){
          --tg-base-button-style-bg: #F6D14A;
          --tg-base-button-style-bg-hover: var(--tg-sub-deepblue);
          --tg-text-dark: var(--tg-text-green-btn);
        }
      }
    }
  }
}
  .settings-content-item{
    width: 100%;
    height: auto;
    background-color: var(--tg-primary-main);
    border-radius: .5rem;
    border: 1px solid var(--tg-secondary-main);
    padding-top: var(--tg-spacing-28);
    @include webTheme('green'){
      border: 2px solid #197B59;
      background-color: #055434;
    }
    &.not-last-one{
      margin-bottom: var(--tg-spacing-32);
    }
    .content-top{
      padding: 0 var(--tg-spacing-16);
      .top-desc{
        margin-top: var(--tg-spacing-20);
        font-size: var(--tg-font-size-default);
        color: var(--tg-text-lightgrey);
        font-weight: var(--tg-font-weight-normal);
        line-height: 1.5;
        @include webTheme('green'){
          color: #42BC91;
        }
      }
      .top-title{
        font-size: var(--tg-font-size-lg);
        font-weight: var(--tg-font-weight-semibold);
        color: var(--tg-text-white);
        display: flex;
        align-items: center;
        @include webTheme('white'){
          color: var(--tg-text-white)
        }
        // gap: .5rem;
        .badge{
          font-size: var(--tg-font-size-xs);
          background-color: var(--tg-text-green);
          color: var(--tg-text-secondary-main);
          padding: 0 var(--tg-spacing-6);
          border-radius: 2em;
          line-height: 18px;
          @include webTheme('green'){
            background-color: #F6D14A;
          }
          @include webTheme('white'){
            background-color: #00E701;
            color: #071824;
          }
        }
      }
    }
    .content-mid{
      margin-top: var(--tg-spacing-20);
      padding: 0 var(--tg-spacing-16);
      hr{
        height: 1px;
        width: 100;
        background-color: var(--tg-secondary-main);
        @include webTheme('green'){
          background-color: var(--tg-border-color-grey);
        }
      }
      .mid-form{
        width: 100%;
        max-width: var(--tg-app-settings-content-item-style-max-width);
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
    }
  }
.setting-form-content{
  @include webTheme('white'){
    --tg-base-input-style-background-color:--tg-base-input-readonly-bg-color;
   --tg-base-input-style-bg:var(--tg-base-button-grey-style-bg);
   --tg-base-label-title-color:var(--tg-text-lightgrey);
    background-color:var(--tg-primary-main);
   --tg-secondary-dark:var(--tg-base-button-grey-style-bg);
    border-radius: 4px;
    .content-btm{
      border-top:1px solid #C1C1C1;
    }
  }
  @include webTheme('green'){
    --tg-base-input-style-background-color:--tg-base-input-readonly-bg-color;
    --tg-base-input-style-bg:var(--tg-base-button-grey-style-bg);
    --tg-base-label-title-color:var(--tg-text-lightgrey);
    background-color:var(--tg-body-bg);
    --tg-secondary-dark:var(--tg-base-button-grey-style-bg);
    border-radius: 4px;
    .content-btm{
      border-top:1px solid var(--tg-border-color-grey);
    }
    &.settings-content-box .content-btm .btm-right .btn-width{
      --tg-base-button-style-bg:var(--tg-tab-item-active);
    }
    --tg-icon-color:var(--base-tag-icon-color);
  }
}
</style>
