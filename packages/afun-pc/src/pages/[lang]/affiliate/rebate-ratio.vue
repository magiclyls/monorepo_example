<script setup lang='ts'>
import RebateRatioList from '~/pages/[lang]/affiliate/rebate-ratio-list.vue'

const { isMobile } = storeToRefs(useWindowStore())
const { mode, type } = storeToRefs(useAffiliate())
const { t } = useI18n()
const types = computed(() => {
  return !(type.value == 2 && (mode.value == 2 || mode.value == 3))
    ? [
        {
          title: t('team_commission'),
          value: 'cond_team',
        },
      ]
    : [
        {
          title: t('direct_commission'),
          value: 'cond_direct',
        },
        {
          title: t('team_commission'),
          value: 'cond_team',
        },
      ]
})
const activeIndex = ref(0)
const selectType = computed(() => types.value[activeIndex.value].value)
</script>

<template>
  <div class="rebate" :class="[{ 'pc-mode': !isMobile, 'mobile-mode': isMobile }]">
    <div v-if="types.length > 1" class="ratio-type" :class="[{ 'pc-mode': !isMobile }]">
      <div
        v-for="(item, index) in types" :key="index" :class="{ 'active': index == activeIndex, 'mr-[4px]': index == 0 }"
        @click="activeIndex = index"
      >
        {{ item.title }}
      </div>
    </div>
    <Suspense timeout="0">
      <RebateRatioList :key="selectType" :select-type="selectType" clazz="white-rate" />
      <template #fallback>
        <AppLoadingWg full-screen />
      </template>
    </Suspense>
  </div>
</template>

<style lang='scss' scoped>
.ratio-type {
  font-family: "PingFang SC";
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--tg-secondary-dark);
  padding: 5px;
  border-radius: 4px;
  margin-bottom: 10px;

  div {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    height: 42px;
    font-weight: 500;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    color: #ffffff;

    @include webTheme('white') {
      color: #111111;
    }
  }

  .active {
    background: var(--tg-sport-btn-hover);

    @include webTheme('green') {
      background: #0E6746;
    }

    @include webTheme('white') {
      background: #F2CA5C;
      color: #111111;
    }
  }
}

.rebate {
  --tg-base-square-tab-bg: #213743;
}

.rebate.pc-mode {

  padding: calc(27px - 12px) calc(20px - 12px);
}

.mobile-mode {

  :deep(.tab) {

    .tab-wrap {
      background: transparent !important;
    }

    .name {
      font-size: 12px !important;
    }

    .button.active .icon-img {
      filter: initial !important
    }
  }
}

.ratio-type.pc-mode {
  display: inline-flex;
  justify-content: flex-start;
  background: #071824;
  margin-bottom: 14px;

  @include webTheme('white') {
    background-color: #E8E8E8;
    color: #111;
  }

  @include webTheme('green') {
    background-color: #055434;
    color: #3CB389;
  }

  .ratio-type {

    @include webTheme('white') {
      background: #F5F5F5;
    }

    @include webTheme('new-default') {
      background-color: #0F212E !important;
    }

    @include webTheme('green') {
      background-color: #02432D;
    }
  }

  div {
    flex: unset;
    min-width: 170px;
    height: 42px;
    padding: 0 24px;

    color: #fff;
    border-radius: 4px;
  }

  .active {
    background: var(--tg-sport-btn-hover) !important;
    color: #fff !important;

    @include webTheme('white') {
      background-color: #F2CA5C !important;
      color: #111 !important;
    }

    @include webTheme('green') {
      background-color: #0E6746 !important;
      color: #fff !important;
    }
  }
}

:deep(.tab-wrap) {
  background: transparent !important;

  .tab {
    .content-label {
      color: #B1BAD3 !important;

      @include webTheme('white') {
        color: #111111 !important;
      }

      @include webTheme('green') {
        color: #5ECEA6 !important;
      }
    }
  }

  .tab.active {
    .content-label {
      color: #FFFFFF !important;

      @include webTheme('white') {
        color: #F2CA5C !important;
      }

      @include webTheme('green') {
        color: #F6D14A;
      }
    }
  }

}
</style>
