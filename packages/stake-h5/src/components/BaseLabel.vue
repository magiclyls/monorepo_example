<script setup lang='ts'>
import type { EnumCurrencyKey } from '@tg/types'

interface Props {
  label?: string // 标签
  labelContent?: string // 标签内容
  contentColor?: string // 内容颜色
  contentSize?: string // 内容字体
  must?: boolean // 必填
  mustSmall?: boolean // 小
  rightText?: string // 右侧文本
  icon?: Component // icon
  currentCurrency?: EnumCurrencyKey
  needFocus?: boolean
}
defineOptions({
  name: 'BaseLabel',
})
const props = withDefaults(defineProps<Props>(), {
  contentColor: '--tg-text-warn',
  contentSize: '12',
  must: false,
})

const baseLabelRef = ref()

function catchIt() {
  if (props.needFocus)
    baseLabelRef.value?.querySelector('input').focus()
}
</script>

<template>
  <div ref="baseLabelRef" class="base-label" @click="catchIt">
    <div class="label-wrap">
      <div class="label-left">
        <component v-if="props.icon" :is="props.icon"></component>
        <AppCurrencyIcon v-if="currentCurrency" :currency-type="currentCurrency" />
        <div class="label-title">
          {{ props.label }}
          <div
            v-if="props.must || props.mustSmall"
            :class="{ 'label-must': props.must, 'label-must-small': props.mustSmall }"
          >
            <span class="ml-[5px]">*</span>
          </div>
        </div>
        <div class="label-content" :style="`color:var(${props.contentColor});font-size:${props.contentSize}px`">
          {{ props.labelContent }}
        </div>
      </div>
      <div class="label-right">
        {{ props.rightText }}
      </div>
    </div>
    <slot />
  </div>
</template>

<style>
:root {
  --tg-base-label-title-line-height: 1 ;
  --tg-base-label-title-color:var(--tg-text-lightgrey);
}
</style>

<style lang='scss' scoped>
.base-label {
  font-size: var(--tg-font-size-default);

  .label-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .label-left {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: var(--tg-spacing-4);
      > *:not(:first-child) {
        margin-left: 0.25rem;
      }
      .label-title {
        color: var(--tg-base-label-title-color);
        font-weight: var(--tg-font-weight-semibold);
        font-size: var(--tg-font-size-default);
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: var(--tg-base-label-title-line-height);
        @include webTheme('green'){
          --tg-text-lightgrey: var(--tg-text-white);
        }
        @include webTheme('white'){
          color: #555;
        }
        .label-must {
          color: var(--tg-text-error);
        }

        .label-must-small {
          color: var(--tg-text-error);
          margin-left: var(--tg-spacing-4);
          font-size: 12px;
        }
      }
    }
    .label-right{
      font-size: 12px;
      margin-left: 0.5ch;
      display: inline-flex;
      align-items: center;
      font-weight: 600;
      color: var(--tg-text-lightgrey);
    }
  }
}
</style>
