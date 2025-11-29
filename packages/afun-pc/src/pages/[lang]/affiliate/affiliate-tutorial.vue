<script setup lang='ts'>
import CommissionRate from '~/pages/[lang]/affiliate/commission-rate.vue'

const { isMobile } = storeToRefs(useWindowStore())

const getUrl = computed(() => {
  return `/png/${isMobile.value
    ? 'h5'
: 'pc'}/tutorial/${getCurrentLanguageForBackend()}.png`
})
</script>

<template>
  <div class="promotion_tutorial">
    <div class="relation-chart">
      <BaseImage :url="getUrl" with-theme />
    </div>
    <div class="des">
      <!-- <div class="p">
        <div class="title">
          {{ $t('for_example') }}
        </div>
      </div>
      <div class="p">
        <div class="content">
          <div>{{ $t('promotion_tutorial_example_desc') }}</div>
        </div>
      </div>
      <div class="p">
        <div class="content">
          <div>{{ $t('promotion_tutorial_example_desc1') }}</div>
        </div>
      </div>
      <div class="p">
        <div class="content">
          <div>{{ $t('promotion_tutorial_example_desc2') }}</div>
        </div>
      </div> -->
      <div class="des-item flex flex-col">
        <div class="p">
          <div class="title">
            {{ $t('direct_team') }}
          </div>
        </div>
        <div class="p">
          <div class="content">
            {{ $t('promotion_tutorial_example_desc3') }}
          </div>
        </div>
        <div class="p">
          <div class="content">
            {{ $t('promotion_tutorial_direct_team_1') }}
          </div>
        </div>
        <div class="p">
          <div class="content">
            {{ $t('promotion_tutorial_direct_team_2') }}
          </div>
        </div>
        <div class="p">
          <div class="content">
            {{ $t('promotion_tutorial_direct_team_3') }}
          </div>
        </div>
      </div>
      <div class="des-item flex flex-col">
        <div class="p">
          <div class="title">
            {{ $t('other_team') }}
          </div>
        </div>
        <div class="p">
          <div class="content">
            {{ $t('promotion_tutorial_other_team_1') }}
          </div>
        </div>
        <div class="p">
          <div class="content">
            {{ $t('promotion_tutorial_other_team_2') }}
          </div>
        </div>
        <div class="p">
          <div class="content">
            {{ $t('promotion_tutorial_other_team_3') }}
          </div>
        </div>
      </div>
      <div class="des-item flex flex-col">
        <div class="p">
          <div class="title">
            {{ $t('summary') }}
          </div>
        </div>
        <div class="p">
          <div class="content">
            {{ $t('promotion_tutorial_summary_1') }}
          </div>
        </div>
        <div class="p">
          <div class="content">
            {{ $t('promotion_tutorial_summary_2') }}
          </div>
        </div>
        <div class="p">
          <div class="content">
            {{ $t('promotion_tutorial_summary_3') }}
          </div>
        </div>
        <div class="p">
          <div class="content">
            {{ $t('promotion_tutorial_summary_4') }}
          </div>
        </div>
      </div>
      <div>
        <div class="p">
          <div class="title font-[600]">
            {{ $t('commission_ratio_table_follows') }}
          </div>
          <CommissionRate clazz="grey-rate" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.promotion_tutorial {
  position: relative;
  font-size: var(--tg-font-size-xs);
  font-weight: var(--tg-font-weight-semibold);
  color: var(--tg-text-white);
  // line-height: 1.5;
  --tg-base-square-tab-bg: var(--tg-primary-main);
  --tg-base-square-tab-icon-size: var(--tg-font-size-base);
  --tg-affiliate-table-filter-margin-bottom: 0;
  --tg-base-square-tab-margin-top: 16px;

  @include webTheme('green'){
    --tg-secondary-dark: #055434;
  }
}

.relation-chart {
  min-height: 400px;
  background: var(--tg-secondary-dark);
  border-radius: var(--tg-radius-md);
  // padding: var(--tg-spacing-12);
  @include webTheme('white'){
    background: #F5F5F5;
  }
}

.des {
  display: flex;
  flex-direction: column;
  // gap: var(--tg-spacing-24);
  @include webTheme('white'){
    background: #E8E8E8;
  }
  @include webTheme('new-default'){
    background: #0f212e;
  }
  background: var(--tg-secondary-dark);
  border-radius: var(--tg-radius-md);
  padding: 16px 12px 28px 12px;
  margin-top: var(--tg-spacing-24);
  // padding: var(--tg-spacing-12);
  >* {
    margin-bottom: var(--tg-spacing-24);
  }
  >:last-child {
    margin-bottom: 0;
  }
  .des-item {
    >* {
      margin-bottom: var(--tg-spacing-12);
    }
    >:last-child {
      margin-bottom: 0;
    }
  }
  .p{
    .title {
      font-weight: var(--tg-font-weight-semibold);
      color: var(--tg-text-white);
      font-size: var(--tg-font-size-lg);
      line-height: 28px;
      padding-bottom: 4px;
    }
    .content{
      font-weight: var(--tg-font-weight-normal);
      color: var(--tg-text-lightgrey);
      font-size: var(--tg-font-size-base);
      line-height: 22px;
    }
  }
}
@media only screen and (max-width:768px) {
  .des{
    padding: 16px 12px 28px 12px;
    margin-top: var(--tg-spacing-16);
    .p{
      .title {
      }
      .content {

      }
    }
  }
}
</style>
