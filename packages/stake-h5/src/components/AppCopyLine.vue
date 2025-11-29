<script lang="ts" setup>
import { IconUniDoc } from '@tg/icons'
interface Props {
  msg: string
  title?: string
  label?: string
  copyTip?: string
  hideCopy?: boolean
  loading?: boolean
  placeholder?: string
}
defineOptions({
  name: 'AppCopyLine',
})
defineProps<Props>()

const { t } = useI18n()
</script>

<template>
  <div class="app-copy-line wrapper">
    <div class="link white-copy-link">
      <span v-if="title" class="title">{{ title }}</span>
      <div class="wrap">
        <label class="stacked">
          <div class="input-wrap" :class="{ loading }">
            <div class="input-content" :class="{ 'square-right-border': !hideCopy && msg }">
              <input
                :value="msg" autocomplete="on" readonly class="input spacing-expanded" type="text"
                tooltipvisible="false" :placeholder="placeholder"
              >
              <span v-show="loading" class="absolute left-[7px] top-[7px]">⌛</span>
            </div>
            <div v-if="!hideCopy" class="theme-icon button-box hover:bg-tg-border-color-deep-grey overflow-hidden rounded-r-[4px]">
              <AppTooltip v-if="!hideCopy && msg" :text="t('copy_success')" @click="application.copy(msg)">
                <template #content>
                  <BaseButton size="none" class="text-[14px]" style="--tg-base-button-border-radius:0;background-color: transparent;">
                    <IconUniDoc class="text-[16px]" />
                  </BaseButton>
                </template>
              </AppTooltip>
            </div>
          </div>
          <span class="label-content">
            <div v-if="label" class="label-left-wrapper">{{ label }}</div>
          </span>
        </label>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --app-copyline-line-height: 1.5;
  --app-copyline-font-size: var(--tg-font-size-default);
  --app-copyline-color: var(--tg-text-white);
  --app-copyline-button-padding: 13px;
  --tg-app-copy-line-input-expanded-px: var(--tg-spacing-7);
  --tg-app-copy-line-input-expanded-py: var(--tg-spacing-7);
  --tg-app-copy-line-input-wrap-box-shadow: var(--tg-box-shadow);
  --tg-app-copy-line-input-background-color: var(--tg-secondary-main);
  --tg-app-copy-line-button-box-background-color: var(--tg-secondary-main);
  --tg-app-copy-line-input-border-color: var(--tg-secondary-main);
  --app-copyline-theme-icon-color: var(--app-copyline-color);
}
[theme="white"] {
  --tg-base-button-grey-bg: #f5f5f5;
  --tg-app-copy-line-input-background-color:#e8e8e8;
  --tg-app-copy-line-input-border-color: #e8e8e8;
  --tg-app-copy-line-button-box-background-color-white: #e8e8e8;

}
[theme="green"] {
  --app-copyline-theme-icon-color: #5ECEA6;
}
</style>

<style lang="scss" scoped>
.wrapper {
  .theme-icon{
    @include webTheme('green'){
      --tg-text-white: #FFEEB0;
      --tg-icon-color: var(--app-copyline-theme-icon-color);
    }
  }
  display: flex;
  flex-direction: column;
  --tg-icon-color: var(--app-copyline-color);
  .button-box {
    padding: var(--app-copyline-button-padding);
    background-color: var(--tg-app-copy-line-button-box-background-color);
    @include webTheme('white'){
        background-color: var(--tg-app-copy-line-button-box-background-color-white);
    }
    &:hover,&:active{
      @include webTheme('green'){
        background-color: #197B59;
      }
      @include webTheme('white'){
        background-color: #F2CA5C;
      }
    }
  }

  .link {
    display: flex;
    flex-direction: column;
    width: 100%;
    color: var(--app-copyline-color);
    font-size: var(--app-copyline-font-size);
    font-weight: var(--tg-font-weight-semibold);
    line-height: var(--app-copyline-line-height);

    .title {
      display: inline-flex;
      align-items: center;
      text-align: left;
      justify-content: flex-start;
      line-height: 2;
      color: var(--tg-text-white);
    }

    .wrap {
      display: flex;
      width: 100%;
      position: relative;

      >label {
        flex-grow: 1;
        display: inline-flex;
        flex-direction: row-reverse;
        align-items: center;
        position: relative;
      }

      label.stacked {
        flex-direction: column-reverse;
        align-items: flex-start;

      }

      .input-wrap {
        &:hover{
          @include webTheme('green'){
            // outline: 2px solid #FFEFB0;
          }
        }
        width: 100%;
        display: flex;
        flex-shrink: 0;
        box-shadow: var(--tg-app-copy-line-input-wrap-box-shadow);
        border-radius: var(--tg-radius-default);

        &.loading {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .input-content {
          position: relative;
          flex-grow: 1;
          width: 100%;
          display: flex;

          input {
            width: 100%;
            color: var(--app-copyline-color);
            background: var(--tg-app-copy-line-input-background-color);
            border: 2px solid var(--tg-app-copy-line-input-border-color);
            border-radius: var(--tg-radius-default);
            letter-spacing: 0;
            font-weight: var(--tg-font-weight-semibold);
            transition: all .25s;
            outline: 0;
            margin: 0;
            cursor: text;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            font-size: var(--app-copyline-font-size);
            box-shadow: none;

            &::placeholder {
              color: var(--tg-base-input-style-placeholder-color);
              opacity: var(--tg-base-input-style-placeholder-opacity);
            }

            &:hover {
              border-color: var(--tg-border-color-deep-grey);
            }
          }

          &.square-right-border input {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }

          .input.spacing-expanded {
            padding: var(--tg-app-copy-line-input-expanded-py) var(--tg-app-copy-line-input-expanded-px);
          }
        }
      }

      .label-content {
        display: inline-flex;
        align-items: center;
        font-size: var(--tg-font-size-default);
        font-weight: var(--tg-font-weight-semibold);
        color: var(--tg-text-lightgrey);
        transition: all 0.2s;
        letter-spacing: 0;
        padding: 0 0 var(--spacing-0-25);
        justify-content: space-between;

        .label-left-wrapper {
          display: inline-flex;
          width: 100%;
          line-height: 14px;
          padding-bottom: 4px;
        }
      }
    }
  }
}
.white-copy-link{
  @include webTheme('white'){
    .input-wrap .input-content input{
      --tg-secondary-main:var(--tg-base-button-grey-bg);
    }
    .bg-tg-secondary{
      --tg-secondary-main:var(--tg-base-button-grey-bg);
    }
  }
  @include webTheme('green'){
    --tg-border-color-deep-grey:var(--tg-border-color-grey);
    .input-wrap .input-content input{
      --tg-secondary-main:var(--tg-base-button-grey-bg);
    }
    .bg-tg-secondary{
      --tg-secondary-main:var(--tg-base-button-grey-bg);
    }
  }
}
</style>
