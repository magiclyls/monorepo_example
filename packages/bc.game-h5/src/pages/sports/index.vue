<script lang="ts" setup>
import { ref } from 'vue'
import AppSportsBetButton from '~/components/AppSportsBetButton.vue'
import AppSportsBetSlip from '~/components/AppSportsBetSlip.vue'
import AppSportsFooter from '~/components/AppSportsFooter.vue'
import AppSportsHomeNavs from '~/components/AppSportsHomeNavs.vue'
import AppSportsMarketInfo from '~/components/AppSportsMarketInfo.vue'
import AppSportsPagesTab from '~/components/AppSportsPagesTab.vue'
import AppSportsTab from '~/components/AppSportsTab.vue'
import BaseLoading from '~/components/BaseLoading.vue'

const odds = ref('1.00')
const betSlipCount = ref(1)
const currentPage = ref('home')
const currentTab = ref('1')

const currentSportsTab = ref('1')
const sportsList = [
  { label: '篮球', value: '1', icon: 'sports-football' },
  { label: '足球', value: '2', icon: 'sports-football' },
  { label: '网球', value: '3', icon: 'sports-football' },
  { label: '排球', value: '4', icon: 'sports-football' },
  { label: '棒球', value: '5', icon: 'sports-football' },
  { label: '羽毛球', value: '6', icon: 'sports-football' },
  { label: '拳击', value: '7', icon: 'sports-football' },
  { label: 'CS', value: '8', icon: 'sports-football' },
  { label: 'DOTA', value: '9', icon: 'sports-football' },
  { label: '赛车', value: '10', icon: 'sports-football' },
]

function add() {
  odds.value = (+odds.value + 1).toString()
  betSlipCount.value = betSlipCount.value + 1
}
function jian() {
  odds.value = (+odds.value - 1).toString()
  betSlipCount.value = betSlipCount.value - 1
}
</script>

<template>
  <div>
    <AppSportsHomeNavs v-model="currentPage" />
    <div class="px-[8px]">
      <h3>体育::{{ currentPage }}⚾️</h3>
      <div>
        currentTab::{{ currentTab }}
        <AppSportsPagesTab v-model="currentTab" />
      </div>

      <div class="mt-[10px]">
        <AppSportsMarketInfo />
      </div>

      <div>
        <AppSportsBetButton :odds="odds" />
        <button class="w-[100px] h-[50px] bg-amber-300 rounded-[4px] cursor-pointer" @click="add">
          +
        </button>
        <button class="w-[100px] h-[50px] bg-amber-300 rounded-[4px] cursor-pointer" @click="jian">
          -
        </button>
        <!-- 投注单组件 -->
        <AppSportsBetSlip :num="betSlipCount" />
      </div>

      <div>
        currentSportsTab::{{ currentSportsTab }}
        <AppSportsTab v-model="currentSportsTab" :list="sportsList" />
      </div>
      <div>
        <BaseLoading />
      </div>

      <AppSportsFooter />
    </div>
  </div>
</template>

<style lang="scss">

</style>
