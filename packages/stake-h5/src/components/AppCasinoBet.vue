<script lang="ts" setup>
import { IconUniClose } from '@tg/icons'
import { ApiMemberUserBetList } from '@tg/apis'

defineOptions({
  name: 'AppCasinoBet',
})
const { t } = useI18n()
const { closeRightSidebar } = useRightSidebar()
const { isMobile } = storeToRefs(useWindowStore())
const { isLogin } = storeToRefs(useAppStore())
const languageStore = useLanguageStore()
const { userLanguage } = storeToRefs(languageStore)
const casinoStore = useCasinoStore()
const { hasBetOrder } = storeToRefs(casinoStore)

const { selected: headSelectValue, list: headSelectData } = useSelect([
  {
    label: t('all_bets'),
    value: 'casino-all',
  },
  {
    label: t('billboard'),
    value: 'casino-fy',
  },
  {
    label: t('competition'),
    value: 'ranking-list',
  },
], '')

const getIcon = computed(() => {
  switch (headSelectValue.value) {
    case 'casino-fy': return 'chess-vipclub'
    case 'ranking-list': return 'spt-competition'
    default: return 'tabbar-bet'
  }
})

function handleMine() {
  // headSelectData.value.shift()
  headSelectData.value = headSelectData.value.filter(i => i.value !== 'casino-mine')
  headSelectValue.value = 'casino-all'
}

// if (isLogin.value) {
//   headSelectData.value.unshift({
//     label: t('h5_bottom_menu_bets_top_drop_down_list_my_bets'),
//     value: 'casino-mine',
//   })
//   headSelectValue.value = 'casino-mine'
// }
// headSelectValue.value = 'casino-all'

// 我的投注
const {
  runAsync: runCasinoRecordList,
} = useRequest(ApiMemberUserBetList)

if (isLogin.value) {
  if (hasBetOrder.value) {
    headSelectData.value.unshift({
      label: t('h5_bottom_menu_bets_top_drop_down_list_my_bets'),
      value: 'casino-mine',
    })
    headSelectValue.value = 'casino-mine'
  }
  else {
    runCasinoRecordList({ page: 1, page_size: 1 }).then((res) => {
      if (res && res.d && res.d.length) {
        casinoStore.setHasBetOrder(true)
        headSelectData.value.unshift({
          label: t('h5_bottom_menu_bets_top_drop_down_list_my_bets'),
          value: 'casino-mine',
        })
        headSelectValue.value = 'casino-mine'
      }
      else {
        casinoStore.setHasBetOrder(false)
        headSelectData.value = headSelectData.value.filter(i => i.value !== 'casino-mine')
        headSelectValue.value = 'casino-all'
      }
    })
  }
}
else {
  headSelectValue.value = 'casino-all'
}

watch(() => isMobile.value, (newValue) => {
  if (!newValue)
    closeRightSidebar()
})
</script>

<template>
  <div class="app-notice">
    <div class="notice-head">
      <BaseSelect
        v-model="headSelectValue" :distance="10"
        style="--tg-base-select-hover-bg-color:var(--tg-secondary-grey);
          --tg-base-select-popper-style-padding-x: var(--tg-spacing-16);
          --tg-base-select-popper-style-padding-y: var(--tg-spacing-13);
          --tg-base-select-popper-label-radius: 999px;" :options="headSelectData"
        :style="{ '--tg-base-select-popcontent-lineheight': userLanguage === 'th-TH' ? 1.5 : 1 }"
        popper-clazz="casino-bet-pop"
        popper no-hover pop-prevent
      >
        <template #label="{ data }">
          <div class="center" style="gap: var(--tg-spacing-8);">
            <component :is="getIcon" />
            <span v-if="headSelectValue">{{ data?.label }}</span>
            <BaseSkeleton
              v-else
              bg="#B1BAD3"
              height="14px"
              width="56px"
              animated="ani-opacity"
            />
          </div>
        </template>
      </BaseSelect>
      <div class="item bet-close hoverable" @click="closeRightSidebar">
        <BaseButton type="text">
          <IconUniClose />
        </BaseButton>
      </div>
    </div>
    <div class="scroll-y notice-content">
      <!-- <AppBetData mode="casino" :tab-val="headSelectValue" :show-tab="false" @del-mine="handleMine" /> -->
    </div>
  </div>
</template>

<style>
.casino-bet-pop {
  --tg-base-select-popper-option-active-color: var(--tg-popper-color-default);
  --tg-base-select-popper-active-color: var(--tg-popper-color-default);
}
.casino-bet-pop .popper-option {
  text-transform: capitalize;
}
</style>

<style lang="scss" scoped>
.app-notice {
  height: 100%;
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  .notice-head {
    height: var(--tg-header-height);
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--tg-secondary-dark);
    position: relative;
    box-shadow: var(--tg-header-shadow);
    flex-shrink: 0;
    touch-action: none;
    padding-right: var(--tg-spacing-10);
    .hoverable {
      padding: var(--tg-spacing-1) var(--tg-spacing-4);
      border-radius: 50%;
      transition: var(--tg-transition);
      background-color: transparent;
      &:hover {
        background-color: var(--tg-secondary-deepdark);
        --tg-icon-color: var(--tg-text-white);
      }
    }
  }
  .notice-content {
    --tg-table-th-background: var(--tg-primary-main);
    --tg-table-margin-top-empty: 24.6vh;
    // --tg-table-even-background: var(--tg-secondary-grey);
    // --tg-table-odd-background: var(--tg-secondary-dark);
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    background: var(--tg-secondary-dark);
    padding: 0 var(--tg-spacing-4) var(--tg-spacing-12);
  }
}
</style>
