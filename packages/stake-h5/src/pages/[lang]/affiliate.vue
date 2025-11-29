<script lang="ts" setup>
usePageTitle({ prefix: 'affiliate', isT: true })
const { isMobile } = storeToRefs(useWindowStore())
</script>

<template>
  <RouterView :class="{ 'is-mobile': isMobile, 'is-pc': !isMobile }" />
</template>

<style lang="scss">
:root{
  --tg-affiliate-table-filter-margin-bottom: 20px;
}
</style>

<style lang="scss" scoped>
.is-mobile{
  :deep(.table-filter){
    display: grid;
    grid-template-columns: 1fr 1fr;
    &>:first-child{
      grid-column-start: span 2;
    }
    gap: var(--tg-spacing-16) var(--tg-spacing-21);
    --tg-base-date-picker-width:100%;
    --tg-base-date-picker-bother: none;
    --tg-base-select-border: none;
    --tg-base-input-style-border: none;
    --tg-base-select-style-padding-y: 10px;
    --tg-base-date-picker-padding: var(--tg-spacing-10) var(--tg-spacing-12);
    --tg-base-input-style-pad-y: 10px;
    --tg-base-date-picker-color: var(--tg-text-white);
    --tg-base-date-picker-font-weight: 500;
    --tg-base-select-style-padding-x: 12px;
    --tg-base-select-popper-font-weight: 500;
    --tg-base-select-icon-right: 12px;
    --tg-base-input-style-font-weight: 500;
    --tg-base-input-style-placeholder-opacity: 1;
  }
}
.is-pc{
  :deep(.table-filter){
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--tg-spacing-16);
    font-size: var(--tg-font-size-xs);
    margin-bottom: var(--tg-affiliate-table-filter-margin-bottom);
    --tg-base-date-picker-color: var(--tg-text-white);
    --tg-base-date-picker-font-weight: 500;
    --tg-base-select-style-padding-y: var(--tg-spacing-8);
    --tg-base-select-popper-font-weight: 500;
    --tg-base-input-style-font-weight: 500;
    --tg-base-input-style-pad-y: 8px;
    --tg-base-input-style-placeholder-opacity: 1;
  }
}
</style>

<route lang="yaml">
meta:
  layout: with-menu
  withMenuTitle: affiliate_program
  withMenuIcon: IconChessAffiliate
  withMenuMobileType: tabs
  withMenuMenu:
    - title: invitation_link
      path: /affiliate/invitation-link
      token: false
      isT: true
    - title: menu_title_commission_rate
      path: /affiliate/rebate-ratio
      token: false
      isT: true
    - title: my_data
      path: /affiliate/my-data
      token: false
      isT: true
    - title: financial_data
      path: /affiliate/financial-data
      token: false
      isT: true
    - title: commission_record
      path: /affiliate/override-record
      token: false
      isT: true
    - title: override_detail
      path: /affiliate/override-detail
      token: false
      isT: true
    - title: normal_ques
      path: /affiliate/common-problems
      token: false
      isT: true
    # - title: menu_title_direct_receive
    #   path: /affiliate/direct-receive
    #   token: false
    #   isT: true
    # - title: menu_title_add_new_subagent
    #   path: /affiliate/add-new-subagent
    #   token: false
    #   isT: true
</route>
