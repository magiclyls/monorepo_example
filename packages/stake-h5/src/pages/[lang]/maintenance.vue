<script setup lang='ts'>
import { IconKefu } from '@tg/icons'

defineOptions({ name: 'Maintenance' })

const { isMobile } = storeToRefs(useWindowStore())
const { maintainData } = storeToRefs(useAppStore())
const { push } = useLocalRouter()
const { t } = useI18n()

const configText = computed(() => {
  if (!maintainData.value)
    return ''
  const { maintain, state, content } = maintainData.value
  // state 1 正常, 2 站点限制, 3 站点冻结
  // maintain 1 开放 2 维护
  if (state === '3') {
    // 优先判断
    return ''
  }
  else if (maintain === '2') {
    return content
  }
})

function openService() {
  push('/service')
}
</script>

<template>
  <div class="theme-bg h-[100vh] w-full flex items-center justify-center" :class="[isMobile ? 'flex-col' : '']">
    <div :class="[isMobile ? 'w-[146px]' : 'w-[385px] mr-[59px]']">
      <BaseImage v-if="isMobile" url="/png/maintenance/banner-h5.png" />
      <BaseImage v-else url="/png/maintenance/banner-pc.png" />
    </div>
    <div class="right" :class="{ isMobile }">
      <h3 :class="{ isMobile }">
        {{ t('station_maintenance') }}
      </h3>
      <div class="p" :class="{ isMobile }" v-html="configText || t('maintenance_text')" />
      <div class="theme-btn" @click="openService">
        <div class="theme-icon">
          <IconKefu />
        </div>
        <span class="text">{{ t('connect_service') }}</span>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.theme-bg {
  @include webTheme('green') {
    background-color: #055434;
  }
}

.right {
  display: flex;
  flex-direction: column;
  max-width: 788px;
  align-items: flex-start;

  .theme-btn {
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    height: 71px;
    background-color: #0085FF;
    min-width: 188px;
    font-size: 20px;
    font-weight: 600;

    @include webTheme('green') {
      background-color: #02432D;
    }

    @include webTheme('white') {
      background-color: #F2CA5C;
    }

    .theme-icon {
      --tg-icon-color: #fff;
      font-size: 36px;
      display: flex;
      align-items: center;

      @include webTheme('green') {
        --tg-icon-color: #5ECEA6;
      }
      @include webTheme('white') {
        --tg-icon-color: #555;
      }
    }

    .text {
      margin-left: 8px;
      color: #fff;

      @include webTheme('green') {
        color: #5ECEA6;
      }
      @include webTheme('white') {
        color: #555;
      }
    }
  }

  h3 {
    color: var(--tg-text-lightgrey);
    font-size: 66px;
    font-weight: 600;
    line-height: normal;
    margin-bottom: 22px;
  }

  .p {
    color: var(--tg-text-lightgrey);
    font-size: 24px;
    font-weight: 500;
    line-height: normal;
    margin-bottom: 256px;
  }

  &.isMobile {
    max-width: 260px;
    align-items: center;

    h3 {
      margin-top: 13px;
      margin-bottom: 10px;
      font-size: 36.408px;
    }

    .p {
      width: 100%;
      font-size: 14.56px;
      margin-bottom: 30px;
    }

    .theme-btn {
      height: 50px;
      font-weight: 500;

      .theme-icon {
        font-size: 24px;
      }
    }
  }
}
</style>
