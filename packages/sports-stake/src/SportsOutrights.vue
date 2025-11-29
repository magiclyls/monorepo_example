<script setup lang='ts'>
import { ApiSportOutrightList } from '@tg/apis'
import { SSBaseSecondaryAccordion } from '@tg/bccomponents'
import { useSportsDataUpdate } from '@tg/hooks'
import { ESportsToMainPageRoutes } from '@tg/types'
import { application } from '@tg/utils'
import { useTitle } from '@vueuse/core'
import { computed, onBeforeMount, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute } from 'vue-router'
import AppNavBreadCrumb from './components/AppNavBreadCrumb.vue'
import AppSportsBetButton from './components/AppSportsBetButton.vue'

const { t } = useI18n()
useTitle(t('冠军投注'))
const route = useRoute()
const si = route.query.si ? +route.query.si : 0
const ci = route.query.ci ? route.query.ci.toString() : ''
const ei = route.query.ei ? route.query.ei.toString() : ''
// 冠军数据
const params = computed(() => ({ si, page: 1, page_size: 100 }))
const { data, run, runAsync } = useRequest(ApiSportOutrightList)
/** 定时更新数据 */
const { startTimer, stopTimer } = useSportsDataUpdate(() => run(params.value))

const outrightsData = computed(() => {
  if (data.value && data.value.d) {
    const marketInfo = data.value.d.find(a => a.ei === ei)
    if (marketInfo) {
      marketInfo.ml = marketInfo.ml.map((a) => {
        return {
          ...a,
          ms: a.ms.map((b) => {
            return {
              ...b,
              cartInfo: {
                wid: b.wid,
                mlid: a.mlid,
                mll: a.mll,
                pid: a.pid,
                bt: a.bt,
                ov: b.ov,
                m: 100,
                ei: marketInfo.ei,
                si: marketInfo.si,
                hdp: b.hdp,
                sid: b.sid,
                homeTeamName: marketInfo.oen,
                awayTeamName: '',
                btn: a.btn,
                sn: b.sn,
              },
            }
          }),
        }
      })
    }
    return marketInfo
  }
})
const sportName = computed(() => outrightsData.value ? outrightsData.value.sn : '')
const regionName = computed(() => outrightsData.value ? outrightsData.value.pgn : '')
const regionId = computed(() => outrightsData.value ? outrightsData.value.pgid : '')
const leagueName = computed(() => outrightsData.value ? outrightsData.value.cn : '')
const eventName = computed(() => outrightsData.value ? outrightsData.value.oen : '')
const breadcrumb = computed(() => [
  {
    path: `/sports/${si}`,
    title: sportName.value,
    data: {
      name: ESportsToMainPageRoutes.SPORT,
      data: {
        si,
      },
    },
  },
  {
    path: `/sports/${si}/${regionId.value}?${application.objectToUrlParams({ sn: sportName.value, pgn: regionName.value })}`,
    title: regionName.value,
    data: {
      name: ESportsToMainPageRoutes.REGION,
      data: {
        si,
        pgid: regionId.value,
        query: application.objectToUrlParams({ sn: sportName.value, pgn: regionName.value }),
      },
    },
  },
  {
    path: `/sports/${si}/${regionId.value}/${ci}?${application.objectToUrlParams({ sn: sportName.value, pgn: regionName.value, cn: leagueName.value })}`,
    title: leagueName.value,
    data: {
      name: ESportsToMainPageRoutes.LEAGUE,
      data: {
        si,
        pgid: regionId.value,
        ci,
        query: application.objectToUrlParams({ sn: sportName.value, pgn: regionName.value, cn: leagueName.value }),
      },
    },
  },
  {
    path: '',
    title: eventName.value,
  },
])

onBeforeMount(() => {
  startTimer()
})
onBeforeUnmount(() => {
  stopTimer()
})

await application.allSettled([runAsync(params.value)])
</script>

<template>
  <div class="outrights">
    <AppNavBreadCrumb class="theme-bread-crumb" :breadcrumb="breadcrumb" />
    <div class="wrapper">
      <template v-if="outrightsData">
        <SSBaseSecondaryAccordion :title="outrightsData.oen" level="2">
          <div>
            <div class="btn-box">
              <AppSportsBetButton
                v-for="item in outrightsData.ml[0].ms" :key="item.wid" class="theme-bet-btn"
                :cart-info="item.cartInfo" :title="item.sn" :odds="item.ov" layout="horizontal"
              />
            </div>
          </div>
        </SSBaseSecondaryAccordion>
      </template>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.theme-bet-btn {
}

.outrights {
  padding-bottom: 32rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12rem;
}

.wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12rem;
}

.btn-box {
  display: grid;
  color: #0d2245;
  grid-gap: 8rem;
  width: 100%;
  padding: 12rem 16rem;
  grid-template-columns: repeat(auto-fit, minmax(calc(33% - 8rem / 2), 1fr));
}

.theme-bread-crumb {
}
</style>
