<script setup lang='ts'>
const { isMobile } = storeToRefs(useWindowStore())
const { t, locale } = useI18n()
const { mode } = storeToRefs(useAffiliate())
const { VITE_OFFICIAL_DOMAIN } = getEnv()
const { isZhcn } = storeToRefs(useLanguageStore())
console.log('mode.value', mode.value)

// 获取文案内容
const getTextContent = computed(() => {
  const prefix = `${mode.value}_`
  let sections: string[] = []

  // 根据 mode 设置不同的 sections
  if (mode.value === 1)
    sections = ['direct_team', 'own_performance', 'summary_description']
  else if (mode.value === 2)
    sections = ['direct_team', 'other_teams', 'summary_description']
  else if (mode.value === 3)
    sections = ['direct_team', 'own_performance', 'other_teams', 'summary_description']

  return sections.reduce((acc, section) => {
    const content: Array<{ type: 'example' | 'content'; text: string }> = []

    // 获取示例说明
    let exampleIndex = 1
    if (mode.value === 3 && section === 'other_teams') {
      // mode 3 时 other_teams 显示两个示例
      for (let index = 0; index < 2; index++) {
        const example = t(`${prefix}${section}_example_${exampleIndex}`)
        content.push({
          type: 'content',
          text: example,
        })
        exampleIndex++
      }
    }
    else {
      // 其他情况只显示一个示例
      const example = t(`${prefix}${section}_example_${exampleIndex}`)
      content.push({
        type: 'content',
        text: example,
      })
    }

    if (content.length > 0)
      acc[section] = content

    return acc
  }, {} as Record<string, Array<{ type: 'example' | 'content'; text: string }>>)
})

// 获取标题
function getTitle(key: string) {
  return t(`${mode.value}_${key}`)
}

const getUrl = computed(() => {
  return `/png/${isMobile.value
    ? 'h5'
    : 'pc'}/tutorial/${EnumLanguage[locale.value]}${mode.value == 1 ? '_1' : ''}.png`
})

const getProblemUrl = computed(() => {
  return `/png/${isMobile.value
    ? 'h5'
    : 'pc'}/invitation/invitation_${mode.value}.png`
})
function textMode() {

}
</script>

<template>
  <div class="promotion_tutorial" :class="{ 'pc-mode': !isMobile, 'mobile-mode': isMobile }">
    <div class="problems">
      <div class="problem-item">
        <div class="title" :class="{ isZhcn }">
          {{ t('problem_item_title_1', { name: VITE_OFFICIAL_DOMAIN }) }}
        </div>
        <div class="content" :class="{ isZhcn }">
          {{ t('problem_item_content_1', { name: VITE_OFFICIAL_DOMAIN }) }}
        </div>
      </div>
      <div class="problem-item">
        <div class="title" :class="{ isZhcn }">
          {{ t('problem_item_title_2') }}
        </div>
        <div class="content" :class="{ isZhcn }">
          {{ t('problem_item_content_2') }}
        </div>
      </div>
      <div class="problem-item">
        <div class="title" :class="{ isZhcn }">
          {{ t('problem_item_title_3') }}
        </div>
        <div class="content" :class="{ isZhcn }">
          {{ t('problem_item_content_3', { name: VITE_OFFICIAL_DOMAIN }) }}
        </div>
      </div>
      <div class="problem-item">
        <div class="title" :class="{ isZhcn }">
          {{ t('problem_item_title_4') }}
        </div>
        <div class="content" :class="{ isZhcn }">
          {{ t('problem_item_content_4') }}
        </div>
      </div>
    </div>
    <div class="problems-chart mb-[15px]">
      <BaseImage :url="getProblemUrl" with-theme />
      <div class="text-content" style="margin-top: 20px;" :class="{ isZhcn }">
        {{ t('image_ask_content_1') }}
      </div>
      <div class="text-content" :class="{ isZhcn }">
        {{ t('image_ask_content_2') }}
      </div>
    </div>
    <div class="relation-chart">
      <BaseImage :key="locale" :url="getUrl" with-theme />
    </div>
    <div class="des">
      <template v-for="(content, section) in getTextContent" :key="section">
        <div class="des-item flex flex-col">
          <div class="p">
            <div class="title">
              {{ $t(getTitle(section)) }}
            </div>
          </div>
          <template v-for="(item, index) in content" :key="index">
            <div class="flex items-baseline">
              <div class="div-round mr-[10px]" />
              <div class="p">
                <div class="content" :class="{ isZhcn }">
                  {{ $t(item.text) }}
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
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

  @include webTheme('green') {
    --tg-secondary-dark: #055434;
  }
}

.problems {
  margin-bottom: 15px;

  .problem-item {
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 12px;
    background: var(--tg-secondary-dark);

    .title {
      font-weight: 600;
      font-size: 14px;
      color: var(-tg-text-white);
      line-height: normal;
      &.isZhcn{
        font-weight: 500;
      }
    }

    .content {
      font-weight: 600;
      font-size: 14px;
      color: var(--tg-secondary-light);
      margin-top: 6px;
      line-height: normal;
      &.isZhcn{
        font-weight: 500;
      }

      @include webTheme('green') {
        color: #3CB389;
      }
    }
  }
}

.problems-chart {
  padding: 16px;
  background: var(--tg-secondary-dark);
  border-radius: var(--tg-radius-md);

  @include webTheme('white') {
    background: #F5F5F5;
  }

  .text-content {
    font-weight: 600;
    font-size: 14px;
    line-height: normal;
    color: var(--tg-text-lightgrey);
    margin-top: 2px;
    &.isZhcn{
      font-weight: 500;
    }
  }
}

.relation-chart {
  min-height: 400px;
  background: var(--tg-secondary-dark);
  border-radius: var(--tg-radius-md);

  // padding: var(--tg-spacing-12);
  @include webTheme('white') {
    background: #F5F5F5;
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
      font-weight: 600;
      color: var(--tg-text-white);
      font-size: 16px;
      line-height: normal;
      padding-bottom: 4px;

    }

    .content {
      font-weight: 600;
      color: var(--tg-text-lightgrey);
      font-size: 14px;
      line-height: normal;
      white-space: pre-line;
      &.isZhcn{
        font-weight: 500;
      }
    }
  }
}

@media only screen and (max-width:768px) {
  .des {
    padding: 16px 12px 28px 12px;
    margin-top: var(--tg-spacing-16);

    .p {
      .title {
        font-size: 14px;
      }

      .content {
        font-size: 12px;
      }
    }
  }
}

.pc-mode{
  .problems .problem-item .title{
    font-size:16px;
  }
  .problems .problem-item .content{
    font-size:14px;
  }

  padding: calc(27px - 12px) calc(20px - 12px);

  .problem-item,
  .problems-chart,
  .relation-chart,
  .des {
    background: #071824 !important;
    border-radius: 4px !important;

    @include webTheme('white') {
      background-color: #E8E8E8 !important;
    }

    @include webTheme('green') {
      background-color: #055434 !important;
    }

  }

  .problem-item {
    padding: 12px;
    border-radius: 4px;
  }

  .problems-chart {
    padding: 16px !important;
  }

  .relation-chart {
    padding: 29px 59px !important;

  }

  .des {
    margin-top: 15px !important;
    padding: 16px !important;
  }
}

.mobile-mode {
  .des .p .title {
    padding: 0;
    font-weight: 600;
    font-size: 14px;
  }

  .des .des-item>* {
    margin-bottom: 8px;
  }

  .mobile-mode .des .des-item>* {
    margin-bottom: 16px;
  }

  .des .p .content {
    font-weight: 600;
    font-size: 14px;
    &.isZhcn{
      font-weight: 500;
    }
  }
}

.pc-mode{
  .problems .problem-item .title{
    font-size:16px;
  }
  .problems .problem-item .content{
    font-size:14px;
  }

  padding: calc(27px - 12px) calc(20px - 12px);

  .problem-item,
  .problems-chart,
  .relation-chart,
  .des {
    background: #071824 !important;
    border-radius: 4px !important;

    @include webTheme('white') {
      background-color: #E8E8E8 !important;
    }

    @include webTheme('green') {
      background-color: #055434 !important;
    }

  }

  .problem-item {
    padding: 12px;
    border-radius: 4px;
  }

  .problems-chart {
    padding: 16px !important;
  }

  .relation-chart {
    padding: 29px 59px !important;

  }

  .des {
    margin-top: 15px !important;
    padding: 16px !important;
  }
}

.mobile-mode {
  .des .p .title {
    padding: 0;
    font-weight: 600;
    font-size: 14px;
  }

  .des .des-item>* {
    margin-bottom: 8px;
  }

  .mobile-mode .des .des-item>* {
    margin-bottom: 16px;
  }

  .des .p .content {
    font-weight: 600;
    font-size: 14px;
    &.isZhcn{
      font-weight: 500;
    }
  }
}
</style>
