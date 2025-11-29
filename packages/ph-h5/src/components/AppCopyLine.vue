<script lang="ts" setup>
import { IconUniCopy } from '@tg/icons'
import { application } from '@tg/utils'
import { useI18n } from 'vue-i18n'
import AppTooltip from '~/components/AppTooltip.vue'

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
                name=""
                :value="msg" autocomplete="on" readonly class="input spacing-expanded placeholder-[#6D7693]" type="text"
                tooltipvisible="false" :placeholder="placeholder"
              >
              <span v-show="loading" class="absolute left-[7rem] top-[7rem]">⌛</span>
            </div>
            <div v-if="!hideCopy" class="theme-icon button-box overflow-hidden rounded-r-[4rem]">
              <AppTooltip v-if="!hideCopy && msg" :text="t('成功复制')" @click="application.copy(msg)">
                <template #content>
                  <IconUniCopy class="text-[16rem] text-[#0D2245]" />
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
  --tg-app-copyline-line-height: 1.5;
  --tg-app-copyline-font-size: 14rem;
  --tg-app-copyline-color: #0d2245;
  --tg-app-copyline-button-padding: 12rem;
  --tg-app-copy-line-input-expanded-rem: 6rem;
  --tg-app-copy-line-input-expanded-py: 6rem;
  --tg-app-copy-line-input-background-color: #ebebeb;
  --tg-app-copy-line-button-box-background-color: #ebebeb;
  --tg-app-copy-line-input-border-color: #ebebeb;
  --tg-app-copyline-theme-icon-color: #9dabc8;
}
</style>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  .button-box {
    padding: var(--tg-app-copyline-button-padding);
    background-color: var(--tg-app-copy-line-button-box-background-color);
  }

  .link {
    display: flex;
    flex-direction: column;
    width: 100%;
    color: var(--tg-app-copyline-color);
    font-size: var(--tg-app-copyline-font-size);
    font-weight: 600;
    // line-height: var(--tg-app-copyline-line-height);

    .title {
      display: inline-flex;
      align-items: center;
      text-align: left;
      justify-content: flex-start;
      line-height: 2;
      color: #fff;
    }

    .wrap {
      display: flex;
      width: 100%;
      position: relative;

      > label {
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
        width: 100%;
        display: flex;
        flex-shrink: 0;
        border-radius: 4rem;

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
            color: var(--tg-app-copyline-color);
            background: var(--tg-app-copy-line-input-background-color);
            border: 2rem solid var(--tg-app-copy-line-input-border-color);
            border-radius: 4rem;
            letter-spacing: 0;
            font-weight: 600;
            transition: all 0.25s;
            height: 40rem;
            outline: 0;
            margin: 0;
            cursor: text;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            font-size: var(--tg-app-copyline-font-size);
            box-shadow: none;
          }

          &.square-right-border input {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }

          .input.spacing-expanded {
            padding: var(--tg-app-copy-line-input-expanded-py) var(--tg-app-copy-line-input-expanded-rem);
          }
        }
      }

      .label-content {
        display: inline-flex;
        align-items: center;
        font-size: 14rem;
        font-weight: 600;
        color: #b1bad3;
        transition: all 0.2s;
        letter-spacing: 0;
        padding: 0 0 0;
        justify-content: space-between;

        .label-left-wrapper {
          display: inline-flex;
          width: 100%;
          line-height: 14rem;
          padding-bottom: 4rem;
        }
      }
    }
  }
}
</style>
