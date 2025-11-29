<script setup lang="ts">
import { useRoute } from 'vue-router'


defineOptions({
  name: 'AppBetRecords',
})

const emit = defineEmits(['delMine'])
const route = useRoute()

const initType = route.query.type ? route.query.type.toString() : 'casino'

const { t } = useI18n()

const {
  settle,
  settleList,
} = useSportSelectSettle()

const currentTab = ref(initType)
const currentDaysTab = ref('today')


const tabList = [
  { label: t('casino'), value: 'casino' },
  { label: t('sports'), value: 'sports' },
]

const { bool: isFirst, setFalse: isFirstFalse } = useBoolean(true)

const isCasino = computed(() => currentTab.value === 'casino')
const isSports = computed(() => currentTab.value === 'sports')

const tabDaysList = [
  { label: t('today_text'), value: 'today' },
  { label: t('this_week'), value: 'week' },
  { label: t('this_month'), value: 'month' },
//   { label: t('this_year'), value: 'year' },
]

</script>

<template>
  <div class="app-bet-data">
    <div class="bet-data-head">
      <div class="flex justify-between w-full">
        <BaseTab 
          v-model="currentTab" 
          :list="tabList"
          size="large"  
          shape="square" 
          style="
            --tg-tab-style-active-bg: #24EE89;
            --tg-tab-style-box-padding:0;
            --tg-tab-style-wrap-bg-color: transparent;
            --tg-base-tab-background-color: #0F212E;
            --tg-tab-active-text-color: #05080a"
          />
          <div class="flex gap-[6px]">
            <BaseTab v-model="currentDaysTab" :list="tabDaysList" size="large"  shape="square" style="--tg-tab-style-active-bg: #2F4554;--tg-tab-style-box-padding:0;--tg-tab-style-wrap-bg-color: transparent;--tg-base-tab-background-color: #0F212E;--tg-base-tab-active-color:#fff"/>
            <BaseSelect
              v-show="isSports"
              v-model="settle"
              :style="'--tg-base-select-popper-style-padding-y:var(--tg-spacing-13);--tg-base-select-popper-style-padding-x:var(--tg-spacing-16);'"
              :options="settleList" popper
              @select="isFirstFalse()"
            />
          </div>
      </div>
    </div>
      <AppCasinoPageMyBet v-if="isCasino" :key="currentDaysTab" :is-first="isFirst" :period="currentDaysTab" />
      <AppSportsPageMyBet
        v-else-if="isSports" :key="settle + currentDaysTab" :is-first="isFirst"
        :settle="settle" :period="currentDaysTab"
      />
  </div>
</template>

<style lang="scss" scoped>
.app-bet-data {
  --tg-app-amount-font-weight: 400;
    background-color: var(--tg-primary-main);
    border-radius: 0.5rem;
    border: 1px solid var(--tg-secondary-main);
    padding: 24px;
  .bet-data-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--tg-spacing-4);
    .select-ranking {
      column-gap: var(--tg-spacing-10);
    }
  }
  .ranking-time {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: nowrap;
    color: var(--tg-text-white);
    font-size: var(--tg-font-size-default);
    padding: 16px 8px;
    border-bottom: var(--tg-spacing-2) solid rgba(255, 255, 255, 0.05);
    span {
      padding-left: var(--tg-spacing-8);
      font-weight: var(--tg-font-weight-semibold);
    }
    > div:hover {
      --tg-icon-color: var(--tg-text-white);
    }
  }
  .switch-hidden {
    cursor: pointer;
  }
  .game-box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    font-weight: var(--tg-font-weight-semibold);
    --app-sport-image-error-icon-size: 14px;
    .game-name {
      max-width: 12ch;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-left: 10px;
      color: var(--tg-text-white);
    }
  }
  .player-box {
    color: var(--tg-text-white);
  }
  .stealth-box {
    cursor: help;
  }
  .ranking-box {
    font-size: var(--tg-font-size-lg);
    display: flex;
  }
  .cursor-pointer {
    cursor: pointer;
    &:active {
      transform: scale(0.98);
    }
  }
}
.h5-mobile {
  --tg-table-th-padding-x: var(--tg-spacing-8);
  --tg-table-td-padding-x: var(--tg-spacing-8);
  --tg-table-tr-last-first-padding: var(--tg-spacing-16);
  // th:last-child {
  //   padding-right: var(--tg-spacing-16) !important;
  // }
  // th:first-child {
  //   padding-left: var(--tg-spacing-16) !important;
  // }
}
.amount-list {
  @include webTheme('green') {
    color: var(--tg-table-amount-color);
  }
}
</style>
