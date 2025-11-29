<script setup lang='ts'>
import { IconSptUserBet, IconUniClose } from '@tg/icons'

defineOptions({
  name: 'AppPageMyBets',
})
const { t } = useI18n()
const route = useRoute()
const router = useLocalRouter()
const { bool: isFirst, setFalse: isFirstFalse } = useBoolean(true)
const { isMobile } = storeToRefs(useWindowStore())
const initType = route.query.type ? route.query.type.toString() : 'casino'

const currentTab = ref(initType)
const currentDaysTab = ref('today')
const tabList = [
  { label: t('casino'), value: 'casino' },
  { label: t('sports'), value: 'sports' },
]
const tabDaysList = [
  { label: t('today'), value: 'today' },
  { label: t('this_week'), value: 'week' },
  { label: t('this_month'), value: 'month' },
]
const {
  settle,
  settleList,
} = useSportSelectSettle()

const isCasino = computed(() => currentTab.value === 'casino')
const isSports = computed(() => currentTab.value === 'sports')

function onDayTabChange(v: string) {
  isFirstFalse()
  currentDaysTab.value = v
}
function goBack() {
  if (isCasino.value)
    router.push('/casino')
  else if (isSports.value)
    router.push(`/sports/${getSportsPlatId()}`)
  else
    router.go(-1)
}
</script>

<template>
  <div class="my-bets">
    <BaseTemplate :template="['']">
      <div class="sports-page-title" style="min-height: auto">
        <div class="left">
          <IconSptUserBet />
          <h6>{{ t('h5_pop_up_menu_my_bets_page') }}</h6>
        </div>

        <div v-if="!isMobile" class="close" @click="goBack">
          <BaseButton type="text" size="none">
            <IconUniClose />
          </BaseButton>
        </div>
      </div>
    </BaseTemplate>
    <div v-if="isMobile" class="grid grid-flow-col my-[16px] justify-start gap-x-[8px]">
      <BaseButton
        v-for="item in tabDaysList" :key="item.value"
        :class="currentDaysTab === item.value ? 'tab-btn-active' : 'tab-btn'"
        @click="onDayTabChange(item.value)"
      >
        {{ item.label }}
      </BaseButton>
    </div>
    <!-- 娱乐城 | 体育 切换按钮 -->
    <div :class="[isMobile ? 'my-bets-content flex flex-col rounded-[4px] bg-deep px-[6px] mb-[16px]' : '']">
      <div class="tab-bar">
        <BaseTab
          v-model="currentTab" :list="tabList" :center="false"
          :class="isMobile ? 'light-tab' : ''"
          @change="isFirstFalse()"
        />
        <div class="theme-btn" :class="[!isMobile ? 'flex flex-row gap-[8px]' : '']">
          <template v-if="!isMobile">
            <BaseButton
              v-for="item in tabDaysList"
              :key="item.value"
              :class="{ 'active-btn': currentDaysTab === item.value }"
              :style="currentDaysTab === item.value
                ? '--tg-base-button-style-bg-hover:var(--tg-sport-btn-hover);--tg-base-button-style-bg:var(--tg-sport-btn-hover)'
                : '--tg-base-button-style-bg-hover:var(--tg-sport-btn-hover);--tg-base-button-style-bg:var(--tg-secondary-dark)'"
              @click="onDayTabChange(item.value)"
            >
              {{ item.label }}
            </BaseButton>
          </template>
          <BaseSelect
            v-show="isSports"
            v-model="settle"
            :class="{ ismobile: isMobile }"
            :style="isMobile
              ? '--tg-base-select-popper-style-padding-y:var(--tg-spacing-13);--tg-base-select-popper-style-padding-x:var(--tg-spacing-16);'
              : '--tg-base-select-popper-style-padding-y:var(--tg-spacing-13);--tg-base-select-popper-style-padding-x:var(--tg-spacing-16);'"
            :options="settleList" popper
            @select="isFirstFalse()"
          />
        </div>
      </div>
      <AppCasinoPageMyBet v-if="isCasino" :key="currentDaysTab" :is-first="isFirst" :period="currentDaysTab" />
      <AppSportsPageMyBet
        v-else-if="isSports" :key="settle + currentDaysTab" :is-first="isFirst"
        :settle="settle" :period="currentDaysTab"
      />
    </div>
    <!-- <div class="layout-spacing mt-[16px]">
      <AppBetData v-if="initType === 'casino'" mode="casino" :is-casino-mine="false" />
      <AppBetData v-else-if="initType === 'sports'" mode="sports" :is-casino-mine="false" />
    </div> -->
  </div>
</template>

<style lang='scss' scoped>
.tab-btn{
  --tg-base-button-style-bg-hover:var(--tg-sport-btn-hover);
  --tg-base-button-style-bg:var(--tg-secondary-dark);
  @include webTheme('green') {
    --tg-base-button-style-bg:#02432D;
    color: white;
  }
}
.tab-btn-active{
  --tg-base-button-style-bg-hover:var(--tg-sport-btn-hover);
  --tg-base-button-style-bg:var(--tg-sport-btn-hover);
  @include webTheme('white') {
    --tg-base-button-style-bg:#CBCBCB;
  }
  @include webTheme('green') {
    --tg-base-button-style-bg:#197B59;
    color: white;
  }
}
.light-tab{
  --tg-tab-style-wrap-bg-color: var(--tg-primary-main);
  @include webTheme('white') {
    --tg-tab-style-wrap-bg-color: #E8E8E8;
  }
  @include webTheme('green') {
    --tg-tab-style-wrap-bg-color: #076237;
    --tg-tab-style-active-bg:#02432D;
  }
}
.bg-deep{
  background-color: var(--tg-secondary-dark);
  @include webTheme('green') {
    background-color: #02432D;
  }
}
.my-bets{
  margin-top: var(--tg-spacing-24);
  // padding-top: var(--tg-spacing-12);
}
.tab-bar{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--tg-spacing-16);
}
.theme-btn{
  .ismobile{
    --tg-base-select-popper-bg-color:var(--tg-primary-main);
    @include webTheme('white'){
      --tg-base-select-popper-bg-color:#E8E8E8;
    }
    @include webTheme('green'){
      --tg-base-select-popper-label-color: white;
      --tg-base-select-popper-label-hover-color: white;
      --tg-base-select-popper-bg-color: #076237;
    }
  }

  @include webTheme('green'){
    --tg-base-button-color:#5ECEA6;
    .active-btn{
      --tg-base-button-color:#fff;
    }
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
  </route>
