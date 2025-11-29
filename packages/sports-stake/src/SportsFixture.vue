<script lang="ts" setup>
import { BaseImage, SSBaseEmpty, SSBaseSecondaryAccordion, SSBaseTabs } from '@tg/bccomponents'
import { useApiSportDetails } from '@tg/hooks'
import { IconUniSearch, IconUniSearch1 } from '@tg/icons'
import { application, getEnv } from '@tg/utils'
import { useIntervalFn, useTitle } from '@vueuse/core'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSportsConfig } from '../config/index'
import AppMatchStatistics from './components/AppMatchStatistics.vue'
import AppNavBreadCrumb from './components/AppNavBreadCrumb.vue'
import AppSportAllToCartEvent from './components/AppSportAllToCartEvent.vue'
import AppSportsBetButton from './components/AppSportsBetButton.vue'

defineOptions({ name: 'StakeSportsFixture' })

const { VITE_CASINO_IMG_CLOUD_URL } = getEnv()
const title = useTitle()
const { route, projectName } = useSportsConfig()
const { t } = useI18n()
const sportAllToCartEventRef = ref()
const {
  breadcrumbData,
  handicapListData,
  dataList,
  basePanelData,
  currentTab,
  searchName,
  loading,
  requestCount,
  bgImage,
  runGetSportInfo,
  resetRequestCount,
} = useApiSportDetails()

const _title = computed(() => {
  if (breadcrumbData.value.length)
    return breadcrumbData.value[breadcrumbData.value.length - 1].title

  return location.host
})
// queen项目
const isQueenH5 = computed(() => projectName === 'ph-h5')
// Afun项目
const isAfunH5 = computed(() => projectName === 'afun-h5')

function eventReceive() {
  runGetSportInfo({ si: Number(route.params.sport), ei: `${route.params.fixture}` })
}

watchEffect(() => {
  title.value = _title.value
})

// watch(
//   () => route.params,
//   (value) => {
//     if (value.sport && value.fixture) {
//       resetRequestCount()
//       runGetSportInfo({ si: Number(route.params.sport), ei: `${route.params.fixture}` })
//     }
//   },
//   { immediate: true },
// )

onMounted(() => {
  useIntervalFn(() => {
    console.error('详情倒计时结束')
    sportAllToCartEventRef.value?.send()
    runGetSportInfo({ si: Number(route.params.sport), ei: `${route.params.fixture}` })
  }, 3 * 1000)
})

await application.allSettled([runGetSportInfo({ si: Number(route.params.sport), ei: `${route.params.fixture}` })])
</script>

<template>
  <AppSportAllToCartEvent ref="sportAllToCartEventRef" @receive="eventReceive" />
  <!-- <SSAppLoading v-if="loading && requestCount === 0" full-screen /> -->
  <div class="tg-sports-tournament-fixture-betdetail">
    <div class="sports-detail-wrapper">
      <div class="layout-spacing no-bottom-spacing variant-normal">
        <AppNavBreadCrumb class="theme-bread-crumb" :breadcrumb="breadcrumbData" />
        <div class="content-wrapper">
          <div class="content stacked">
            <div class="fixture-column">
              <div
                class="background match-statistics" :style="{
                  '--sport-image': `url(${VITE_CASINO_IMG_CLOUD_URL}${bgImage})`,
                }"
              >
                <AppMatchStatistics :data="basePanelData" />
              </div>
              <div class="groups">
                <div v-if="handicapListData.length" class="flex">
                  <SSBaseTabs v-model="currentTab" :list="handicapListData" />
                </div>
                <div
                  class="rounded-[2rem] mt-[12rem] w-full bg-[var(--ss-spt-fixture-bg1)] px-[var(--ss-spt-fixture-px)] h-[var(--ss-spt-fixture-height1)] flex items-center text-[var(--ss-spt-fixture-color1)]"
                  style="border:var(--ss-spt-fixture-border1);"
                >
                  <IconUniSearch1
                    v-if="isQueenH5" class="mr-[8rem]"
                    :style="{ fontSize: 'var(--ss-spt-fixture-font-size2)', color: 'var(--ss-spt-fixture-color2)' }"
                  />
                  <IconUniSearch
                    v-else class="mr-[8rem]"
                    :style="{ fontSize: 'var(--ss-spt-fixture-font-size2)', color: 'var(--ss-spt-fixture-color2)' }"
                  />
                  <input v-model="searchName" name="搜索" class="search-input" :placeHolder="t('搜索')">
                </div>
                <div v-if="!dataList.length" class="no-markets">
                  <SSBaseEmpty :description="t('暂无可用盘口')">
                    <template #icon>
                      <div class="w-[80rem]">
                        <BaseImage :url="`/${projectName}/png/uni-empty-market.png`" />
                      </div>
                    </template>
                  </SSBaseEmpty>
                </div>
                <template v-if="currentTab !== -1">
                  <template v-for="item in dataList" :key="item.mlid">
                    <!-- 样式1 -->
                    <SSBaseSecondaryAccordion
                      v-if="item.pat === 1" class="base-secondary-accordion" :title="item.btn"
                      data-style="1" :project-name="projectName"
                    >
                      <template #default>
                        <div class="market in-mobile">
                          <AppSportsBetButton
                            v-for="outcome in item.ms" :key="outcome.wid" class="AppSportsBetButton"
                            :title="outcome.sn" :odds="outcome.ov" :cart-info="outcome.cartInfo"
                            :disabled="item.mls === 2" layout="horizontal"
                          />
                        </div>
                      </template>
                    </SSBaseSecondaryAccordion>
                    <!-- 样式2 -->
                    <SSBaseSecondaryAccordion
                      v-if="item.pat === 2" class="base-secondary-accordion" :title="item.btn"
                      data-style="2" :project-name="projectName"
                    >
                      <template #default>
                        <div class="market in-mobile">
                          <div class="table" :style="{ '--itemCount': 1 }">
                            <template v-for="nameItem in item.ms" :key="nameItem.wid">
                              <div class="column heading">
                                <span>{{ nameItem.sn }}</span>
                              </div>
                            </template>
                            <template
                              v-for="
                                valueItem in item.other
                              " :key="valueItem.wid"
                            >
                              <div class="column">
                                <AppSportsBetButton
                                  class="AppSportsBetButton" layout="horizontal"
                                  :title="valueItem.hdp" :cart-info="valueItem.cartInfo" :odds="valueItem.ov"
                                  :disabled="item.mls === 2"
                                />
                              </div>
                            </template>
                          </div>
                        </div>
                      </template>
                    </SSBaseSecondaryAccordion>
                    <!-- 样式3 -->
                    <SSBaseSecondaryAccordion
                      v-if="item.pat === 3" class="base-secondary-accordion" :title="item.btn"
                      data-style="3" :project-name="projectName"
                    >
                      <template #default>
                        <div class="market in-mobile">
                          <AppSportsBetButton
                            v-for="outcome in item.ms" :key="outcome.wid" class="AppSportsBetButton"
                            :title="outcome.sn" :odds="`${outcome.ov}`" :cart-info="outcome.cartInfo"
                            :disabled="item.mls === 2" layout="horizontal"
                          />
                        </div>
                      </template>
                    </SSBaseSecondaryAccordion>
                    <!-- 样式4 -->
                    <SSBaseSecondaryAccordion
                      v-if="item.pat === 4" class="base-secondary-accordion" :title="item.btn"
                      data-style="4" :project-name="projectName"
                    >
                      <template #default>
                        <div class="market has-3-c in-mobile">
                          <div class="table-row-3" :style="{ '--itemCount': 1 }">
                            <template v-for="nameItem in item.other" :key="nameItem.wid">
                              <div class="column heading">
                                <span>{{ nameItem.sn }}</span>
                              </div>
                            </template>
                          </div>
                        </div>
                      </template>
                    </SSBaseSecondaryAccordion>
                    <!-- 样式6 -->
                    <SSBaseSecondaryAccordion
                      v-if="item.pat === 6" class="base-secondary-accordion" :title="item.btn"
                      data-style="6" :project-name="projectName"
                    >
                      <template #default>
                        <div class="market has-3-c in-mobile">
                          <div class="table-row-3" :style="{ '--itemCount': 1 }">
                            <template v-for="nameItem in item.pat6.titleList" :key="nameItem">
                              <div class="column heading">
                                <span>{{ nameItem }}</span>
                              </div>
                            </template>
                            <template
                              v-for="
                                valueItem, index in item.pat6.list
                              " :key="index"
                            >
                              <div class="column" :data-index="index">
                                <AppSportsBetButton
                                  v-if="valueItem" class="AppSportsBetButton" layout="horizontal"
                                  :title="valueItem.sn" :cart-info="valueItem.cartInfo" :odds="valueItem.ov"
                                  :disabled="item.mls === 2"
                                />
                              </div>
                            </template>
                          </div>
                        </div>
                      </template>
                    </SSBaseSecondaryAccordion>
                    <!-- 样式8 羽毛球、网球等没有平局的波胆 -->
                    <SSBaseSecondaryAccordion
                      v-if="item.pat === 8" class="base-secondary-accordion" :title="item.btn"
                      data-style="8" :project-name="projectName"
                    >
                      <template #default>
                        <div class="market has-3-c in-mobile">
                          <div class="table" :style="{ '--itemCount': 1 }">
                            <template v-for="nameItem in item.pat6.titleList" :key="nameItem">
                              <div class="column heading">
                                <span>{{ nameItem }}</span>
                              </div>
                            </template>
                            <template
                              v-for="
                                valueItem, index in item.pat6.list
                              " :key="index"
                            >
                              <div class="column" :data-index="index">
                                <AppSportsBetButton
                                  v-if="valueItem" class="AppSportsBetButton" layout="horizontal"
                                  :title="valueItem.sn" :cart-info="valueItem.cartInfo" :odds="valueItem.ov"
                                  :disabled="item.mls === 2"
                                />
                              </div>
                            </template>
                          </div>
                        </div>
                      </template>
                    </SSBaseSecondaryAccordion>
                  </template>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-secondary-accordion {
  --ss-secondaryAccordion-content-border-color: var(--ss-spt-fixture-border2);
  --ss-secondaryAccordion-header-background: var(--ss-spt-fixture-bg5);
  --ss-secondaryAccordion-content-background: var(--ss-spt-fixture-bg6);
  margin-top: 16rem;
}

.search-input {
  width: 100%;
  height: 100%;
  font-size: 14rem;
  &::placeholder {
    color: var(--ss-spt-fixture-color12);
    font-size: var(--ss-spt-fixture-font-size1);
    opacity: 1;
    font-weight: 600;
  }
}

.wrapper-grid-center {
  display: grid;
  grid-auto-flow: row;
  gap: 8rem;
  place-items: center;
  height: 100%;
  color: var(--ss-spt-fixture-color3);
  padding: 16rem;
  position: relative;
  z-index: 2;
  flex: 1;
  place-content: center;
  text-align: center;
  background: var(--ss-spt-fixture-bg2);
}

.wobble {
  animation-name: wobble;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: cubic-bezier(0.87, -0.41, 0.19, 1.44);
}

.loader-wrapper {
  width: 100%;
  padding-top: 56.25%;
  position: relative;

  .loader {
    position: absolute;
    top: 50%;
    left: 50%;
  }
}

.iframe-box {
  display: grid;
  position: relative;
  grid-auto-flow: row;
  justify-content: stretch;
  align-items: center;
  gap: 8rem;
  padding: 0;
}

.load-more-container {
  text-align: center;
  margin-top: -10px;
}

.team-name {
  color: var(--ss-spt-fixture-color4);
  font-size: 14rem;
  font-weight: 400;
  line-height: 1.5;
  text-align: left;
  justify-content: flex-start;
  display: flex;
  align-items: center;
  flex: 1;
}

.outcomes {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 12rem;
}

.market {
  display: grid;
  color: var(--ss-spt-fixture-color5);
  grid-gap: 8rem;
  width: 100%;
  padding: 12rem 16rem;
  grid-template-columns: repeat(auto-fit, minmax(calc(33% - 8rem / 2), 1fr));

  &.in-mobile:not(.has-3-c) {
    grid-template-columns: 1fr;
  }

  &.has-3-c {
  }

  .table {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(var(--itemCount), auto);
    gap: 4rem;
  }

  .table-row-3 {
    display: grid;
    grid-template-columns: repeat(3, minmax(calc(33% - 8rem / 2), 1fr));
    grid-template-rows: repeat(var(--itemCount), auto);
    gap: 4rem;
  }

  .row {
    display: grid;
    grid-template-columns: auto 30% 30%;
    gap: 4rem;
    margin-bottom: 12rem;
    padding-top: 12rem;
    border-top: var(--ss-spt-fixture-border3);
  }

  .row:first-child {
    border: none;
    padding-top: 0;
  }

  .row:last-child {
    margin-bottom: 0;
  }

  .column.heading {
    margin-bottom: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14rem;
    color: var(--ss-spt-fixture-color6);
    line-height: 1.5;

    span {
      text-align: left;
    }
  }
}

iframe,
.iframe {
  border: none;
  width: 100%;
}

video {
  width: 100%;
  height: 100%;
}

.header-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  column-gap: 16rem;
  margin-right: 16rem;
  font-weight: 600;
  color: var(--ss-spt-fixture-color7);

  > .odds {
    white-space: nowrap;
    margin: 8rem 0;
  }

  > .h-gap {
    display: flex;
    align-items: center;

    & > * + * {
      margin-left: 12rem;
    }

    .error {
      color: var(--ss-spt-fixture-color8);
    }
  }
}

.legs {
  max-height: 240px;

  .leg {
    font-weight: 600;
    color: var(--ss-spt-fixture-color9);
    padding: 6rem 16rem;
    padding-right: 6rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.tg-sports-tournament-fixture-betdetail {
  --ss-base-switch-style-bg: var(--ss-spt-fixture-bg3);
  padding-bottom: 16rem;

  .sports-detail-wrapper {
    margin-bottom: 32rem;

    .content-wrapper {
      position: relative;
      margin-top: 12rem;

      > .content {
        width: 100%;
        display: flex;
        gap: 16rem;

        .fixture-column {
          display: flex;
          flex-direction: column;
          flex: auto;
          min-width: 0;

          > * + * {
            margin-top: 16rem;
          }

          .match-statistics {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            position: relative;
            z-index: 2;
            grid-area: statistics;
            color: var(--ss-spt-fixture-color10);

            &.background {
              padding: 32rem 16rem;
            }

            &.background::after {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              right: 0;
              background: var(--ss-spt-fixture-bg4);
              background-image: var(--sport-image);
              background-size: cover;
              background-position: center;
              opacity: 0.3;
              z-index: -1;
              background-repeat: no-repeat;
            }
          }

          .groups {
            display: flex;
            flex-direction: column;
            width: 100%;
            position: relative;
            --ss-base-select-style-padding-y: 5rem;
            --ss-secondaryAccordion-header-title-color: var(--ss-spt-fixture-color11);
            margin-top: 12rem;
          }
        }
      }
    }
  }
}
</style>
