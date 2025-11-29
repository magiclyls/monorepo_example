<script setup lang='ts'>
const { isMobile } = storeToRefs(useWindowStore())
const { t, locale } = useI18n()
const { link_url, mode, rules } = storeToRefs(useAffiliate())
const location = useBrowserLocation()
const getUrl = computed(() => {
  return `/png/${isMobile.value
    ? 'h5'
    : 'pc'}/invitation/invitation_${mode.value}.png`
})

const contents = computed(() => {
  console.log('rules.value', rules.value)
  // 需要处理 rules 的格式 如果为空 则返回空数组
  if (!Object.keys(rules.value)?.length)
    return []
  // if (Object.values(rules.value).some(
  //   arr => !Array.isArray(arr) || arr.some(item => !item || item.trim() === ''),
  // ))
  //   return []

  return rules.value[EnumLanguage[locale.value]]
})

const qrUrl = computed(() => `${location.value.origin}${link_url.value ?? ''}`)
</script>

<template>
  <div class="promotion_tutorial" :class="[{ 'pc-mode': !isMobile, 'mobile-mode': isMobile }]">
    <div class="link mb-[10px]">
      <div class="link-title">
        {{ t('my_link_2') }}
      </div>
      <AppCopyLine class="theme-copy mt-[12px]" :msg="qrUrl" />
      <div class="share-title my-[19px] text-center">
        {{ t('quickly_share') }}
      </div>
      <AppApplicationSharingLink width="40px" round :share-text="qrUrl" />
    </div>

    <div class="relation-chart">
      <BaseImage :url="getUrl" with-theme />
    </div>
    <div v-if="contents?.length" class="des">
      <div class="des-item flex flex-col">
        <div class="p">
          <div class="title">
            {{ t('rule_description') }}
          </div>
        </div>
        <div v-for="(item, index) in contents" :key="index" class="flex items-baseline">
          <div class="div-round mr-[10px]" />
          <div>
            <div class="p">
              <div class="content" v-html="item.replace(/\n/g, '<br>')" />
            </div>
          </div>
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
  --tg-app-copy-line-input-border-color: transparent;

  @include webTheme('green') {
    --tg-secondary-dark: #055434;
  }
}

.theme-copy {
  --tg-app-copy-line-input-background-color: var(--tg-secondary-grey);
  --tg-app-copy-line-button-box-background-color: var(--tg-sport-btn-hover);
  --tg-icon-color: var(--tg-secondary-light);

  @include webTheme('green') {
    --tg-app-copy-line-input-background-color: #0E6746;
    --tg-app-copy-line-button-box-background-color: #197B59;
    --tg-icon-color: #76F0C5;
    --app-copyline-color: #76F0C5;
  }

  @include webTheme('white') {
    --tg-app-copy-line-input-background-color: #E8E8E8;
    --tg-app-copy-line-button-box-background-color: #D8D8D8;
    --tg-app-copy-line-button-box-background-color-white: #D8D8D8;
    --tg-icon-color: #111111;
    --app-copyline-color: #111111;
    --tg-app-copy-line-input-wrap-box-shadow: none;
  }
}

.div-round {
  width: 4px;
  min-width: 4px;
  height: 4px;
  background-color: var(--tg-secondary-light);
  border-radius: 100%;

  @include webTheme('green') {
    background-color: #3CB389;
  }

  @include webTheme('white') {
    background-color: #555555;
  }
}

.relation-chart {
  background: var(--tg-secondary-dark);
  border-radius: var(--tg-radius-md);
  padding: 16px;

  font-family: PingFang SC;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0%;
  color: #B1BAD3;

  // padding: var(--tg-spacing-12);
  @include webTheme('white') {
    background: #F5F5F5;
  }
}

.link {
  padding: 16px;
  background: var(--tg-secondary-dark);

  @include webTheme('white') {
    background: #F5F5F5;
  }

  @include webTheme('new-default') {
    background: #0f212e;
  }

  .link-title {
    font-size: 16px;
    font-weight: 500;
  }

  .share-title {
    font-size: 16px;
    font-weight: 500;
  }
}

.des {
  display: flex;
  flex-direction: column;

  // gap: var(--tg-spacing-24);
  @include webTheme('white') {
    background: #f5f5f5;
  }

  @include webTheme('new-default') {
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

  .p {
    .title {
      font-weight: var(--tg-font-weight-semibold);
      color: var(--tg-text-white);
      font-size: var(--tg-font-size-lg);
      line-height: 28px;
      padding-bottom: 4px;
    }

    .content {
      font-weight: var(--tg-font-weight-normal);
      color: var(--tg-text-lightgrey);
      font-size: var(--tg-font-size-base);
      line-height: 22px;
    }
  }
}

@media only screen and (max-width:768px) {
  .des {
    padding: 16px 12px 28px 12px;
    margin-top: var(--tg-spacing-16);

    .p {
      .title {}

      .content {}
    }
  }
}

.pc-mode {
  padding: calc(27px - 12px) calc(20px - 12px);

  .share-title {
    font-size: 18px;
  }

  .des .des-item>* {
    margin-bottom: 8px;
  }

  .des .p .title {
    font-family: PingFang SC;
    font-weight: 600;
    font-size: 16px;
    line-height: 100%;
    letter-spacing: 0%;
    padding: 0;
  }

  .des .p .content {
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0%;

  }

  .link-title {
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 16px;
    line-height: 100%;
    letter-spacing: 0%;

  }

  :deep(.share-wrap) {
    row-gap: 25px;

    img {
      width: 45px;
      height: 45px;
    }

    .social {
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 12px;
      line-height: 100%;
      letter-spacing: 0%;
      vertical-align: middle;

    }
  }

  .link {
    @include webTheme('white') {
      background-color: #E8E8E8;
    }

    @include webTheme('green') {
      background-color: #055434;
    }

    @include webTheme('new-default') {
      background-color: #071824 !important;
    }

    border-radius: 4px;
    padding: 16px 28px;

    margin-bottom: 16px;
  }

  .relation-chart {
    @include webTheme('white') {
      background-color: #E8E8E8;
      color: #3CB389;
    }

    @include webTheme('new-default') {
      background-color: #071824 !important;
      color: #B1BAD3;
    }

    @include webTheme('green') {
      background-color: #055434;
      color: #555555;
    }

    padding: 24px 16px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    font-family: PingFang SC;
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0%;
  }

  .des {
    margin-top: 16px;

    @include webTheme('white') {
      background-color: #E8E8E8;
    }

    @include webTheme('green') {
      background-color: #055434;
    }

    @include webTheme('new-default') {
      background-color: #071824 !important;
    }

    padding: 16px 12px;
    border-radius: 4px;
    // margin-top: 0;
  }

}

.mobile-mode {
  .des {
    padding: 16px 12px 27px 12px;
  }

  .des .des-item>* {
    margin-bottom: 8px;
  }

  .des .p .title {
    font-family: PingFang SC;
    font-weight: 600;
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0%;
    padding-bottom: 0;
  }

  .des .des-item>* {
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 12px;
    line-height: 100%;
    letter-spacing: 0%;

  }

  .des .p .content {
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 12px;
    line-height: 100%;
    letter-spacing: 0%;

  }
}
</style>
